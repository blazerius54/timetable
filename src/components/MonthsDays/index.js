import React from 'react';
import PropTypes from 'prop-types';
import SingleDay from '../SingleDay';
import './style.css';

const MonthsDays = ({ monthsDays, addOverworkDays }) => (
  <div className="calendar-body">
    {Object.keys(monthsDays).map(key => {
      const { fullDate, workDay } = monthsDays[key];
      if (fullDate) {
        const weekDay = fullDate.getDay();
        const day = fullDate.getDate();
        const isWeekEnd = weekDay === 0 || weekDay === 6;
        return (
          <SingleDay
            key={day}
            day={day}
            workDay={workDay}
            formattedDate={key}
            addOverworkDays={addOverworkDays}
            classes={`${workDay ? 'work-day ' : ''}${
              isWeekEnd ? 'week-end ' : ''
            }day`}
          />
        );
      }
      return <div className="day" key={Math.random()} />;
    })}
  </div>
);

MonthsDays.propTypes = {
  addOverworkDays: PropTypes.func.isRequired,
  monthsDays: PropTypes.object.isRequired,
};

export default React.memo(MonthsDays);
