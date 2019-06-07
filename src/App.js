import React, { useState } from 'react';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  currentDate.setDate(1);
  const currentMonth = currentDate.getMonth();
  const totalDays = new Date(2019, currentMonth + 1, 0).getDate();
  const elementsToAdd =
    currentDate.getDay() == 0 ? 6 : currentDate.getDay() - 1;
  const days = [];
  let firstWorkDay = 1;
  let workDays = 2;

  for (let i = 1; i <= totalDays; i++) {
    days.push({
      fullDate: new Date(currentDate),
      workDay: i >= firstWorkDay && workDays > 0,
    });

    if (i >= firstWorkDay) {
      workDays--;
    }

    if (workDays == -2) {
      workDays = 2;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (let i = 0; i < elementsToAdd; i++) {
    days.unshift({});
  }
  console.log(days)

  const switchMonth = () => {
    const dateWithNewMonth = new Date(
      currentDate.setMonth(currentDate.getMonth()),
    );

    setCurrentDate(dateWithNewMonth);
  };

  return (
    <>
      <button onClick={switchMonth}>next</button>
      Июнь
      <div className="calendar-wrapper">
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
          {days.map(({ fullDate, workDay }) => {
            if (typeof fullDate === 'object') {
              return (
                <div
                  key={fullDate.getDate()}
                  className={`day ${workDay && 'workDay'}
                  ${(fullDate.getDay() == 0 || fullDate.getDay() == 6) &&
                    'week-end'}
                  `}
                >
                  {fullDate.getDate()}
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
