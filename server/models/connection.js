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

const ConnectionSchema = new Schema(
  {
    firstUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    secondUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstUserStatus: {
      type: Schema.Types.String,
      enum: Object.values(CONNECTION_STATUSES),
    },
    secondUserStatus: {
      type: Schema.Types.String,
      enum: Object.values(CONNECTION_STATUSES),
    },
    showCreatedByUserData: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showCreatedForUserData: {
      type: Schema.Types.Boolean,
      default: false,
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
      async findByUserIds(user1Id, user2Id) {
        return await this.findOne({
          $or: [
            { firstUserId: user1Id, secondUserId: user2Id },
            { firstUserId: user2Id, secondUserId: user1Id },
          ],
        });
      },
    },
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
