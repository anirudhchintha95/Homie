import getFuzzyHomiesSearch from "../queries/getFuzzyHomiesSearch.js";
import getLinkedUsersQuery from "../queries/getLinkedUsersQuery.js";

import { validateLinkedHomiesBody } from "../validators/linkedHomiesValidator.js";

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