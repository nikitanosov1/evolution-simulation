import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      paper: "#f2f2f2",
    },
    text: {
      primary: "#11111",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
    },
  },
});
