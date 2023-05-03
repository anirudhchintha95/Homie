import { model, Schema } from "mongoose";
import { CONNECTION_STATUSES } from "../constants.js";

const MessageSchema = new Schema(
  {
    sentByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
    methods: {},
  }
);

const ConnectedUserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(CONNECTION_STATUSES).concat([null]),
    },
    showUserData: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    methods: {},
  }
);

const ConnectionSchema = new Schema(
  {
    users: {
      type: [ConnectedUserSchema],
      default: [],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: () => `Error: Invalid number of users!`,
      },
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,

    methods: {},
    statics: {
      async isBlocked(userId, userBeingViewedId) {
        if (!userId || !userBeingViewedId) throw new Error("Invalid user ids!");

        const currentUserIndex = this.users.findIndex(
          (user) => user.userId.toString() === userId
        );

        const userBeingViewedIndex = this.users.findIndex(
          (user) => user.userId.toString() === userBeingViewedId
        );

        return (
          this.users[currentUserIndex].status === "blocked" ||
          this.users[userBeingViewedIndex].status === "blocked"
        );
      },
      async findByUserIds(
        currentUserId,
        otherUserId,
        { display = false } = {}
      ) {
        if (!currentUserId || !otherUserId)
          throw new Error("Invalid user ids!");

        const query = this.findOne({
          $and: [
            {
              users: {
                $elemMatch: {
                  userId: currentUserId,
                },
              },
            },
            {
              users: {
                $elemMatch: {
                  userId: otherUserId,
                },
              },
            },
            {
              users: {
                $size: 2,
              },
            },
          ],
        });

        if (display) {
          return await query.projection({
            _id: 1,
            currentUser: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $ne: ["$$user.userId", currentUserId],
                },
              },
            },
            otherUser: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $eq: ["$$user.userId", otherUserId],
                },
              },
            },
            messages: 1,
          });
        }

        return await query;
      },
    },
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
