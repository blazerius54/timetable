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

export const formMontDays = (currentDate, workDaysCounter, direction) => {
  // console.log(new Date().setDate(lastDayOfMonth(currentDate)));

  let newMonthsDays = {};
  const newCurrentDate =
    direction > 0 || !direction
      ? new Date(currentDate.setDate(1))
      : new Date(lastDayOfMonth(currentDate));

  const firstMontDay = new Date(currentDate.setDate(1));

  const totalDays = monthDaysCounter(newCurrentDate);
  const elementsToAdd =
    firstMontDay.getDay() == 0 ? 6 : firstMontDay.getDay() - 1;


  if (direction > 0 || !direction) {
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
        newMonthsDays[formatDate(newCurrentDate)] = {
          fullDate: new Date(newCurrentDate),
          workDay,
        };
        newCurrentDate.setDate(newCurrentDate.getDate() + 1);
      }
    }
  } else {
    for (
      let i = totalDays + elementsToAdd, j = workDaysCounter;
      i > 0;
      i--, j--
    ) {
      if (i === elementsToAdd) {
        j = workDaysCounter;
      }

      if (j === -2) {
        j = 2;
      }

      const workDay = j > 0;

      if (i <= elementsToAdd) {
        newMonthsDays[i] = {};
      } else {
        newMonthsDays = {
          [formatDate(newCurrentDate)]: {
            fullDate: new Date(newCurrentDate),
            workDay,
          },
          ...newMonthsDays,
        };
        // newMonthsDays[formatDate(newCurrentDate)] = {
        //   fullDate: new Date(newCurrentDate),
        //   workDay,
        // };
        newCurrentDate.setDate(newCurrentDate.getDate() - 1);
      }
    }
  }

  return { newMonthsDays, elementsToAdd }
};
