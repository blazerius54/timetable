import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function Payroll({ totalWorkDays }) {
  return (
    <div className="payroll">
      <div className="payroll-sub-info">
        <p>Оплата за смену 2300р</p>
        <p>Рабочих смен {totalWorkDays}</p>
      </div>
      <p className="month-payroll">К выплате {totalWorkDays * 2300}р</p>
    </div>
  );
}

Payroll.propTypes = {
  totalWorkDays: PropTypes.number.isRequired,
};

export default Payroll;
