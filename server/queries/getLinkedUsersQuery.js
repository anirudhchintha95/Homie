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
              $or: [
                {
                  $and: [
                    { $eq: ["$firstUserId", currentUser._id] },
                    { $eq: ["$secondUserId", "$$userId"] },
                    ...(connectionType === CONNECTION_TYPES.MATCHED
                      ? [
                          {
                            $eq: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $eq: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.FAVORITES
                      ? [
                          {
                            $eq: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.IGNORED
                      ? [
                          {
                            $eq: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.IGNORED,
                            ],
                          },
                          {
                            $ne: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.ADMIRERS
                      ? [
                          {
                            $eq: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
                  ],
                },
                {
                  $and: [
                    { $eq: ["$secondUserId", currentUser._id] },
                    { $eq: ["$firstUserId", "$$userId"] },
                    ...(connectionType === CONNECTION_TYPES.MATCHED
                      ? [
                          {
                            $eq: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $eq: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.FAVORITES
                      ? [
                          {
                            $eq: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.IGNORED
                      ? [
                          {
                            $eq: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.IGNORED,
                            ],
                          },
                          {
                            $ne: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
                    ...(connectionType === CONNECTION_TYPES.ADMIRERS
                      ? [
                          {
                            $eq: [
                              "$firstUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.FAVORITE,
                            ],
                          },
                          {
                            $ne: [
                              "$secondUserStatus",
                              CONNECTION_STATUSES.BLOCKED,
                            ],
                          },
                        ]
                      : []),
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
  });
  pipeline.push({
    $match: {
      "connection._id": { $exists: true },
      _id: { $ne: currentUser._id },
    },
  });
  pipeline.push({
    $addFields: { connection: { $arrayElemAt: ["$connection", 0] } },
  });
  pipeline.push({
    $lookup: {
      from: "images",
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$imageableId", currentUser._id] },
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
