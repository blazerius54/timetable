import React, { useState, useEffect, memo } from 'react';
import { months } from './data';
import Legend from './components/Legend';
import { setLocalStorage, getLocalStorage } from './helpers';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workDays, setWorkDays] = useState(2);
  const [days, setDays] = useState([]);
  const overworkDays = getLocalStorage('workDays');

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
    let newWorkDays = workDays;

    for (let i = 0; i < totalDays + elementsToAdd; i++) {
      if (i < elementsToAdd) {
        newDays.unshift({ id: i });
      } else {
        newDays.push({
          fullDate: new Date(newCurrentDate),
          workDay:
            formatDate(newCurrentDate) in overworkDays
              ? !(formatDate(newCurrentDate) in overworkDays && newWorkDays > 0)
              : newWorkDays > 0,
        });
        newCurrentDate.setDate(newCurrentDate.getDate() + 1);
        newWorkDays--;

        if (newWorkDays == -2) {
          newWorkDays = 2;
        }
      }
    }
    setDays(newDays);
    setWorkDays(newWorkDays);
  };

  const addOverworkDays = (day, index) => {
    const newDay = { ...days[index], workDay: !days[index].workDay };
    setDays([...days.slice(0, index), newDay, ...days.slice(index + 1)]);
    setOverworkDays([formatDate(day)], day);
  };

  const formatDate = date =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const setOverworkDays = (key, day) => {
    if ([key] in overworkDays) {
      delete overworkDays[key];
      setLocalStorage('workDays', { ...overworkDays });
    } else {
      setLocalStorage('workDays', { ...overworkDays, [key]: day });
    }
  };

  useEffect(() => {
    fillMonth();
    if (!overworkDays) {
      setLocalStorage('workDays', {});
    }
  }, []);

  return (
    <>
      <button onClick={switchMonth}>next</button>
      <div className="calendar-wrapper">
        <div className="month-main">{months[currentDate.getMonth()].rus}</div>
        <div className="days-name">
          <div>пн</div>
          <div>вт</div>
          <div>ср</div>
          <div>чт</div>
          <div>пт</div>
          <div>сб</div>
          <div>вс</div>
        </div>
        <div className="calendar-body">
          {days.length &&
            days.map(({ fullDate, workDay, id }, index) => {
              if (fullDate) {
                const weekDay = fullDate.getDay();
                const day = fullDate.getDate();
                const isWorkDay = workDay;
                const isWeekEnd = weekDay == 0 || weekDay == 6;
                return (
                  <div
                    key={day}
                    className={`${isWorkDay ? 'work-day ' : ''}${
                      isWeekEnd ? 'week-end ' : ''
                    }day`}
                    onClick={() => addOverworkDays(fullDate, index)}
                  >
                    {day}
                  </div>
                );
              }
              return <div className="day" key={Math.random()} />;
            })}
        </div>
      </div>
      <Legend />
    </>
  );
}

export default memo(App);
