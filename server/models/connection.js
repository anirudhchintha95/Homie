import { model, Schema } from "mongoose";
import { CONNECTION_STATUSES } from "../constants.js";
import { validateString } from "../validators/helpers.js";

const MessageSchema = new Schema(
  {
    sentByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sent by user is required!"],
    },
    message: {
      type: Schema.Types.String,
      required: [true, "Message is required!"],
      validate: {
        validator: function (v) {
          try {
            validateString(v, "message", {
              minLength: 1,
              maxLength: 250,
            });
            return true;
          } catch {
            return false;
          }
        },
        message: () => `Message length should be between 1 and 250 chars!`,
      },
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
      required: [true, "User is required!"],
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(CONNECTION_STATUSES).concat([null]),
    },
    showUserData: {
      type: Schema.Types.Boolean,
      default: false,
    },
    hasUnreadMessages: {
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
      required: [true, "Users are required!"],
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

        const queryObjs = [
          {
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
          },
        ];

        if (display) {
          queryObjs.push({
            _id: 1,
            currentUser: {
              $cond: {
                if: {
                  $eq: [{ $arrayElemAt: ["$users.userId", 0] }, currentUserId],
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
                  $eq: [{ $arrayElemAt: ["$users.userId", 0] }, currentUserId],
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
            hasUnreadMessages: 1,
          });
        }

        return await this.findOne(...queryObjs);
      },
    },
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
