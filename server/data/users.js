import Image from '../models/image.js';
import User from '../models/user.js';
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
} from '../validators/helpers.js';

export const getUserProfile = async (email) => {
  if (!isValidEmail(email))
    throw { status: 400, message: 'Error: Invalid Email' };

  const userProfile = await User.findOne(
    { email: email },
    '-encryptedPassword -__v'
  );

  if (!userProfile) throw { status: 404, message: 'User not found' };

  userProfile._id = userProfile._id.toString();
  return userProfile._doc;
};

export const getImages = async (currentUser) => {
  if (!currentUser) throw { status: 401, message: 'Unauthorized' };

  const images = await Image.find({
    imageableId: currentUser._id,
    imageableType: 'User',
  });

  return images;
};

export const updateUserProfile = async (
  firstName,
  lastName,
  email,
  dob,
  phoneNumber,
  gender
) => {
  firstName = validateString(firstName, 'firstName');
  lastName = validateString(lastName, 'lastName');
  dob = validateDOB(dob, 'dob');
  phoneNumber = validatePhone(phoneNumber, 'phoneNumber');
  gender = validateGender(gender, 'gender');

  const updatedUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dob,
    phone: phoneNumber,
    gender: gender,
  };

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
      returnDocument: 'after',
      rawResult: true,
    }
  );

  if (modifiedUser.lastErrorObject.n === 0)
    throw { status: 404, message: 'Error: User not found' };

  return modifiedUser.value._doc;
};
