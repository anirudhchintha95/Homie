export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return;
  }
};

export const setToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearFromStorage = (key) => {
  localStorage.removeItem(key);
};

export const getFullName = (user) => {
  return `${user.firstName} ${user.lastName}`;
};

export const getAvatarName = (user) => {
  return `${user.firstName[0]}${user.lastName[0]}`;
};
