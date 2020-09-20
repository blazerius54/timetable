import React from 'react';
import PropTypes from 'prop-types';

class SingleDay extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.classes !== nextProps.classes) {
      return true;
    }
    return false;
  }

  changeDayStatus = () => {
    const { addOverworkDays, formattedDate } = this.props;
    addOverworkDays(formattedDate);
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
  formattedDate: PropTypes.string.isRequired,
};

export default SingleDay;
