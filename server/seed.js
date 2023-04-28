import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { Connection, Home, User } from "./models/index.js";
import { CONNECTION_STATUSES, GENDERS } from "./constants.js";
import PasswordService from "./services/password-service.js";

const firstNames = [
  { value: "John", gender: "Male" },
  { value: "Jane", gender: "Female" },
  { value: "Jack", gender: "Male" },
  { value: "Jill", gender: "Female" },
  { value: "James", gender: "Male" },
  { value: "Jenny", gender: "Female" },
  { value: "Jared", gender: "Male" },
  { value: "Jasmine", gender: "Female" },
  { value: "Jasper", gender: "Male" },
  { value: "Jade", gender: "Female" },
];

const lastNames = [
  "Doe",
  "Doerean",
  "Dam",
  "Smith",
  "Jones",
  "Jackson",
  "Johnson",
  "Jenkins",
  "Jensen",
  "Johansson",
];

const generatePhoneNumber = () => {
  let phone = "212";
  for (let i = 0; i < 7; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
};

const generateGenders = () => {
  // gendersLength array can range from 0 to GENDERS keys length
  const genders = Object.values(GENDERS);

  const gendersLength = Math.floor(Math.random() * genders.length);
  if (gendersLength === 0) return {};

  // Generate genders array with random gendersLength
  const arr = [];
  for (let i = 0; i < gendersLength; i++) {
    arr.push(genders[i]);
  }
  return { gender: arr };
};

const generateBooleanPreference = (key) => {
  const rand = Math.random();
  if (rand < 0.33) {
    return {};
  } else if (rand < 0.66) {
    return { [key]: true };
  } else {
    return { [key]: false };
  }
};

const generateRentPreference = () => {
  const rand = Math.random();
  if (rand < 0.33) {
    return {
      rent: {
        exact: Math.floor(Math.random() * 1000 + 500) * 100,
      },
    };
  } else if (rand < 0.66) {
    const min = Math.floor(Math.random() * 1000 + 500) * 100;
    return {
      rent: {
        min,
        max: min + Math.floor(Math.random() * 1000 + 500) * 100,
      },
    };
  } else {
    return {};
  }
};

const generateUser = async () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    firstName: firstName.value,
    lastName: lastName,
    gender: firstName.gender,
    email: `${firstName.value.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
    phone: generatePhoneNumber(),
    encryptedPassword: await new PasswordService("password").encrypt(),
    dateOfBirth: new Date(
      Date.now() - Math.floor(Math.random() * 60 * 60 * 24 * 365 * 67 * 1000)
    ),
    role: "user",
    location: {
      city: "San Francisco",
      state: "CA",
    },
    preferences: {
      ...generateBooleanPreference("smoking"),
      ...generateBooleanPreference("drinking"),
      ...generateBooleanPreference("pets"),
      ...generateRentPreference(),
      ...generateGenders(),
    },
  };
};

await mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

let users = [];
let count = 0;

while (count < 10) {
  try {
    const obj = await generateUser();
    if (
      users.find((user) => user.email === obj.email || user.phone === obj.phone)
    ) {
      continue;
    }
    console.log("Creating user", obj);
    const createdUser = await User.create(obj);
    users.push(createdUser);
    console.log("User created", createdUser.fullName());
    count++;
  } catch (error) {
    console.log(error.toString());
    count++;
  }
}

// Create homes for 3 random users

const generateHome = (user) => {
  return {
    userId: user._id,
    description: "This is a description",
    // address1 make it unique
    address1: `${Math.floor(Math.random() * 1000 + 1)} Main St`,
    // address2 make it unique
    address2: `Apt ${Math.floor(Math.random() * 1000 + 1)}`,
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    listed: Math.random() > 0.5,
    rent: Math.floor(Math.random() * 1000 + 500) * 100,
    numberOfRoomsAvailable: Math.floor(Math.random() * 5 + 1),
  };
};

for (let i = 0; i < 3; i++) {
  try {
    const user = users[Math.floor(Math.random() * users.length)];
    const home = await Home.create(generateHome(user));
    console.log("Home created", home.address1, home.address2);
  } catch (error) {
    console.log(error.toString());
  }
}

// generate 3 connections for a user and 3 connections for other users

const generateConnection = (user, otherUser) => {
  return {
    createdByUserId: user._id,
    createdForUserId: otherUser._id,
    // Status between 3 options
    status:
      Object.values(CONNECTION_STATUSES)[
        Math.floor(Math.random() * 3)
      ].toLowerCase(),
  };
};

let connLen = 0;
const connections = [];

while (connLen < 3) {
  try {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const otherUser = users[Math.floor(Math.random() * users.length)];
    if (otherUser._id === randomUser._id) continue;
    if (
      connections.find(
        (conn) =>
          (conn.createdByUserId === randomUser._id &&
            conn.createdForUserId === otherUser._id) ||
          (conn.createdByUserId === otherUser._id &&
            conn.createdForUserId === randomUser._id)
      )
    )
      continue;
    const connection = await Connection.create(
      generateConnection(randomUser, otherUser)
    );
    console.log("Connection created", connection);
    connLen++;
  } catch (error) {
    console.log(error.toString());
    connLen++;
  }
}
