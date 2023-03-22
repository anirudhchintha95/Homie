import { model, Schema } from "mongoose";

var userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    methods: {
      async verifyPassword(password) {
        try {
          return new PasswordService(password).verify(this.encryptedPassword);
        } catch (error) {
          return false;
        }
      },
    },
  }
);

const User = model("User", userSchema);

export default User;
