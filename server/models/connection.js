import { model, Schema } from "mongoose";

// const MessageSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     message: {
//       type: Schema.Types.String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     methods: {},
//   }
// );

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
    matched: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showCreatedByUserData: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showCreatedForUserData: {
      type: Schema.Types.Boolean,
      default: false,
    },
    blockedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // messages: {
    //   type: [MessageSchema],
    //   default: [],
    // },
  },
  {
    timestamps: true,
    methods: {},
  }
);

const Connection = model("Connection", ConnectionSchema);

export default Connection;
