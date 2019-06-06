import React from 'react';

function App() {
  const currentDate = new Date();
  currentDate.setDate(1);
  const currentMonth = currentDate.getMonth();
  const totalDays = new Date(currentMonth, currentMonth+1, 0);
  const elementsToAdd = currentDate.getDay();
  const firstWorkDay = 3;
  const days = [];
  let workDays = 4;

  for(let i = 1; i<=totalDays.getDate(); i++) {
    days.push({
      fullDate: new Date(currentDate),
      workDay: i >= firstWorkDay && workDays > 2,
    });

    if (i >= firstWorkDay) {
      workDays--;
    }

    if (workDays == 0) {
      workDays = 4;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (let i = 1; i < elementsToAdd; i++) {
    days.unshift('');
  }

  return (
    <>
      Июнь
      <div className="calendar-wrapper">
        <div className="calendar-body">
          {days.map(({ fullDate, workDay }) => {
            if (typeof fullDate === 'object') {
              return (
                <div
                  key={fullDate.getDate()}
                  className={`day ${!workDay && 'dayOff'}`}
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
