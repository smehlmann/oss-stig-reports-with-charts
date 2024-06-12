import React from 'react';
import { Card, CardContent, styled, CardHeader as MuiCardHeader  } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  padding: 0,
  // backgroundColor: '#fcb8cb',
}));

// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   padding: 0,
//   height:  '100%',
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'hidden', // Ensure content does not overflow
// }));


const TableGridCardComponent = ({ title, children }) => {
  return (
    <StyledCard>
      {/* <CardHeader title={title} /> */}
      {/* <CustomCardContent> */}
        {children}
      {/* </CustomCardContent> */}
    </StyledCard>
  );
};

export default TableGridCardComponent;

