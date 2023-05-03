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
    methods: {
      isEitherUserBlocked() {
        return this.users.some(
          (user) => user.status === CONNECTION_STATUSES.BLOCKED
        );
      },
    },
    statics: {
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
              $cond: {
                if: {
                  $eq: [
                    { $arrayElemAt: ["$users.userId", 0] },
                    currentUserId,
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
                    currentUserId,
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
