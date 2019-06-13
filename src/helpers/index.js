export const setLocalStorage = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj));
};

export const getLocalStorage = obj => {
  const result = localStorage.getItem(obj);
  return JSON.parse(result);
};
