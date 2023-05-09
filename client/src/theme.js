import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3E6765",
    },
    secondary: {
      main: "#D9E2D5",
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: [
      "Oswald",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "h3-esque" },
          style: {
            fontWeight: 500,
            fontSize: "1.25rem",
            lineHeight: 1.6,
          },
        },
      ],
      styleOverrides: {
        h1: {
          fontWeight: 400,
          fontSize: "3rem",
          lineHeight: 1.167,
        },
        h2: {
          fontWeight: 400,
          fontSize: "2rem",
          lineHeight: 1.2,
        },
        h3: {
          fontWeight: 500,
          fontSize: "1.25rem",
          lineHeight: 1.6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "filled",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#646464",
            backgroundColor: "#e0e0e0",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          
          "&.Mui-disabled": {
            color: "#767676",
          },
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          "& .MuiStepLabel-label": {
            color: "#767676",
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "#3E6765",
          },
          "& .MuiStepIcon-root": {
            color: "#767676",
          },
        },
      },
    },
  },
});

export default theme;
