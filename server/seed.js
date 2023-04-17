import mongoose from "mongoose";
import Connection from "./models/connection.js";
import Home from "./models/home.js";
import User from "./models/user.js";

await mongoose
    .connect("mongodb://127.0.0.1:27017/Homie")
    .then(() => console.log(`Database connected successfully`))
    .catch((err) => console.log(err));

let user1, user2, home, connection;

// Dev: Adding encrypted password for john.doe@gmail.com till sign-up is implemented
try {
    user1 = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        phone: "1234567890",
        encryptedPassword:
            "$2b$10$N787npUo5rSrTwHf.ZIPXOeE8cFYWLcBGaQaU5ZByxuh0G0R6tc1m",
        dateOfBirth: "01/01/2000",
        gender: "Male",
        location: {
            city: "San Francisco",
            state: "CA",
        },
        role: "user",
        preferences: {
            smoking: true,
        },
    });
    console.log("User 1 created", user1.fullName());
} catch (error) {
    console.log(error.toString());
}

try {
    user2 = await User.create({
        firstName: "Jane",
        lastName: "Doerean",
        email: "jane.doerean@gmail.com",
        phone: "0987654321",
        encryptedPassword: "password",
        dateOfBirth: "01/01/2000",
        gender: "Female",
        location: {
            city: "San Francisco",
            state: "CA",
        },
        role: "user",
        preferences: {
            smoking: false,
        },
    });
    console.log("User 2 created", user1.fullName());
} catch (error) {
    console.log(error);
}

try {
    user1.preferences.drinking = true;
    await user1.save();
} catch (error) {
    console.log(error);
}

try {
    home = await Home.create({
        userId: user1._id,
        address1: "123 Main St",
        address2: "Apt 1",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        listed: true,
        rent: 1000,
        numberOfRoomsAvailable: 1,
    });
    console.log("Home created", home.address1);
} catch (error) {
    console.log(error);
}

try {
    connection = await Connection.create({
        createdByUserId: user1._id,
        createdForUserId: user2._id,
        matched: false,
    });
    console.log("User", user1.fullName(), "liked user", user2.fullName());
} catch (error) {
    console.log(error);
}

try {
    connection.matched = true;
    await connection.save();
    console.log(
        "User",
        user2.fullName(),
        "liked user",
        user1.fullName(),
        "back. Now they are matched!"
    );
} catch (error) {
    console.log(error);
}
