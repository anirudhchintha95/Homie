import User from "../models/user.js";
import helpers from "../validators/helpers.js";

const exportedMethods = {
  async getUserProfile(email) {
    email = helpers.checkString(email, 'email');

    const userProfile = await User.findOne({email: email}).exec();

    if(!userProfile) throw [404, 'User not found'];

    return userProfile;
  }

}

export default exportedMethods;