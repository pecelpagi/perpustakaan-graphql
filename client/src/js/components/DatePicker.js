import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "./DatePicker.scss";

const DatePickerComponent = ({
  label, value, onChange, readOnly,
}) => {
  const selectedDate = moment(value, "YYYY-MM-DD").toDate();

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button ref={ref} type="button" className="btn btn-date-picker" onClick={onClick}>
      <i className="fa fa-calendar" />
      {moment(value, "MM/DD/YYYY").format("DD MMMM YYYY")}
    </button>
  ));

  return (
    <div>
      {label && <label>{label}</label>}
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={val => onChange(moment(val).format("YYYY-MM-DD"))}
          customInput={<CustomInput />}
          popperPlacement="top-end"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

DatePickerComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

DatePickerComponent.defaultProps = {
  label: "",
  onChange: () => {},
  readOnly: false,
};

export default DatePickerComponent;
