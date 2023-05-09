import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value} YO`;
}

const minDistance = 1;

const AgeSlider = ({ minAge, maxAge, onMinAgeChange, onMaxAgeChange }) => {
  const handleChange = (_, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      onMinAgeChange({
        value: Math.min(newValue[0], maxAge.value - minDistance),
        error: "",
      });
    } else {
      onMaxAgeChange({
        value: Math.max(newValue[1], minAge.value + minDistance),
        error: "",
      });
    }
  };

  return (
    <Box sx={{ width: "90%" }} m="auto">
      <Slider
        getAriaLabel={() => "Age Slider"}
        min={18}
        max={100}
        value={[minAge.value, maxAge.value]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
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

export default AgeSlider;
