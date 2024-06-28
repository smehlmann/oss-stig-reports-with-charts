import {  createTheme, useTheme } from "@mui/material";



const palette = [
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
      secondary: '#3E3E3E',
    },
    action: {
      selected: '#d9d9d9',
      hoverExpandedSection: '#f9f9f9',
    },
    assessed: '#cdd2ea',
    submitted: '#c3deab',
    accepted: '#81dfaa',
    rejected:'#eba693',
    cat3: '#cdd2ea',
    cat2: '#ffd68f',
    cat1: '#eba794',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      extendedMd: 1047.2,
      lg: 1280,
      extendedLg: 1381,
      xl: 1920,
      
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    h1: { 
      fontSize: '2.5rem', // about 40 px
      fontWeight: 300,
      letterSpacing: '-0.01562em',
    },
    h2: { 
      fontSize: '2rem', //about 32 px
      fontWeight: 300,
      letterSpacing: '-0.00833em',
    },
    h3: { 
      fontSize: '1.75rem', //about 28px
      fontWeight: 400,
      letterSpacing: '0em',
    },
    h4: { 
      fontSize: '1.5rem', //about 24px
      fontWeight: 400,
      letterSpacing: '0.00735em',
    },
    h5: { 
      fontSize: '1.25rem', //roughly 20px
      fontWeight: 400,
      letterSpacing: '0em',
    },
    h6: { 
      fontSize: '1rem', //about 16px
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    body1: { 
      fontSize: '1rem', //about 16px
      fontWeight: 400,
      letterSpacing: '0.00938em',
    },
    body2: { 
      fontSize: '0.875rem', //about 14px
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
    spacing: 2,  // was 8
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

//export hook 
export { useTheme, palette };

// const hoverPalette = [
//   "#112959",
//   "#153f67",
//   "#1a5674",
//   "#207480",
//   "#28837b",
//   "#318e77",
//   "#3a9871",
//   "#4c9e7b",
//   "#5fa180",
//   "#6fa18c",
// ];


