import React, { useState } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "./DatePicker.scss";

const DatePickerComponent = ({ label, value, onChange }) => {
  const selectedDate = moment(value, "YYYY-MM-DD").toDate();

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button ref={ref} type="button" className="btn btn-date-picker" onClick={onClick}>
      {moment(value, "MM/DD/YYYY").format("DD MMMM YYYY")}
      <i className="fa fa-calendar" />
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
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
