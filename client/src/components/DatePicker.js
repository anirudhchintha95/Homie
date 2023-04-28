import React from "react";
import ReactDatePicker from "react-datepicker";
import { TextField } from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";

const CustomInput = React.forwardRef(({ value, onClick, label }, ref) => (
  <TextField
    onClick={onClick}
    inputRef={ref}
    value={value}
    autoComplete="off"
    placeholder="Select Date"
    label={label}
    fullWidth
  />
));

const DatePicker = ({ value, onChange, label, ...rest }) => {

  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      customInput={<CustomInput label={label} />}
      showYearDropdown
      showMonthDropdown
      {...rest}
    />
  );
};

export default DatePicker;
