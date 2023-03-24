import { model, Schema } from "mongoose";

var HomeSchema = new Schema(
  {
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
    methods: {},
  }
);

const Home = model("Home", HomeSchema);

export default Home;
