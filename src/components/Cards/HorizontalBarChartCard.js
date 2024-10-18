
import React from 'react';
import { Card, CardHeader, CardContent, styled  } from '@mui/material';

//card that contains a horizontal bar chart. 

const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%', 
  height: '475px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  overflow: 'hidden',
  // overflow: 'hidden',
  padding: '0',

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
    paddingBottom: '0px', //remove padding from the content element if needed
  },
}));


const CustomCardContent = styled(CardContent)(({ theme }) => ({
  padding: 0,
  margin: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: "center",
  alignItems: 'center',
  overflowY:'auto',
  // overflowY: 'auto',
  '&:last-child': {
    paddingBottom: '0px',
  }
}));

const HorizontalBarChartCard = ({ title, children }) => {
  return (
    <StyledCard>
      <CustomCardHeader title={title} />
      <CustomCardContent>
        {children}
      </CustomCardContent>
    </StyledCard>
  );
};

export default HorizontalBarChartCard;
