
import React from 'react';
import { Card, CardHeader, CardContent, styled } from '@mui/material';
// import CollapseButtonWrapper from './CollapseButtonWrapper'
import CollapsibleCard from "./CollapsibleCard";

const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%', 
  height: '475px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  // overflow: 'clip',
  overflow: 'clip',
  padding: '0',

}));

const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  backgroundColor: theme.palette.secondary.light,
  alignItems: 'center', //vertically center
  
  '& .MuiCardHeader-title': {
    textAlign: 'left',
    fontSize: theme.typography.h4.fontSize,
    fontWeight: 'bold',
    fontFamily: 'Segoe UI, sans-serif',
    // fontFamily: 'Roboto, sans-serif',
    lineHeight: 1.2, //ensures proper alignment of text
  },
  '& .MuiCardHeader-content': {
    paddingBottom: '0', //remove padding from the content element if needed
  },
}));


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
  overflow: 'clip',
  '&:last-child': {
    paddingBottom: 0, // Ensures no extra padding at the bottom
  },
}));

const ChartCardComponent = ({ title, children }) => {
  
  return (
    <CollapsibleCard
      title = {title}
      HeaderComponent={CustomCardHeader}
      ContentComponent={CustomCardContent}
    >
      {children}
    </CollapsibleCard>
  );
};

export default ChartCardComponent;

/*
const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%', 
  height: '450px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  // overflow: 'hidden',
}));

const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: '0',
  '& .MuiCardHeader-title': {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontFamily: 'Segoe UI',
    fontWeight: '900',
  },
  '& .MuiCardHeader-content': {
    paddingBottom: '0', // Remove padding from the content element if needed
  },
}));


const CustomCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(0),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'clip',
  flex: 1,
  // justify: "space-between"
  // overflow: 'hidden', // Ensure content does not overflow
}));

const ChartCardComponent = ({ title, children }) => {
  return (
    <StyledCard>
      <CustomCardHeader title={title} />
      <CustomCardContent>
        {children}
      </CustomCardContent>
    </StyledCard>
  );
};

export default ChartCardComponent;
*/


