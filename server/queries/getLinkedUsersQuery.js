import { CONNECTION_STATUSES, CONNECTION_TYPES } from "../constants.js";
import { User } from "../models/index.js";

const getLinkedUsersQuery = async (currentUser, connectionType, search) => {
  const pipeline = [];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      },
    });
  }
  pipeline.push({
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
                // users array should have 2 objects with userId. Each userId should equal to current user and other user
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
                {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$users",
                          as: "user",
                          cond: {
                            $eq: ["$$user.status", CONNECTION_STATUSES.BLOCKED],
                          },
                        },
                      },
                    },
                    0,
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
        {
          $match: {
            _id: { $exists: true },
            ...(connectionType === CONNECTION_TYPES.MATCHED
              ? {
                  "currentUser.status": CONNECTION_STATUSES.FAVORITE,
                  "otherUser.status": CONNECTION_STATUSES.FAVORITE,
                }
              : {}),
            ...(connectionType === CONNECTION_TYPES.FAVORITES
              ? {
                  "currentUser.status": CONNECTION_STATUSES.FAVORITE,
                  "otherUser.status": {
                    $ne: CONNECTION_STATUSES.FAVORITE,
                  },
                }
              : {}),
            ...(connectionType === CONNECTION_TYPES.IGNORED
              ? {
                  "currentUser.status": CONNECTION_STATUSES.IGNORED,
                }
              : {}),
            ...(connectionType === CONNECTION_TYPES.ADMIRERS
              ? {
                  "otherUser.status": CONNECTION_STATUSES.FAVORITE,
                  "currentUser.status": {
                    $ne: CONNECTION_STATUSES.FAVORITE,
                  },
                }
              : {}),
          },
        },
      ],
      as: "connection",
    },
  });
  pipeline.push({
    $addFields: { connection: { $arrayElemAt: ["$connection", 0] } },
  });
  pipeline.push({
    $match: {
      "connection._id": { $exists: true },
      _id: { $ne: currentUser._id },
    },
  });
  pipeline.push({
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
  });

  return User.aggregate(pipeline);
};

export default getLinkedUsersQuery;
