import {styled } from "@mui/material";

export const DashboardRoot = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)}`,
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

/*
Guide for Grid spacing:
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)

*/