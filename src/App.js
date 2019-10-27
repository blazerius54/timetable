import React, { useState, useEffect } from 'react';
import { months } from './data';
import Legend from './components/Legend';
import { setLocalStorage, getLocalStorage } from './helpers';
import Navigation from './components/Navigation';
import DaysOfWeek from './components/DaysOfWeek';
import MonthsDays from './components/MonthsDays';
import Payroll from './components/Payroll';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [workDaysCounter, setWorkDaysCounter] = useState(2);
  const [prevMonthCounter, setPrevMonthCounter] = useState(1);
  const [remoteDirection, setDirection] = useState(1);
  const [monthsDays, setMonthsDays] = useState({});
  const overworkDays = getLocalStorage('workDaysCounter');

  const switchMonth = n => {
    const dateWithNewMonth = currentDate;
    currentDate.setMonth(currentDate.getMonth() + n);
    setCurrentDate(dateWithNewMonth);
    setDirection(n);
    fillMonth();
  };

  const fillMonth = () => {
    const newMonthsDays = {};
    const newCurrentDate = new Date(currentDate.setDate(1));
    const totalDays = new Date(
      newCurrentDate.getFullYear(),
      newCurrentDate.getMonth() + 1,
      0,
    ).getDate();
    const elementsToAdd =
      newCurrentDate.getDay() == 0 ? 6 : newCurrentDate.getDay() - 1;

    for (let i = 0; i < totalDays + elementsToAdd; i++) {
      if (i < elementsToAdd) {
        newMonthsDays[i] = {};
      } else {
        newMonthsDays[formatDate(newCurrentDate)] = {
          fullDate: new Date(newCurrentDate),
        };
        newCurrentDate.setDate(newCurrentDate.getDate() + 1);
      }
    }

    setMonthsDays(newMonthsDays);
    fillWorkDays(newMonthsDays);
  };

  const fillWorkDays = days => {
    if (Object.keys(days).length === 0) {
      return;
    }

    const forwardDirection = remoteDirection > -1;
    const newMonthsDays = days;
    const month = forwardDirection
      ? Object.keys(days)
      : Object.keys(days).reverse();
    let newWorkDays = forwardDirection ? workDaysCounter : prevMonthCounter;
    let newWorkDaysTotal = 0;

    month.forEach(key => {
      if (days[key].fullDate) {
        // const workDay =
        //   formatDate(monthsDays[key].fullDate) in overworkDays
        // ? !(
        //   formatDate(monthsDays[key].fullDate) in overworkDays &&
        //     newWorkDays > 0
        // )
        // : newWorkDays > 0;

        const workDay =
          formatDate(days[key].fullDate) in overworkDays || newWorkDays > 0;

        newWorkDays--;

        if (newWorkDays == -2) {
          newWorkDays = 2;
        }

        if (workDay) {
          newWorkDaysTotal++;
        }

        newMonthsDays[key] = {
          ...days[key],
          workDay,
        };
      }
    });

    setTotalWorkDays(newWorkDaysTotal);
    setMonthsDays(days);

    if (month.length) {
      const helper = (firstDay, secondDay, func) => {
        if (!days[firstDay].workDay && !days[secondDay].workDay) {
          func(2);
        } else {
          func(days[firstDay].workDay - days[secondDay].workDay);
        }
      };

      const filledMonth = Object.keys(days).filter(key => days[key].fullDate);
      const [firstDay, secondDay] = filledMonth.slice(0, 2);
      const [lastDay, preLastDay] = filledMonth.slice(-2);

      helper(firstDay, secondDay, setPrevMonthCounter);
      helper(preLastDay, lastDay, setWorkDaysCounter);
    }
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
    // setOverworkDays(formattedDate, newDay);
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
      <button type="button" onClick={fillWorkDays}>
        fillWorkDays
      </button>
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
