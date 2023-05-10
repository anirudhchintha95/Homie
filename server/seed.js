import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { addFavorite, removeFavorite } from "./data/connections.js";
import { GENDERS } from "./constants.js";
import PasswordService from "./services/password-service.js";

import { User, Image } from "./models/index.js";
import { readdir, cp } from "node:fs/promises";

import { DateTime } from "luxon";

// import usersData from "./users.json" assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const usersData = require("./users.json");

const srcDir = "./seedImages/";
const destDir = "./uploads";
let filesAvailable = false;

console.log("Copying images");
try {
  await cp(srcDir, destDir, { recursive: true });
  filesAvailable = true;
} catch (e) {
  console.log(e);
}
console.log("Copied Images", filesAvailable);

const generateDob = () => {
  const minAge = 19;
  const maxAge = 100;
  const minDate = DateTime.local().minus({ years: maxAge }).toJSDate();
  const maxDate = DateTime.local().minus({ years: minAge }).toJSDate();
  return new Date(
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
  );
};

await mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

for (let i = 0; i < usersData.length; i++) {
  usersData[i].dateOfBirth = new Date(usersData[i].dateOfBirth.$date).getTime();
}

try {
  console.log("Creating Users");
  await User.insertMany(usersData);
  console.log("Users Created");
} catch (e) {
  console.log(e);
}

// create connections
const firstUserEmail = "emma.johnson@example.com";
const secondUserEmail = "andrew.ng@example.com";
const thirdUserEmail = "samantha.lee@example.com";
const fourthUserEmail = "ethan.nguyen@example.com";

const firstUser = await User.findOne({ email: firstUserEmail });
const secondUser = await User.findOne({ email: secondUserEmail });
const thirdUser = await User.findOne({ email: thirdUserEmail });
const fourthUser = await User.findOne({ email: fourthUserEmail });

try {
  console.log("Adding Connections");
  console.log("Creating matched connection");
  await addFavorite(firstUser._id.toString(), secondUser._id.toString());
  await addFavorite(secondUser._id.toString(), firstUser._id.toString());

  console.log("Creating favorite connection");
  await addFavorite(firstUser._id.toString(), thirdUser._id.toString());

  console.log("Creating ignored connection");
  await removeFavorite(firstUser._id.toString(), fourthUser._id.toString());

  console.log("Creating admired connection");
  await addFavorite(fourthUser._id.toString(), firstUser._id.toString());

  console.log("Connections Added");
} catch (e) {
  console.log("Could not create connections");
}

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
    return {};
  } else {
    const min = Math.floor(Math.random() * 1000 + 500) * 100;
    return {
      rent: {
        min,
        max: min + Math.floor(Math.random() * 1000 + 500) * 100,
      },
    };
  }
};

const generateAgePreference = () => {
  const rand = Math.random();
  if (rand < 0.66) {
    return {};
  } else {
    // age should be between 18 and 100
    let first = null;
    let second = null;
    while (first === second) {
      first = Math.floor(Math.random() * 82 + 18);
      second = Math.floor(Math.random() * 82 + 18);
    }
    return {
      age: {
        min: Math.min(first, second),
        max: Math.max(first, second),
      },
    };
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
    encryptedPassword: await new PasswordService("Password@123").encrypt(),
    dateOfBirth: generateDob(),
    role: "user",
    location:
      Math.random() < 0.5
        ? {
            city: "Hoboken",
            state: "NJ",
          }
        : {
            city: "Manhattan",
            state: "NY",
          },
    preferences: {
      ...generateBooleanPreference("smoking"),
      ...generateBooleanPreference("drinking"),
      ...generateBooleanPreference("pets"),
      ...generateRentPreference(),
      ...generateAgePreference(),
      ...generateGenders(),
    },
  };
};

console.log("Creating other users for testing...");

let users = [];
let count = 0;

let email_list = [];
while (count < 10) {
  try {
    const obj = await generateUser();
    email_list.push(obj.email);
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

let image_list = await readdir("./uploads/");
image_list = image_list.filter((word) => word.startsWith("pexels"));

const IMAGE_MAP = {
  "emma.johnson@example.com":
    "1683609104906-pexels-andrea-piacquadio-774909.jpg",
  "michael.brown@example.com":
    "1683609471012-pexels-cottonbro-studio-6626903.jpg",
  "samantha.lee@example.com":
    "1683609921611-pexels-ike-louie-natividad-2709388.jpg",
  "andrew.ng@example.com": "1683610202551-pexels-andrea-piacquadio-3778876.jpg",
  "michelle.williams@example.com":
    "1683610448752-pexels-guilherme-almeida-1858175.jpg",
  "ethan.nguyen@example.com": "1683610642320-pexels-david-florin-2553653.jpg",
  "brandon.wilson@example.com": "1683610901948-pexels-pixabay-220453.jpg",
  "vanessa.peace@example.com":
    "1683611107471-pexels-valeria-ushakova-3094215.jpg",
  "david.kim@example.com": "1683611290907-pexels-cottonbro-studio-4067753.jpg",
  "samantha.rodriguez@example.com":
    "1683611604908-pexels-vlada-karpovich-4050356.jpg",
};

for (let i = 0; i < 10; i++) {
  IMAGE_MAP[email_list[i]] = image_list[i];
}

if (filesAvailable) {
  try {
    console.log("Mapping Images");
    for (const [email, filename] of Object.entries(IMAGE_MAP)) {
      const user = await User.findOne({ email });
      await Image.create({
        name: filename,
        filename,
        type: "image/jpg",
        imageableId: user._id.toString(),
        imageableType: "User",
      });
    }
    console.log("Images Mapped");
  } catch (e) {
    console.log(e);
  }
}

console.log("Seed data generated. Press Ctrl + C to exit.");
