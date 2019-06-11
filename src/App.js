import React, { useState, useEffect } from 'react';
import { months } from './data';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workDays, setWorkDays] = useState(2);
  const [days, setDays] = useState([]);

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
        newDays.unshift({});
      } else {
        newDays.push({
          fullDate: new Date(newCurrentDate),
          workDay: newWorkDays > 0,
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

  useEffect(() => {
    fillMonth();
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
            days.map(({ fullDate, workDay }) => {
              if (fullDate) {
                const weekDay = fullDate.getDay();
                const day = fullDate.getDate();
                return (
                  <div
                    key={day}
                    className={`day ${workDay && 'workDay'}
                    ${(weekDay == 0 || weekDay == 6) && 'week-end'}`}
                  >
                    {day}
                  </div>
                );
              }
              return <div className="day" key={Math.random()} />;
            })}
        </div>
      </div>
    </>
  );
}

export default App;
