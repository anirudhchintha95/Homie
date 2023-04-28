import React, { useCallback } from "react";
import {
  addUserAsFavoriteApi,
  removeUserAsFavoriteApi,
  removeMatchedUserApi,
  blockUserApi,
} from "./api/homies";

const getActionApiFunction = (action) => {
  switch (action) {
    case "addFavorite":
      return addUserAsFavoriteApi;
    case "removeFavorite":
      return removeUserAsFavoriteApi;
    case "removeMatched":
      return removeMatchedUserApi;
    case "block":
      return blockUserApi;
    default:
      return;
  }
};

const useHomieInteractions = ({ user }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();

  const handleActionClick = useCallback(
    async (action, successCallback) => {
      try {
        setLoading(true);
        const apiFunction = getActionApiFunction(action);
        if (!apiFunction) {
          throw new Error("Invalid action");
        }
        const updatedUser = await apiFunction(user?._id);
        successCallback(updatedUser);
      } catch (e) {
        setError(
          e?.response?.data?.error || e?.message || "Could not set as favorite"
        );
      } finally {
        setLoading(false);
      }
    },
    [user?._id]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, resetError, handleActionClick };
};

export default useHomieInteractions;
