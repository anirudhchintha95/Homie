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
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdForUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(CONNECTION_STATUSES),
      default: CONNECTION_STATUSES.FAVORITE,
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
            { createdByUserId: user1Id, createdForUserId: user2Id },
            { createdByUserId: user2Id, createdForUserId: user1Id },
          ],
        });
      },
    },
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
