import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `$${value}`;
}

const minDistance = 500;

const RentSlider = ({ minRent, maxRent, onMinRentChange, onMaxRentChange }) => {
  const handleChange = (_, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      onMinRentChange({
        value: Math.min(newValue[0], maxRent.value - minDistance),
        error: "",
      });
    } else {
      onMaxRentChange({
        value: Math.max(newValue[1], minRent.value + minDistance),
        error: "",
      });
    }
  };

  return (
    <Box sx={{ width: "90%" }} m="auto">
      <Slider
        min={0}
        max={10000}
        getAriaLabel={(index) => `Rent Slider ${index === 0 ? "min" : "max"}`}
        value={[minRent.value, maxRent.value]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        disableSwap
        slotProps={{
          input: {
            "aria-valuemax": null,
            "aria-valuemin": null,
          },
        }}
      />
    </Box>
  );
};

export default RentSlider;
