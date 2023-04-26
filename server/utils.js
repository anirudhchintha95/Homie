import ImageService from "./services/image-service.js";

export const formatUserListResponse = async (req, users) => {
  const result = [];

  for (let i = 0; i < users.length; i++) {
    const item = users[i];
    result.push(await formatUserToResponse(req, item));
  }

  return result;
};

export const formatUserToResponse = async (req, user) => {
  const baseUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/images/User/${req.currentUser._id.toString()}/download`;

  return {
    ...user,
    images: await ImageService.getImagesWithUrls(user.images, baseUrl),
  };
};
