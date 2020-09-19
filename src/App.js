import React, { useState, useEffect } from 'react';
import { months } from './data';
import Legend from './components/Legend';
import { formMontDays, countDaysToAdd } from './helpers';
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

  useEffect(() => {
    console.log(currentDate);
  }, [nextMonthCounter, prevMonthCounter, currentDirection]);

  const switchMonth = direction => {
    const dateWithNewMonth = currentDate;
    currentDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(dateWithNewMonth);
    setCurrentDirection(direction);
    fillMonth(direction);
  };

  const setExtremeDaysStatus = monthDays => {
    const daysValues = Object.values(monthDays);
    const elementsToAdd = countDaysToAdd(currentDate);

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

    setPrevMonthCounter(pastResult);
    setNextMonthCounter(futureResult);
  };

  const fillMonth = direction => {
    const x = direction > 0 || !direction ? nextMonthCounter : prevMonthCounter;

    const { newMonthsDays, elementsToAdd } = formMontDays(
      currentDate,
      x,
      direction,
    );

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


  useEffect(() => {
    fillMonth();
  }, []);

  return (
    <>
      <button type="button" onClick={() => console.log(prevMonthCounter)}>
        log prev month counter
      </button>
      <button type="button" onClick={() => console.log(nextMonthCounter)}>
        log next month counter
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
