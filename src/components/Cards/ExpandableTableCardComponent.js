import React from 'react';
import { Card, styled,  } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  padding: 0,
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden'
  
  // backgroundColor: '#fcb8cb',
}));

// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   padding: '0',
//   // height:  '100%',
//   // flexGrow: 1,
//   // display: 'flex',
//   // overflow: 'hidden', // Ensure content does not overflow
// }));


const ExpandableTableCardComponent = ({ title, children }) => {
  return (

    <StyledCard>
      {/* <CardHeader title={title} /> */}
      {/* <CustomCardContent> */}
        {children}
      {/* </CustomCardContent> */}
    </StyledCard>
  );
};

export default ExpandableTableCardComponent;


