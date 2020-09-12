export const setLocalStorage = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj));
};

export const getLocalStorage = obj => {
  try {
    return localStorage.getItem(obj);
  } catch (e) {
    return e;
  }
};
