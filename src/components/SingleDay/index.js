import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

class SingleDay extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.classes !== nextProps.classes) {
      return true;
    }
    return false;
  }

  changeDayStatus = () => {
    const { addOverworkDays, fullDate, index } = this.props;
    addOverworkDays(fullDate, index);
  };

  render() {
    const { day, classes } = this.props;
    return (
      <button type="button" className={classes} onClick={this.changeDayStatus}>
        {day}
      </button>
    );
  }
}

SingleDay.propTypes = {
  addOverworkDays: PropTypes.func.isRequired,
  classes: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  fullDate: PropTypes.object.isRequired,
};

export default SingleDay;
