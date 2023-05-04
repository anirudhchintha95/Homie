import { isValidObjectId } from "mongoose";
import { CONNECTION_STATUSES } from "../constants.js";
import Connection from "../models/connection.js";
import { validateId } from "../validators/helpers.js";

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

      if (connection.isEitherUserBlocked()) {
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
      if (connection.isEitherUserBlocked(userId, userBeingViewedId)) {
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

export const blockUser = async (userId, userBeingBlockedId) => {
  try {
    if (!isValidObjectId(userBeingBlockedId) || !isValidObjectId(userId)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }

    const connection = await Connection.findByUserIds(
      userId,
      userBeingBlockedId
    );
    if (connection) {
      const currentUserIndex = connection.users.findIndex(
        (user) => user.userId.toString() === userId
      );
      if (connection.users[currentUserIndex].status === "blocked") {
        throw {
          status: 400,
          message: "Error: Current user already has the status blocked",
        };
      }
      connection.users[currentUserIndex].status = "blocked";
      await connection.save();
    } else {
      const newConnection = new Connection({
        users: [
          { userId: userId, status: "blocked" },
          { userId: userBeingBlockedId, status: null },
        ],
      });
      await newConnection.save();
    }
  } catch (err) {
    throw err;
  }
};

export const toggleShowUserData = async (currentUserId, homieId) => {
  if (!currentUserId) {
    throw { status: 401, message: "Unauthorised request" };
  }

  homieId = validateId(homieId, "homieId");
  const connection = await Connection.findByUserIds(currentUserId, homieId);

  // Only matched connections can send messages to each other
  if (
    !connection?.users?.every(
      ({ status }) => status === CONNECTION_STATUSES.FAVORITE
    )
  ) {
    throw { status: 400, message: "Users not matched" };
  }
  const currentUserIndex = connection.users.findIndex(
    (user) => currentUserId === user.userId.toString()
  );
  if (!connection.users[currentUserIndex].showUserData) {
    connection.users[currentUserIndex].showUserData = true;
  } else {
    connection.users[currentUserIndex].showUserData = false;
  }

  await connection.save();
  return connection;
};

export const removeMatch = async (userId, userBeingViewedId) => {
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
      const userBeingViewedIndex = connection.users.findIndex(
        (user) => user.userId.toString() === userBeingViewedId
      );
      if (
        connection.users[currentUserIndex].status === "favorite" &&
        connection.users[userBeingViewedIndex].status === "favorite"
      ) {
        connection.users[currentUserIndex].status = "ignored";
        await connection.save();
      } else {
        throw {
          status: 400,
          message:
            "Error: Both users must have the status favorite to be a match",
        };
      }
    } else {
      throw { status: 400, message: "Error: Connection not found" };
    }
  } catch (err) {
    throw err;
  }
};
