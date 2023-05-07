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
  message = validateString(message, "message", { maxLength: 250 });

  const homie = await User.findById(homieId);

  if (!homie) {
    throw { status: 400, message: "User not found" };
  }

  const connection = await Connection.findByUserIds(currentUser._id, homie._id);

  if (!connection) {
    throw { status: 400, message: "Connection not found" };
  }

  const currentUserIdx = connection.users.findIndex(
    ({ userId }) => userId.toString() === currentUser._id.toString()
  );

  if (currentUserIdx === -1) {
    throw { status: 400, message: "User not found in connection" };
  }

  if (
    connection.users[currentUserIdx].status !== CONNECTION_STATUSES.FAVORITE
  ) {
    throw {
      status: 400,
      message: "You have to add them as your favorite to send a message",
    };
  }

  const otherUserIdx = currentUserIdx === 0 ? 1 : 0;

  if (connection.users[otherUserIdx].status === CONNECTION_STATUSES.BLOCKED) {
    throw {
      status: 400,
      message: "You have been blocked to send messages to this user",
    };
  }

  connection.messages.push({
    message,
    sentByUserId: currentUser._id,
  });

  connection.users[otherUserIdx].hasUnreadMessages = true;

  await connection.save();

  return await Connection.findByUserIds(currentUser._id, homie._id, {
    display: true,
  });
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
