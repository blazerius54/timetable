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
  // return new Date(lastDayOfCurrentMonth).getDate();
};

export const countDaysToAdd = currentDate => {
  const firstMontDay = new Date(currentDate.setDate(1));
  return firstMontDay.getDay() === 0 ? 6 : firstMontDay.getDay() - 1;
};

const formDay = (isForwardDirection, currentDate, monthsDays, workDay) => {
  let newMonthsDays = monthsDays;
  const newCurrentDate = currentDate;

  if (isForwardDirection) {
    newMonthsDays[formatDate(newCurrentDate)] = {
      fullDate: new Date(newCurrentDate),
      workDay,
    };
    newCurrentDate.setDate(newCurrentDate.getDate() + 1);
  } else {
    const day = {
      fullDate: new Date(newCurrentDate),
      workDay,
    };
    const testDay = {};
    testDay[formatDate(newCurrentDate)] = day;
    // newDays[formatDate(newCurrentDay)] = day;
    // newDays = {
    //   [formatDate(newCurrentDay)]: day,
    //   ...newDays,
    // };
    newMonthsDays = {
      ...testDay,
      ...newMonthsDays,
    };
    newCurrentDate.setDate(newCurrentDate.getDate() - 1);
  }
  console.log(newMonthsDays);

  return [newCurrentDate, newMonthsDays];
};

// TODO return in app.js ???
export const formMontDays = (currentDate, workDaysCounter, direction) => {
  const isForwardDirection = direction > 0 || !direction ? 1 : 0;
  // TODO fix "february" problem
  // console.log({ lastDayOfMonth: new Date(lastDayOfMonth(currentDate)) });
  let newMonthsDays = {};
  let newCurrentDate = isForwardDirection
    ? new Date(currentDate.setDate(1))
    : new Date(lastDayOfMonth(currentDate));

  const totalDays = monthDaysCounter(newCurrentDate);
  const elementsToAdd = countDaysToAdd(currentDate);

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
      [newCurrentDate, newMonthsDays] = formDay(
        isForwardDirection,
        newCurrentDate,
        newMonthsDays,
        workDay,
      );
    }
  }

  // console.log(newMonthsDays);
  return { newMonthsDays, elementsToAdd };
};
