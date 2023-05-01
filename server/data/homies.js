import { CONNECTION_STATUSES } from "../constants.js";
import Connection from "../models/connection.js";
import User from "../models/user.js";
import getFuzzyHomiesSearch from "../queries/getFuzzyHomiesSearch.js";
import getLinkedUsersQuery from "../queries/getLinkedUsersQuery.js";

import { validateLinkedHomiesBody } from "../validators/linkedHomiesValidator.js";
import { validateId, validateString } from "../validators/helpers.js";
import getUserDetails from "../queries/getUserDetails.js";

// This is fuzzy search. This needs to be properly tested
export const getHomiesFuzzy = async (currentUser) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  let feed;

  try {
    feed = await getFuzzyHomiesSearch(currentUser, currentUser.preferences);
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!feed) {
    throw { status: 400, message: "Could not fetch homies" };
  }

  return feed;
};

// TODO: Needs Pagination
export const getLinkedHomies = async (currentUser, connectionType, search) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  const newValues = validateLinkedHomiesBody({ connectionType, search });
  connectionType = newValues.connectionType;
  search = newValues.search;

  let linkedHomies;

  try {
    linkedHomies = await getLinkedUsersQuery(
      currentUser,
      connectionType,
      search
    );
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!linkedHomies) {
    throw { status: 400, message: `Could not fetch ${connectionType} homies` };
  }

  return linkedHomies;
};

export const sendMessage = async (currentUser, homieId, message) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  homieId = validateId(homieId, "homieId");
  message = validateString(message, "message", { maxLength: 20 });

  const homie = await User.findById(homieId);

  if (!homie) {
    throw { status: 400, message: "User not found" };
  }

  const connection = await Connection.findByUserIds(homie._id, currentUser._id);

  // Only matched connections can send messages to each other
  if (
    !connection?.users?.every(
      ({ status }) => status === CONNECTION_STATUSES.FAVORITE
    )
  ) {
    throw { status: 400, message: "Connection not active" };
  }

  connection.messages.push({
    message,
    sentByUserId: currentUser._id,
  });

  await connection.save();

  return connection;
};

export const getHomie = async (currentUser, homieId) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  homieId = validateId(homieId, "homieId");
  const user = await getUserDetails(currentUser, homieId);

  if (!user) {
    throw { status: 400, message: "User not found" };
  }

  return user;
};
