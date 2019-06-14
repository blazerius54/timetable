import React from 'react';
import PropTypes from 'prop-types';
import SingleDay from '../SingleDay';

const CalendarBody = ({ days, addOverworkDays }) => {
  return (
    <div className="calendar-body">
      {days.map(({ fullDate, workDay }, index) => {
        if (fullDate) {
          const weekDay = fullDate.getDay();
          const day = fullDate.getDate();
          const isWorkDay = workDay;
          const isWeekEnd = weekDay == 0 || weekDay == 6;
          return (
            <SingleDay
              key={day}
              day={day}
              fullDate={fullDate}
              index={index}
              addOverworkDays={addOverworkDays}
              classes={`${isWorkDay ? 'work-day ' : ''}${
                isWeekEnd ? 'week-end ' : ''
              }day`}
            />
          );
        }
        return <div className="day" key={Math.random()} />;
      })}
    </div>
  );
};

CalendarBody.propTypes = {
  addOverworkDays: PropTypes.func.isRequired,
  days: PropTypes.array.isRequired,
};

export default CalendarBody;
