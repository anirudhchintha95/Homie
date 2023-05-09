import { CONNECTION_STATUSES } from "../constants.js";
import { User } from "../models/index.js";

const buildScoreColumns = (preference) => {
  const newColumns = {};
  if (preference.smoking !== undefined) {
    newColumns.smokingScore = {
      $cond: {
        if: { $eq: [{ $ifNull: ["$preferences.smoking", null] }, null] },
        then: 1,
        else: {
          $cond: {
            if: {
              $eq: ["$preferences.smoking", preference.smoking],
            },
            then: 1,
            else: 0,
          },
        },
      },
    };
  } else {
    newColumns.smokingScore = 1;
  }

  if (preference.drinking !== undefined) {
    newColumns.drinkingScore = {
      $cond: {
        if: { $eq: [{ $ifNull: ["$preferences.drinking", null] }, null] },
        then: 1,
        else: {
          $cond: {
            if: {
              $eq: ["$preferences.drinking", preference.drinking],
            },
            then: 1,
            else: 0,
          },
        },
      },
    };
  } else {
    newColumns.drinkingScore = 1;
  }

  if (preference.pets !== undefined) {
    newColumns.petsScore = {
      $cond: {
        if: { $eq: [{ $ifNull: ["$preferences.pets", null] }, null] },
        then: 1,
        else: {
          $cond: {
            if: {
              $eq: ["$preferences.pets", preference.pets],
            },
            then: 1,
            else: 0,
          },
        },
      },
    };
  } else {
    newColumns.petsScore = 1;
  }

  if (
    preference.rent?.min !== undefined &&
    preference.rent?.max !== undefined
  ) {
    newColumns.rentScore = {
      $cond: {
        if: {
          $and: [
            { $eq: [{ $ifNull: ["$preferences.rent.min", null] }, null] },
            { $eq: [{ $ifNull: ["$preferences.rent.max", null] }, null] },
          ],
        },
        then: 1,
        else: {
          $cond: {
            if: {
              $and: [
                { $gte: ["$preferences.rent.min", preference.rent.min] },
                { $lte: ["$preferences.rent.max", preference.rent.max] },
              ],
            },
            then: 1,
            else: 0,
          },
        },
      },
    };
  } else {
    newColumns.rentScore = 1;
  }
  if (preference.age?.min !== undefined && preference.age?.max !== undefined) {
    newColumns.ageScore = {
      $cond: {
        if: {
          $and: [
            { $gte: ["$age", preference.age.min] },
            { $lte: ["$age", preference.age.max] },
          ],
        },
        then: 1,
        else: 0,
      },
    };
  } else {
    newColumns.ageScore = 1;
  }
  if (preference.genders !== undefined && preference.genders?.length) {
    newColumns.genderScore = {
      $cond: {
        if: {
          $in: ["gender", preference.genders || []],
        },
        then: 1,
        else: 0,
      },
    };
  } else {
    newColumns.genderScore = 1;
  }

  return newColumns;
};

const getFuzzyHomiesSearch = async (currentUser, preferences) => {
  return User.aggregate([
    {
      $match: {
        "location.city": currentUser.location.city,
        "location.state": currentUser.location.state,
        _id: { $ne: currentUser._id },
      },
    },
    {
      $lookup: {
        from: "connections",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // users records size should be 2
                  { $eq: [{ $size: "$users" }, 2] },
                  // users array should have exactly one current user and one other user
                  {
                    $eq: [
                      {
                        $size: {
                          $filter: {
                            input: "$users",
                            as: "user",
                            cond: {
                              $eq: ["$$user.userId", currentUser._id],
                            },
                          },
                        },
                      },
                      1,
                    ],
                  },
                  {
                    $eq: [
                      {
                        $size: {
                          $filter: {
                            input: "$users",
                            as: "user",
                            cond: {
                              $ne: ["$$user.userId", "$$userId"],
                            },
                          },
                        },
                      },
                      1,
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              currentUser: {
                $cond: {
                  if: {
                    $eq: [
                      { $arrayElemAt: ["$users.userId", 0] },
                      currentUser._id,
                    ],
                  },
                  then: {
                    $arrayElemAt: ["$users", 0],
                  },
                  else: {
                    $arrayElemAt: ["$users", 1],
                  },
                },
              },
              otherUser: {
                $cond: {
                  if: {
                    $eq: [
                      { $arrayElemAt: ["$users.userId", 0] },
                      currentUser._id,
                    ],
                  },
                  then: {
                    $arrayElemAt: ["$users", 1],
                  },
                  else: {
                    $arrayElemAt: ["$users", 0],
                  },
                },
              },
            },
          },
        ],
        as: "connection",
      },
    },
    {
      $addFields: { connection: { $arrayElemAt: ["$connection", 0] } },
    },
    {
      $match: {
        $or: [
          { "connection._id": { $exists: false } },
          {
            $and: [
              { "connection.currentUser.status": { $exists: false } },
              {
                "connection.otherUser.status": CONNECTION_STATUSES.FAVORITE,
              },
            ],
          },
        ],
      },
    },
    {
      $addFields: {
        age: {
          $subtract: [
            {
              $dateDiff: {
                startDate: "$dateOfBirth",
                endDate: "$$NOW",
                unit: "year",
              },
            },
            {
              $cond: {
                if: {
                  $gte: [
                    {
                      $dateFromParts: {
                        year: { $year: "$$NOW" },
                        month: { $month: "$dateOfBirth" },
                        day: { $dayOfMonth: "$dateOfBirth" },
                      },
                    },
                    "$$NOW",
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        ...buildScoreColumns(preferences),
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            "$genderScore",
            "$ageScore",
            "$rentScore",
            "$petsScore",
            "$smokingScore",
            "$drinkingScore",
          ],
        },
      },
    },
    {
      $sort: { score: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "images",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$imageableId", "$$userId"] },
                  { $eq: ["$imageableType", "User"] },
                ],
              },
            },
          },
        ],
        as: "images",
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        age: 1,
        images: 1,
        gender: 1,
        score: 1,
        genderScore: 1,
        ageScore: 1,
        rentScore: 1,
        petsScore: 1,
        smokingScore: 1,
        drinkingScore: 1,
      },
    },
  ]);
};

export default getFuzzyHomiesSearch;
