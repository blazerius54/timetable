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
    const { addOverworkDays, formatedDate } = this.props;
    addOverworkDays(formatedDate);
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
  formatedDate: PropTypes.string.isRequired,
};

export default SingleDay;
