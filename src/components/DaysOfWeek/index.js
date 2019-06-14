import React from 'react';
import { daysOfWeek } from '../../data';

const DaysOfWeek = () => {
  const mndWeek = { ...daysOfWeek, 7: daysOfWeek[0] };
  delete mndWeek[0];
  return (
    <div className="days-name">
      {Object.keys(mndWeek).map(key => (
        <div key={key}>{mndWeek[key].rus}</div>
      ))}
    </div>
  );
};

export default DaysOfWeek;
