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
  const [days, setDays] = useState([]);
  const overworkDays = getLocalStorage('workDaysCounter');

  const switchMonth = () => {
    const dateWithNewMonth = currentDate;

    currentDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(dateWithNewMonth);
    fillMonth();
  };

  const fillMonth = () => {
    const newDays = [];
    const newCurrentDate = new Date(currentDate.setDate(1));
    const totalDays = new Date(
      newCurrentDate.getFullYear(),
      newCurrentDate.getMonth() + 1,
      0,
    ).getDate();
    const elementsToAdd =
      newCurrentDate.getDay() == 0 ? 6 : newCurrentDate.getDay() - 1;
    let newWorkDays = workDaysCounter;
    let newWorkDaysTotal = 0;

    for (let i = 0; i < totalDays + elementsToAdd; i++) {
      if (i < elementsToAdd) {
        newDays.unshift({});
      } else {
        const workDay =
          formatDate(newCurrentDate) in overworkDays
            ? !(formatDate(newCurrentDate) in overworkDays && newWorkDays > 0)
            : newWorkDays > 0;

        if (workDay) {
          newWorkDaysTotal++;
        }

        newDays.push({
          fullDate: new Date(newCurrentDate),
          workDay,
        });

        newCurrentDate.setDate(newCurrentDate.getDate() + 1);
        newWorkDays--;

        if (newWorkDays == -2) {
          newWorkDays = 2;
        }
      }
    }
    setDays(newDays);
    setWorkDaysCounter(newWorkDays);
    setTotalWorkDays(newWorkDaysTotal);
  };

  const addOverworkDays = (day, index) => {
    const newDay = { ...days[index], workDay: !days[index].workDay };
    setDays([...days.slice(0, index), newDay, ...days.slice(index + 1)]);
    setOverworkDays([formatDate(day)], day);
    const newTotalWorkDays = totalWorkDays + (newDay.workDay ? 1 : -1);
    setTotalWorkDays(newTotalWorkDays);
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

  return (
    <>
      <button type="button" onClick={switchMonth}>
        next
      </button>
      <div className="calendar-wrapper">
        <DaysOfWeek />
        <Navigation month={months[currentDate.getMonth()].rus} />
        <MonthsDays days={days} addOverworkDays={addOverworkDays} />
      </div>
      <Legend />
      <Payroll totalWorkDays={totalWorkDays} />
    </>
  );
}

export default App;
