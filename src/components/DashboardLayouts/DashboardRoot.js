import {styled } from "@mui/material";

export const DashboardRoot = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  // height:  `calc(100vh - ${verticalPadding}px)`, // subtract verticalPadding from 100vh
  minHeight: '100vh',
  boxSizing: 'border-box',
  flexGrow: 1, //take up remaining space
 // position: 'inherit',
}));