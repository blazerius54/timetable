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

export const monthDaysCounter = currentDate =>
  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
