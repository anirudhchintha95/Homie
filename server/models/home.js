import { model, Schema } from "mongoose";

const HomeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    address1: {
      type: String,
      required: [true, "Street Address is required!"],
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required!"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required!"],
      trim: true,
    },
    zip: {
      type: String,
      required: [true, "Zip is required!"],
      trim: true,
    },
    listed: {
      type: Boolean,
      required: [true, "Home Listed is required!"],
    },
    rent: {
      type: Number,
      required: [true, "Rent(Approx.) is required!"],
    },
    numberOfRoomsAvailable: {
      type: Number,
      required: [true, "Number of Rooms Available is required!"],
    },
  },
  {
    timestamps: true,
    methods: {
      displayAddress() {
        return `${this.address1}, ${this.address2}, ${this.city}, ${this.state}, ${this.zip}`;
      },
    },
  }
);

const Home = model("Home", HomeSchema);

export default Home;
