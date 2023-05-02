import { isValidObjectId } from "mongoose";
import Connection from "../models/connection.js";

export const getAllConnections = async () => {
  const connections = await Connection.find({});
  return connections;
};

export const getConnectionByCreatedForUserId = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw { status: 400, message: "Error: Invalid User Id" };
  }

  const connection = await Connection.findOne(
    { createdForUserId: userId },
    "-__v"
  );
  return connection;
};

export const createConnection = async (createdForUserId, createdByUserId) => {
  if (!isValidObjectId(createdByUserId) || !isValidObjectId(createdForUserId)) {
    throw { status: 400, message: "Error: Invalid User Id" };
  }

  const connection = await Connection.create({
    createdByUserId: createdByUserId,
    createdForUserId: createdForUserId,
  });

  return connection;
};

export const getConnectionByCreatedForAndCreatedByUserId = async (
  createdForUserId,
  createdByUserId
) => {
  if (!isValidObjectId(createdForUserId) || !isValidObjectId(createdByUserId)) {
    throw { status: 400, message: "Error: Invalid User Id" };
  }

  const connection = await Connection.findOne(
    { createdForUserId: createdForUserId, createdByUserId: createdByUserId },
    "-__v"
  );

  return connection ? connection : null;
};

export const swapConnectionUsers = async (connection) => {
  if (
    !connection ||
    !connection.createdByUserId ||
    !connection.createdForUserId
  ) {
    throw { status: 400, message: "Error: Invalid connection object" };
  }

  const temp = connection.createdByUserId;
  connection.createdByUserId = connection.createdForUserId;
  connection.createdForUserId = temp;
  return connection.save();
};

export const removeFavorite = async (user, userBeingViewed) => {
  try {
    const connection = await getConnectionByCreatedForAndCreatedByUserId(
      user,
      userBeingViewed
    );

    if (!isValidObjectId(userBeingViewed) || !isValidObjectId(user)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }

    if (connection) {
      if (connection.status === "ignored") {
        connection.status = "both_ignored";
        await connection.save();
        return connection;
      } else if (connection.status === "favorite") {
        const swappedConnection = await swapConnectionUsers(connection);
        swappedConnection.status = "ignored";
        swappedConnection.save();
        return swappedConnection;
      } else {
        // Change this
        throw { status: 500, message: "Invalid connection status" };
      }
    } else {
      const newConnection = await createConnection(userBeingViewed, user);
      newConnection.status = "ignored";
      await newConnection.save();
      return newConnection;
    }
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error",
    };
  }
};

export const addFavorite = async (user, userBeingViewed) => {
  try {
    const connectionExists = await getConnectionByCreatedForAndCreatedByUserId(
      user,
      userBeingViewed
    );

    if (!isValidObjectId(userBeingViewed) || !isValidObjectId(user)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }

    if (connectionExists) {
      if (connectionExists.status === "favorite") {
        // Connection already exists and is a favorite, update status to match
        connectionExists.status = "matched";
        await connectionExists.save();
        return connectionExists;
      } else if (
        connectionExists.status === "ignored" ||
        connectionExists.status === "both_ignored"
      ) {
        if (connectionExists.createdByUserId !== user) {
          // Connection already exists and is ignored, swap createdBy and createdFor and update status to favorite
          await swapConnectionUsers(connectionExists);
        }
        connectionExists.status = "favorite";
        await connectionExists.save();
        return connectionExists;
      } else {
        throw { status: 400, message: "Invalid connection status" };
      }
    } else {
      // Create new connection
      const newConnection = await createConnection(userBeingViewed, user);
      newConnection.status = "favorite";
      await newConnection.save();

      return newConnection;
    }
  } catch (error) {
    throw error;
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
