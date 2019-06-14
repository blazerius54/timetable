import React from 'react';
import PropTypes from 'prop-types';

const Navigation = ({ month }) => <div className="month-main">{month}</div>;

Navigation.propTypes = {
  month: PropTypes.string.isRequired,
};

export default Navigation;
