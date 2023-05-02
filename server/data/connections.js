import { isValidObjectId } from "mongoose";
import Connection from "../models/connection.js";

export const findByUserIds = (currentUserId, otherUserId) => {
  if (!currentUserId || !otherUserId) {
    throw new Error("Invalid user ids!");
  }

  return Connection.findOne({
    $and: [
      {
        users: {
          $elemMatch: {
            userId: currentUserId,
          },
        },
      },
      {
        users: {
          $elemMatch: {
            userId: otherUserId,
          },
        },
      },
    ],
  });
};

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
      if (connection.users[currentUserIndex].status === "favorite") {
        throw {
          status: 400,
          message: "Error: Current user already has the status favorite",
        };
      }
      if (connection.users[currentUserIndex].status === "blocked") {
        throw {
          status: 400,
          message: "Error: Cannot favorite blocked user",
        };
      }
      connection.users[currentUserIndex].status = "favorite";
      await connection.save();
    } else {
      const newConnection = new Connection({
        users: [
          { userId: userId, status: "favorite" },
          { userId: userBeingViewedId, status: null },
        ],
      });
      await newConnection.save();
    }
  } catch (err) {
    throw err;
  }
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

export const removeFavorite = async (userId, userBeingViewedId) => {
  try {
    if (!isValidObjectId(userBeingViewedId) || !isValidObjectId(userId)) {
      throw { status: 400, message: "Error: Invalid user ID" };
    }

    const connection = await findByUserIds(userId, userBeingViewedId);

    if (connection) {
      const currentUserIndex = connection.users.findIndex(
        (user) => user.userId.toString() === userId
      );
      if (connection.users[currentUserIndex].status === "ignored") {
        throw {
          status: 400,
          message: "Error: Current user already has the status ignored",
        };
      }
      if (connection.users[currentUserIndex].status === "blocked") {
        throw {
          status: 400,
          message: "Error: Cannot ignore blocked user",
        };
      }
      connection.users[currentUserIndex].status = "ignored";
      await connection.save();
    } else {
      const newConnection = new Connection({
        users: [
          { userId: userId, status: "ignored" },
          { userId: userBeingViewedId, status: null },
        ],
      });
      await newConnection.save();
    }
  } catch (err) {
    throw err;
  }
};
