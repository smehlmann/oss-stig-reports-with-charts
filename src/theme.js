import {  createTheme } from "@mui/material";

export const palette = [
  '#0000F0',
  '#183090',
  '#4860FF',
  '#A8A8F0',
  '#6078FF',
  '#3048FF',
  '#6078D8',
  '#7890FF',
  '#4860D9',
  '#6060A8',
];

const theme = createTheme({
  palette: {
    primary: {
      // main: '#3f51b5',
      // light: '#757de8',
      // dark: '#002984',
      main: '#3048FF',
      light: '#6476FF',
      dark: '#0000cb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6060a8',
      light: '#bcbbf4',  // #9fa1cc
      dark: '#322a79',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      // primary: '#333333',
      primary: '#2A2A2A',
      secondary: '#666666',
    },
    // action: {
    //   selected: '#caf0f8',
    // }
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
    spacing: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '8px 16px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '5px 10px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;


export const hoverPalette = [
  "#112959",
  "#153f67",
  "#1a5674",
  "#207480",
  "#28837b",
  "#318e77",
  "#3a9871",
  "#4c9e7b",
  "#5fa180",
  "#6fa18c",
];