import React from 'react';
import {  Card, CardHeader, CardContent, styled   } from '@mui/material';
import CollapsibleCard from "./CollapsibleCard"


const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%',
  height: '475px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  padding: 0,
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  transition: 'height 0.3s ease', 
}));

const CustomCardHeader = styled(CardHeader)(({theme}) => ({
  '& .MuiCardHeader-title': {
    textAlign: 'left',
    fontFamily: 'Segoe UI',
    fontSize: theme.typography.h4.fontSize,
    fontWeight: 'bold',
    justifyContent: "center",
    alignContent: 'center',
    alignItems: 'center',
    lineHeight: 1.2,
  },
  justifyContent: 'space-between', // Align title and button on opposite ends
  alignItems: 'center',
  paddingBottom: theme.spacing(1),  
  backgroundColor: theme.palette.secondary.light,
  // '& .MuiCardHeader-content': {
  //   paddingBottom: '0', //remove padding from the content element if needed
  // },
}))

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  padding: 0,
  margin: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  justifyContent: "center",
  alignContent: 'center',
  alignItems: 'center',
  // overflow:'visible',
  overflow: 'hidden',
  '&:last-child': {
    paddingBottom: 0, // Ensures no extra padding at the bottom
  },
}));


const TableGridCardComponent = ({ title, children }) => {
  return (
    <CollapsibleCard
      title={title}
      HeaderComponent={CustomCardHeader}
      ContentComponent = {CustomCardContent}
    >
      {children}
    </CollapsibleCard>
  );
};
export default TableGridCardComponent;


