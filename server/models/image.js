import { model, Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "Name is required!"],
    },
    filename: {
      type: Schema.Types.String,
      required: [true, "Filename is required!"],
    },
    type: {
      type: Schema.Types.String,
      required: [true, "File Type is required!"],
    },
    imageableType: {
      type: Schema.Types.String,
      required: [true, "Imageable type is required!"],
      validate: {
        validator: function (v) {
          return ["User", "Home"].includes(v);
        },
        message: (props) => `${props.value} is not a valid imageable type!`,
      },
    },
    imageableId: {
      type: Schema.Types.ObjectId,
      required: [true, "Imageable id is required!"],
    },
  },
  {
    timestamps: true,
    statics: {
      async ofUser(userId) {
        return await this.aggregate([
          {
            $match: {
              imageableType: "User",
              imageableId: userId,
            },
          },
        ]);
      },
    },
    methods: {},
  }
);

const Image = model("Image", ImageSchema);

export default Image;
