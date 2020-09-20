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

const formatDate = date =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const lastDayOfMonth = date => {
  const nextMonth = new Date().setMonth(date.getMonth() + 1);
  return new Date(nextMonth).setDate(0);
};

export const countDaysToAdd = currentDate => {
  const firstMontDay = new Date(currentDate.setDate(1));
  return firstMontDay.getDay() === 0 ? 6 : firstMontDay.getDay() - 1;
};

const formDay = isForwardDirection => (currentDate, monthsDays, workDay) => {
  let newMonthsDays = monthsDays;
  const newCurrentDate = currentDate;
  const dayOperand = isForwardDirection ? 1 : -1;

  const day = {
    fullDate: new Date(newCurrentDate),
    workDay,
  };

  if (isForwardDirection) {
    newMonthsDays[formatDate(newCurrentDate)] = day;
  } else {
    newMonthsDays = {
      [formatDate(newCurrentDate)]: day,
      ...newMonthsDays,
    };
  }

  newCurrentDate.setDate(newCurrentDate.getDate() + dayOperand);

  return [newCurrentDate, newMonthsDays];
};

// TODO return in app.js ???
export const formMontDays = (currentDate, workDaysCounter, direction) => {
  const isForwardDirection = direction > 0 || !direction;
  // TODO fix "february" problem
  let newMonthsDays = {};
  let newCurrentDate = isForwardDirection
    ? new Date(currentDate.setDate(1))
    : new Date(lastDayOfMonth(currentDate));

  const totalDays = monthDaysCounter(newCurrentDate);
  const elementsToAdd = countDaysToAdd(currentDate);
  const formDayWithDirection = formDay(isForwardDirection);

  for (
    let i = 0, j = workDaysCounter;
    i < totalDays + elementsToAdd;
    i++, j--
  ) {
    if (i === elementsToAdd) {
      j = workDaysCounter;
    }

    if (j === -2) {
      j = 2;
    }

    const workDay = j > 0;

    if (i < elementsToAdd) {
      newMonthsDays[i] = {};
    } else {
      [newCurrentDate, newMonthsDays] = formDayWithDirection(
        newCurrentDate,
        newMonthsDays,
        workDay,
      );
    }
  }

  return { newMonthsDays, elementsToAdd };
};
