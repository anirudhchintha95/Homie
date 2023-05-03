import { isValidObjectId } from "mongoose";
import Connection from "../models/connection.js";
import { CONNECTION_STATUSES } from "../constants.js";

export const isEitherUserBlocked = async (userId, userBeingViewedId) => {
  if (!userBeingViewedId || !userId)
    throw { status: 400, message: "Error: Invalid user ID" };

  if (!isValidObjectId(userBeingViewedId) || !isValidObjectId(userId)) {
    throw { status: 400, message: "Error: Invalid user ID" };
  }

  const connection = await Connection.findByUserIds(userId, userBeingViewedId);

  if (!connection) {
    return false;
  }

  const currentUserIndex = connection.users.findIndex(
    (user) => user.userId.toString() === userId
  );

  const userBeingViewedIndex = connection.users.findIndex(
    (user) => user.userId.toString() === userBeingViewedId
  );

  return (
    connection.users[currentUserIndex].status === CONNECTION_STATUSES.BLOCKED ||
    connection.users[userBeingViewedIndex].status ===
      CONNECTION_STATUSES.BLOCKED
  );
};

export const addFavorite = async (userId, userBeingViewedId) => {
  try {
    if (!isValidObjectId(userBeingViewedId) || !isValidObjectId(userId)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }
    const connection = await Connection.findByUserIds(
      userId,
      userBeingViewedId
    );
    if (connection) {
      const currentUserIndex = connection.users.findIndex(
        (user) => user.userId.toString() === userId
      );

      if (await isEitherUserBlocked(userId, userBeingViewedId)) {
        throw {
          status: 400,
          message:
            "Error: Cannot favorite if a connection is blocked by either user",
        };
      }
      if (
        connection.users[currentUserIndex].status ===
        CONNECTION_STATUSES.FAVORITE
      ) {
        throw {
          status: 400,
          message: "Error: Current user already has the status favorite",
        };
      }

      connection.users[currentUserIndex].status = CONNECTION_STATUSES.FAVORITE;
      await connection.save();
    } else {
      const newConnection = new Connection({
        users: [
          { userId: userId, status: CONNECTION_STATUSES.FAVORITE },
          { userId: userBeingViewedId, status: null },
        ],
      });
      await newConnection.save();
    }
  } catch (err) {
    throw err;
  }
};

export const removeFavorite = async (userId, userBeingViewedId) => {
  try {
    if (!isValidObjectId(userBeingViewedId) || !isValidObjectId(userId)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }

    const connection = await Connection.findByUserIds(
      userId,
      userBeingViewedId
    );

    if (connection) {
      const currentUserIndex = connection.users.findIndex(
        (user) => user.userId.toString() === userId
      );
      if (await isEitherUserBlocked(userId, userBeingViewedId)) {
        throw {
          status: 400,
          message:
            "Error: Cannot favorite if a connection is blocked by either user",
        };
      }
      if (
        connection.users[currentUserIndex].status ===
        CONNECTION_STATUSES.IGNORED
      ) {
        throw {
          status: 400,
          message: "Error: Current user already has the status ignored",
        };
      }

      connection.users[currentUserIndex].status = CONNECTION_STATUSES.IGNORED;
      await connection.save();
    } else {
      const newConnection = new Connection({
        users: [
          { userId: userId, status: CONNECTION_STATUSES.IGNORED },
          { userId: userBeingViewedId, status: null },
        ],
      });
      await newConnection.save();
    }
  } catch (err) {
    throw err;
  }
};
