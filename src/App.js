import React, { useState, useEffect } from 'react';
import { months } from './data';
import Legend from './components/Legend';
import {
  setLocalStorage,
  getLocalStorage,
  monthDaysCounter,
  formMontDays,
} from './helpers';
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
  const [currentDirection, setCurrentDirection] = useState(1);
  const [monthsDays, setMonthsDays] = useState({});
  const overworkDays = getLocalStorage('workDaysCounter');

  // useEffect(() => {
  //   if (currentDirection > 0) {
  //     console.log(nextMonthCounter)
  //     setWorkDaysCounter(nextMonthCounter);
  //   }
  //
  //   if (currentDirection < 0) {
  //     setWorkDaysCounter(prevMonthCounter);
  //   }
  // }, [nextMonthCounter, prevMonthCounter, currentDirection]);

  // useEffect(() => {
  //   console.log(workDaysCounter);
  // }, [workDaysCounter, currentDirection]);

  const switchMonth = direction => {
    // setWorkDaysCounter(nextMonthCounter)
    const dateWithNewMonth = currentDate;
    currentDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(dateWithNewMonth);
    setCurrentDirection(direction);
    // console.log(direction)
    fillMonth(direction);
  };

  const setExtremeDaysStatus = (monthDays, elementsToAdd, direction) => {
    const daysValues = Object.values(monthDays);

    const [firstDay, secondDay] = [
      daysValues[elementsToAdd],
      daysValues[elementsToAdd + 1],
    ];
    const [preLastDay, lastDay] = daysValues.slice(-2);
    // console.log({ preLastDay, lastDay });
    const futureResult =
      Number(lastDay.workDay) === 0 && Number(preLastDay.workDay) === 0
        ? 2
        : lastDay.workDay - preLastDay.workDay;

    const pastResult =
      Number(firstDay.workDay) === 0 && Number(secondDay.workDay) === 0
        ? 2
        : firstDay.workDay - secondDay.workDay;

    console.log({pastResult, futureResult, workDaysCounter});
    // setPrevMonthCounter(pastResult);
    // setNextMonthCounter(futureResult);

    setWorkDaysCounter(direction > 0 || !direction ? futureResult : pastResult);

  };

  const fillMonth = direction => {
    const { newMonthsDays, elementsToAdd } = formMontDays(
      currentDate,
      workDaysCounter,
      direction,
    );

    setExtremeDaysStatus(newMonthsDays, elementsToAdd, direction);
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

  // const formatDate = date =>
  //   `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

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
