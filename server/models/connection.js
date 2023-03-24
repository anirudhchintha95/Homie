import { model, Schema } from "mongoose";

var ConnectionSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matched: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showUser1Data: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showUser2Data: {
      type: Schema.Types.Boolean,
      default: false,
    },
    blocked: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    methods: {},
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
