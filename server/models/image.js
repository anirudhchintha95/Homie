import { model, Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    filename: {
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    imageableType: {
      type: Schema.Types.String,
      required: true,
    },
    imageableId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    methods: {},
  }
);

const Image = model("Image", ImageSchema);

export default Image;
