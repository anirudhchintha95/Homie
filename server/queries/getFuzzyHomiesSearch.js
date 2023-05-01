import { CONNECTION_STATUSES } from "../constants.js";
import { User } from "../models/index.js";

const buildScoreColumns = (preference) => {
  const newColumns = {};
  if (preference.smoking !== undefined) {
    newColumns.smokingScore = {
      $cond: {
        if: { $eq: [{ $ifNull: ["$preferences.smoking", null] }, null] },
        then: 0,
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
        then: 0,
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
        then: 0,
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

  if (preference.rent?.exact !== undefined) {
    newColumns.rentScore = {
      $cond: {
        if: { $eq: [{ $ifNull: ["$preferences.rent.exact", null] }, null] },
        then: {
          // If exact rent is not set by the other user, then we check if the rent range is within the preference range
          $cond: {
            if: {
              if: {
                $or: [
                  { $eq: [{ $ifNull: ["$preferences.rent.min", null] }, null] },
                  { $eq: [{ $ifNull: ["$preferences.rent.max", null] }, null] },
                ],
              },
              then: true,
              else: {
                $cond: {
                  if: {
                    $and: [
                      {
                        $gte: ["$preferences.rent.exact", preference.rent.min],
                      },
                      {
                        $lte: ["$preferences.rent.exact", preference.rent.max],
                      },
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
            then: 1,
            else: 0,
          },
        },
        else: {
          $cond: {
            if: {
              $eq: ["$preferences.rent.exact", preference.rent.exact],
            },
            then: 1,
            else: 0,
          },
        },
      },
    };
  } else if (
    preference.rent?.min !== undefined &&
    preference.rent?.max !== undefined
  ) {
    newColumns.rentScore = {
      $cond: {
        if: {
          $eq: [{ $ifNull: ["$preferences.rent.exact", null] }, null],
        },
        then: {
          $cond: {
            if: {
              $gte: ["$preferences.rent.min", preference.rent.min],
              $lte: ["$preferences.rent.max", preference.rent.max],
            },
            then: true,
            else: false,
          },
        },
        else: {
          $cond: {
            if: {
              $or: [
                { $eq: [{ $ifNull: ["$preferences.rent.min", null] }, null] },
                { $eq: [{ $ifNull: ["$preferences.rent.max", null] }, null] },
              ],
            },
            then: true,
            else: {
              $cond: {
                if: {
                  $gte: ["$preferences.rent.exact", preference.rent.min],
                  $lte: ["$preferences.rent.exact", preference.rent.max],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        then: 1,
        else: 0,
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
            { $gte: ["age", preference.age.min] },
            { $lte: ["age", preference.age.max] },
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
          $in: ["gender", preference.gender || []],
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
      $lookup: {
        from: "connections",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ["$firstUserStatus", CONNECTION_STATUSES.BLOCKED] },
                  { $ne: ["$secondUserStatus", CONNECTION_STATUSES.BLOCKED] },
                  {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$firstUserId", currentUser._id] },
                          { $eq: ["$secondUserId", "$$userId"] },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ["$secondUserId", currentUser._id] },
                          { $eq: ["$firstUserId", "$$userId"] },
                        ],
                      },
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
                  if: { $eq: ["$firstUserId", currentUser._id] },
                  then: {
                    _id: "$firstUserId",
                    status: "$firstUserStatus",
                  },
                  else: {
                    _id: "$secondUserId",
                    status: "$secondUserStatus",
                  },
                },
              },
              otherUser: {
                $cond: {
                  if: { $eq: ["$firstUserId", currentUser._id] },
                  then: {
                    _id: "$secondUserId",
                    status: "$secondUserStatus",
                  },
                  else: {
                    _id: "$firstUserId",
                    status: "$firstUserStatus",
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
          // If connection exists, then firstUserStatus should be empty and the secondUserStatus should be not be blocked
          {
            $and: [
              { "connection.currentUser.status": { $exists: false } },
              { "connection.otherUser.status": { $ne: "blocked" } },
            ],
          },
        ],
      },
    },
    {
      $addFields: {
        age: {
          $dateDiff: {
            startDate: "$dateOfBirth",
            endDate: "$$NOW",
            unit: "year",
          },
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
      $match: {
        $and: [
          {
            _id: { $nin: [currentUser._id] },
          },
        ],
      },
    },
    {
      $sort: { score: -1 },
    },
    // {
    //   $limit: 1,
    // },
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
  ]);
};

export default getFuzzyHomiesSearch;
