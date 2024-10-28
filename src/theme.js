import {  createTheme, useTheme } from "@mui/material";

const palette = [
  '#3048ff',
  '#986af9',
  '#cb95f6',
  '#ecc5f8',
  '#fff8ff',
  '#dfcde5',
  '#bba6cf',
  '#9181bb',
  '#6060a8',
];

const theme = createTheme({
  palette: {
    primary: {
      // main: '#3f51b5',
      // light: '#757de8',
      // dark: '#002984',
      main: '#3048FF',
      light: '#8190ff',
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
      extendedMd: 1078,
      lg: 1280,
      extendedLg: 1400,
      xl: 1920,
      
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    h1: { 
      fontSize: '2.5rem', // about 40 px
      fontWeight: 800,
      letterSpacing: '-0.01562em',
    },
    h2: { 
      fontSize: '2rem', //about 32 px
      fontWeight: 700,
      letterSpacing: '-0.00833em',
    },
    h3: { 
      fontSize: '1.75rem', //about 28px
      fontWeight: 500,
      letterSpacing: '0em',
    },
    h4: { 
      fontSize: '1.5rem', //about 24px
      fontWeight: 500,
      letterSpacing: '0.00735em',
    },
    h5: { 
      fontSize: '1.25rem', //roughly 20px
      fontWeight: 500,
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
          borderRadius: '10px',
          textTransform: 'none',
          fontSize: '0.875rem',
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

const darkTheme = createTheme({
  palette: {
    primary: {
      // main: '#3f51b5',
      // light: '#757de8',
      // dark: '#002984',
      main: '#3048FF',
      light: '#8190ff',
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
      default: '#0c0c28',
      paper: '#212141',
    },
    text: {
      // primary: '#333333',
      primary: '#f9f9f9',
      secondary: '#f3f3f3',
    },
    action: {
      selected: '#6a749d',
      hover: '#424a79',
      hoverExpandedSection: '#c2c6d6',
    },
    assessed: '#4f5b8a', // Darker variation of the original color
    submitted: '#6a8c5d', // Darker green to fit with the dark theme
    accepted: '#5b8d69', // Darker shade of green
    rejected: '#b35b4a', // A darker shade of red for better visibility
    cat3: '#4f5b8a', // Use a darker variation
    cat2: '#b58c50', // Darker yellow to maintain contrast
    cat1: '#b35b4a', // Similar darker red shade as the 'rejected' color
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      extendedMd: 1078,
      lg: 1280,
      extendedLg: 1400,
      xl: 1920,
      
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    h1: { 
      fontSize: '2.5rem', // about 40 px
      fontWeight: 800,
      letterSpacing: '-0.01562em',
      color: '#ffffff',
    },
    h2: { 
      fontSize: '2rem', //about 32 px
      fontWeight: 700,
      letterSpacing: '-0.00833em',
      color: '#ffffff',
    },
    h3: { 
      fontSize: '1.75rem', //about 28px
      fontWeight: 500,
      letterSpacing: '0em',
      color: '#ffffff',
    },
    h4: { 
      fontSize: '1.5rem', //about 24px
      fontWeight: 500,
      letterSpacing: '0.00735em',
      color: '#ffffff',
    },
    h5: { 
      fontSize: '1.25rem', //roughly 20px
      fontWeight: 500,
      letterSpacing: '0em',
      color: '#ffffff',
    },
    h6: { 
      fontSize: '1rem', //about 16px
      fontWeight: 500,
      letterSpacing: '0.0075em',
      color: '#ffffff',
    },
    body1: { 
      fontSize: '1rem', //about 16px
      fontWeight: 400,
      letterSpacing: '0.00938em',
      color: '#ffffff',
    },
    body2: { 
      fontSize: '0.875rem', //about 14px
      fontWeight: 400,
      letterSpacing: '0.01071em',
      color: '#ffffff',
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
      color: '#ffffff',
      
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
          borderRadius: '10px',
          textTransform: 'none',
          fontSize: '0.875rem',
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





//export hook 
export { useTheme, palette, theme, darkTheme};

/*
from logo
const palette = [
  '#0000F0',
  '#183090',
  '#4860FF',
  '#A8A8F0',
  // '#6078D8',
  '#7890FF',
  '#4860D9',
  '#3048FF',
  '#6060A8',
  '#6078FF',
];
*/

//Potential color palette with a lot of colors:
// ['#33A8C7', '#52E3E1','#A0E426', '#FDF148', '#FFAB00', '#F77976', '#F050AE', '#D883FF', '#9336FD']


//maybe bg = #303060 
//current bg = #323447

//maybe (?) hover colors: #90A8FF
//maybe hover or emphasis color: #A8C0FF
//maybe title or something depending on bg: #000090,   
//maybe title or something depending on bg: #181860 

