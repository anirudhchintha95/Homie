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

export const updateUserProfile = async (data) => {

  let updatedUser = {};

  if (data.firstName) {
    data.firstName = xss(data.firstName);
    data.firstName = validateString(data.firstName, "firstName");
    updatedUser.firstName = data.firstName;
  }

  if (data.lastName) {
    data.lastName = xss(data.lastName);
    data.lastName = validateString(data.lastName, "lastName");
    updatedUser.lastName = data.lastName;
  }

  if (data.dob) {
    data.dob = xss(data.dob);
    data.dob = validateDOB(data.dob, "dob");
    updatedUser.dateOfBirth = data.dob;
  }

  if (data.phoneNumber) {
    data.phoneNumber = xss(data.phoneNumber);
    data.phoneNumber = validatePhone(data.phoneNumber, "phoneNumber");
    const phoneExists = await User.findOne({ phone: data.phoneNumber });
    if (!phoneExists) {
      updatedUser.phone = data.phoneNumber;
    }
    if (phoneExists && phoneExists.email !== data.email) {
      throw {
        status: 400,
        message: "User with the phone number already exists",
      };
    }
  }

  if (data.gender) {
    data.gender = xss(data.gender);
    data.gender = validateGender(data.gender, "gender");
    updatedUser.gender = data.gender;
  }

  const modifiedUser = await User.findOneAndUpdate(
    { email: data.email },
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
