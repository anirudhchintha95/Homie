import Image from "../models/image.js";
import User from "../models/user.js";
import PasswordService from "../services/password-service.js";
import {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
  validateDOB,
  validatePhone,
  validateGender,
  validateName,
} from "../validators/helpers.js";
import { updatePasswordValidator } from "../validators/updatePasswordValidator.js";
import { isValidObjectId } from "mongoose";
import xss from "xss";

export const getUserProfile = async (email) => {
  if (!isValidEmail(email))
    throw { status: 400, message: "Error: Invalid Email" };

  const userProfile = await User.findOne(
    { email: email },
    "-encryptedPassword -__v"
  );

  if (!userProfile) throw { status: 404, message: "User not found" };

  userProfile._id = userProfile._id.toString();
  userProfile.dateOfBirth = new Date(userProfile.dateOfBirth);
  return userProfile._doc;
};

export const getImages = async (currentUserId) => {
  if (!currentUserId) throw { status: 401, message: "Unauthorized" };

  const images = await Image.ofUser(currentUserId);

  return images;
};

export const updatePassword = async (
  currentUser,
  currentPassword,
  newPassword
) => {
  if (!currentUser) throw { status: 401, message: "Unauthorized" };

  const cleanCurrentPassword = xss(currentPassword);
  const cleanNewPassword = xss(newPassword);

  const passwordsAfterValidation = updatePasswordValidator({
    currentPassword: cleanCurrentPassword,
    newPassword: cleanNewPassword,
  });

  const validatedCurrentPassword = passwordsAfterValidation.currentPassword;
  const validatedNewPassword = passwordsAfterValidation.newPassword;

  if (!(await currentUser.verifyPassword(validatedCurrentPassword))) {
    throw { status: 400, message: "Incorrect password" };
  }

  if (validatedCurrentPassword === validatedNewPassword) {
    throw {
      status: 400,
      message: "New password cannot be same as old password",
    };
  }

  const encryptedPassword = await new PasswordService(
    validatedNewPassword
  ).encrypt();

  const result = await User.updateOne(
    { _id: currentUser._id },
    { encryptedPassword }
  );

  return result.acknowledged && result.modifiedCount !== 0;
};

export const updateUserProfile = async (
  firstName,
  lastName,
  email,
  dob,
  phoneNumber,
  gender
) => {
  firstName = xss(firstName);
  lastName = xss(lastName);
  email = xss(email);
  dob = xss(dob);
  phoneNumber = xss(phoneNumber);
  gender = xss(gender);

  firstName = validateName(firstName, "firstName");
  lastName = validateName(lastName, "lastName");
  dob = validateDOB(dob, "dob");
  phoneNumber = validatePhone(phoneNumber, "phoneNumber");
  gender = validateGender(gender, "gender");

  let updatedUser = {};

  const phoneExists = await User.findOne({ phone: phoneNumber });
  if (phoneExists && phoneExists.email !== email) {
    throw { status: 400, message: "User with the phone number already exists" };
  } else if (phoneExists && phoneExists.email === email) {
    updatedUser = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dob,
      gender: gender,
    };
  } else {
    updatedUser = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dob,
      phone: phoneNumber,
      gender: gender,
    };
  }

  const modifiedUser = await User.findOneAndUpdate(
    { email: email },
    updatedUser,
    {
      projection: {
        firstName: 1,
        lastName: 1,
        email: 1,
        dateOfBirth: 1,
        phone: 1,
        gender: 1,
      },
      returnDocument: "after",
      rawResult: true,
    }
  );

  if (modifiedUser.lastErrorObject.n === 0)
    throw { status: 404, message: "Error: User not found" };

  modifiedUser.value._doc.dateOfBirth = new Date(
    modifiedUser.value._doc.dateOfBirth
  );
  return modifiedUser.value._doc;
};

export const deleteUser = async (userId) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invaild User Id" };
  const userDeleted = await User.findOneAndDelete(
    { _id: userId },
    { projection: { _id: 1 } }
  );
  return userDeleted;
};

export const updateBio = async (userId, bio) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invalid User Id" };

  const user = await User.findById(userId);

  if (typeof bio !== "string") {
    throw { status: 400, message: "Bio must be a string" };
  }

  const sanitizedBio = xss(bio.trim());

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // if (!sanitizedBio) {
  //   throw { status: 400, message: "Bio is required" };
  // }

  if (sanitizedBio.length > 250) {
    throw { status: 400, message: "Bio must be less than 250 characters" };
  }

  if (sanitizedBio.length && sanitizedBio === user.bio) {
    throw {
      status: 400,
      message: "New bio cannot be the same as the current one",
    };
  }

  user.bio = sanitizedBio;
  await user.save();
  return user;
};
