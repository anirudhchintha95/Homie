import { isValidObjectId } from "mongoose";
import Connection from "../models/connection.js";

export const getAllConnections = async () => {
  const connections = await Connection.find({});
  return connections;
};

export const getConnectionByCreatedForUserId = async (userId) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invalid User Id" };

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
  if (!connection) {
    throw { status: 400, message: "Error: Invalid connection object" };
  }

  const temp = connection.createdByUserId;
  connection.createdByUserId = connection.createdForUserId;
  connection.createdForUserId = temp;
  return connection.save();
};
