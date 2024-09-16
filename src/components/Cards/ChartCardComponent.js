
import React from 'react';
import { Card, CardHeader, CardContent, styled  } from '@mui/material';


const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%', 
  height: '450px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  // overflow: 'clip',
  overflow: 'clip',
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
  // '&:last-child': {
  //   paddingBottom: '0px',
  // }
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


