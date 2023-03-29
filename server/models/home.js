import { model, Schema } from "mongoose";

const HomeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
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
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    listed: {
      type: Boolean,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    numberOfRoomsAvailable: {
      type: Number,
      required: true,
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
