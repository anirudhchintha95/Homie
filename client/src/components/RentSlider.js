import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `$${value * 100}`;
}

const minDistance = 10;

const RentSlider = ({ minRent, maxRent, onMinRentChange, onMaxRentChange }) => {
  const handleChange = (_, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      onMinRentChange({
        value: Math.min(newValue[0] * 100, maxRent.value - minDistance * 100),
        error: "",
      });
    } else {
      onMaxRentChange({
        value: Math.max(newValue[1] * 100, minRent.value + minDistance * 100),
        error: "",
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        getAriaLabel="Rent Slider"
        value={[minRent.value / 100, maxRent.value / 100]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
      />
    </Box>
  );
};

export default RentSlider;
