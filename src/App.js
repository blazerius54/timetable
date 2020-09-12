import React, { useState, useEffect } from 'react';
import { months } from './data';
import Legend from './components/Legend';
import { setLocalStorage, getLocalStorage, monthDaysCounter } from './helpers';
import Navigation from './components/Navigation';
import DaysOfWeek from './components/DaysOfWeek';
import MonthsDays from './components/MonthsDays';
import Payroll from './components/Payroll';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [workDaysCounter, setWorkDaysCounter] = useState(2);
  const [prevMonthCounter, setPrevMonthCounter] = useState(null);
  const [nextMonthCounter, setNextMonthCounter] = useState(null);
  const [remoteDirection, setDirection] = useState(1);
  const [monthsDays, setMonthsDays] = useState({});
  const overworkDays = getLocalStorage('workDaysCounter');

  useEffect(() => {
    setWorkDaysCounter(nextMonthCounter);
    console.log({ workDaysCounter, nextMonthCounter });
  }, [nextMonthCounter]);

  const switchMonth = n => {
    console.log('switchMonth', prevMonthCounter, nextMonthCounter);
    // setWorkDaysCounter(nextMonthCounter)
    const dateWithNewMonth = currentDate;
    currentDate.setMonth(currentDate.getMonth() + n);
    setCurrentDate(dateWithNewMonth);
    setDirection(n);
    fillMonth();
  };

  const setExtremeDaysStatus = (monthDays, elementsToAdd) => {
    const daysValues = Object.values(monthDays);

    const [firstDay, secondDay] = [
      daysValues[elementsToAdd],
      daysValues[elementsToAdd + 1],
    ];
    const [preLastDay, lastDay] = daysValues.slice(-2);

    const result =
      Number(lastDay.workDay) === 0 && Number(preLastDay.workDay) === 0
        ? 2
        : lastDay.workDay - preLastDay.workDay;
    setNextMonthCounter(result);
  };

  const fillMonth = () => {
    const newMonthsDays = {};
    const newCurrentDate = new Date(currentDate.setDate(1));
    const totalDays = monthDaysCounter(newCurrentDate);
    const elementsToAdd =
      newCurrentDate.getDay() == 0 ? 6 : newCurrentDate.getDay() - 1;

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

    setExtremeDaysStatus(newMonthsDays, elementsToAdd);
    setMonthsDays(newMonthsDays);
  };

  const addOverworkDays = formattedDate => {
    let newMonthsDays = monthsDays;
    let newTotalWorkDays = totalWorkDays;
    const workDay = !newMonthsDays[formattedDate].workDay;

    const newDay = {
      ...newMonthsDays[formattedDate],
      workDay,
    };

    if (workDay) {
      newTotalWorkDays++;
    } else {
      newTotalWorkDays--;
    }

    newMonthsDays = {
      ...newMonthsDays,
      [formattedDate]: newDay,
    };

    setMonthsDays(newMonthsDays);
    setTotalWorkDays(newTotalWorkDays);
  };

  const formatDate = date =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  // const setOverworkDays = (key, day) => {
  //   if (overworkDays[key]) {
  //     delete overworkDays[key];
  //     setLocalStorage('workDaysCounter', { ...overworkDays });
  //   } else {
  //     setLocalStorage('workDaysCounter', { ...overworkDays, [key]: day });
  //   }
  // };

  useEffect(() => {
    // if (!overworkDays) {
    //   setLocalStorage('workDaysCounter', {});
    // }
    fillMonth();
  }, []);

  return (
    <>
      <button type="button" onClick={() => switchMonth(-1)}>
        prev
      </button>
      <button type="button" onClick={() => switchMonth(1)}>
        next
      </button>
      <div className="calendar-wrapper">
        <DaysOfWeek />
        <Navigation month={months[currentDate.getMonth()].rus} />
        <MonthsDays monthsDays={monthsDays} addOverworkDays={addOverworkDays} />
      </div>
      <Legend />
      <Payroll totalWorkDays={totalWorkDays} />
    </>
  );
}

export default App;
