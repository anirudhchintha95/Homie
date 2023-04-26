import { ObjectId } from "bson";
import { User } from "../models/index.js";

const getUserDetails = async (currentUser, homieId) => {
  const aggregateResult = await User.aggregate([
    {
      $match: {
        _id: new ObjectId(homieId),
      },
    },
    {
      $limit: 1,
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
                      { $eq: ["$createdByUserId", currentUser._id] },
                      { $eq: ["$createdForUserId", "$$userId"] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ["$createdForUserId", currentUser._id] },
                      { $eq: ["$createdByUserId", "$$userId"] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              status: 1,
              messages: 1,
            },
          },
        ],
        as: "connection",
      },
    },
    {
      $lookup: {
        from: "homes",
        foreignField: "userId",
        localField: "_id",
        as: "homes",
      },
    },
    {
      $lookup: {
        from: "images",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$imageableId", new ObjectId(homieId)] },
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
      $unwind: {
        path: "$connection",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        showHomieData: {
          $cond: {
            if: {
              $eq: ["$connection.createdByUserId", currentUser._id],
            },
            then: "$connection.showCreatedForUserData",
            else: "$connection.showCreatedByUserData",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: {
          $cond: {
            if: {
              $eq: ["$showHomieData", true],
            },
            then: "$email",
            else: "",
          },
        },
        phone: {
          $cond: {
            if: {
              $eq: ["$showHomieData", true],
            },
            then: "$phone",
            else: "",
          },
        },
        age: 1,
        location: 1,
        gender: 1,
        "preferences.*": 1,
        "home.*": 1,
        "images.*": 1,
        "connection._id": 1,
        "connection.status": 1,
        "connection.messages": 1,
      },
    },
  ]).exec();

  if (!aggregateResult || !aggregateResult.length) {
    throw { status: 400, message: "User not found" };
  }

  return aggregateResult[0];
};

export default getUserDetails;
