import { model, Schema } from "mongoose";

const GenderSchema = new Schema({
  value: {
    type: String,
    required: true,
    enum: [
      "Male",
      "Female",
      "Non-Binary",
    ]
  },
});

const PreferenceSchema = new Schema({
  smoking: {
    type: Boolean,
    default: false,
  },
  drinking: {
    type: Boolean,
    default: false,
  },
  pets: {
    type: Boolean,
    default: false,
  },
  rent: {
    type: Object,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    exact: {
      type: Number,
      default: 0,
    },
  },
  age: {
    type: Object,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  gender: {
    type: [GenderSchema],
    default: [],
  },
});

const UserSchema = new Schema(
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
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Home",
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    preferencesId: {
      type: PreferenceSchema,
      default: {},
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
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  }
);

const User = model("User", UserSchema);

export default User;
