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
  const [prevMonthCounter, setPrevMonthCounter] = useState(0);
  const [firstWorkDay] = useState('06 01 2019');
  const [monthsDays, setMonthsDays] = useState({});
  const overworkDays = getLocalStorage('workDaysCounter');

  const switchMonth = n => {
    const dateWithNewMonth = currentDate;
    currentDate.setMonth(currentDate.getMonth() + n);
    setCurrentDate(dateWithNewMonth);
    fillMonth();
  };

  const remoteMonth = () => {
    setWorkDaysCounter(15);
    switchMonth(-1);
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
  };

  const fillWorkDays = () => {
    const newMonthsDays = monthsDays;
    let newWorkDays = workDaysCounter;
    let newWorkDaysTotal = 0;

    Object.keys(monthsDays).map(key => {
      if (monthsDays[key].fullDate) {
        const workDay =
          formatDate(monthsDays[key].fullDate) in overworkDays
            ? !(
              formatDate(monthsDays[key].fullDate) in overworkDays &&
                newWorkDays > 0
            )
            : newWorkDays > 0;

        newMonthsDays[key] = {
          ...monthsDays[key],
          workDay,
        };

        newWorkDays--;

        if (newWorkDays == -2) {
          newWorkDays = 2;
        }

        if (workDay) {
          newWorkDaysTotal++;
        }
        setTotalWorkDays(newWorkDaysTotal);
        setWorkDaysCounter(newWorkDays);
      }
    });
  };

  const addOverworkDays = formatedDate => {
    const newDay = {
      ...monthsDays[formatedDate],
      workDay: !monthsDays[formatedDate].workDay,
    };

    let newMonthsDays = monthsDays;

    newMonthsDays = {
      ...newMonthsDays,
      [formatedDate]: newDay,
    };
    setMonthsDays(newMonthsDays);
    setOverworkDays(formatedDate, newDay);
  };

  const formatDate = date =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const setOverworkDays = (key, day) => {
    if (overworkDays[key]) {
      delete overworkDays[key];
      setLocalStorage('workDaysCounter', { ...overworkDays });
    } else {
      setLocalStorage('workDaysCounter', { ...overworkDays, [key]: day });
    }
  };

  useEffect(() => {
    if (!overworkDays) {
      setLocalStorage('workDaysCounter', {});
    }
    fillMonth();
  }, []);

  useEffect(() => {
    fillWorkDays();
  }, [monthsDays]);
  return (
    <>
      {/* <button type="button" onClick={() => switchMonth(-1)}> */}
      <button type="button" onClick={remoteMonth}>
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
