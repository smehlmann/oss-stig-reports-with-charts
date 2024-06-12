
import React from 'react';
import { Card, CardHeader, CardContent, styled, CardHeader as MuiCardHeader  } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  overflow: 'hidden',
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  // padding: theme.spacing(1),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  // overflow: 'hidden', // Ensure content does not overflow
}));

const CustomCardComponent = ({ title, children }) => {
  return (
    <StyledCard>
      {/* <CardHeader title={title} /> */}
      <CustomCardContent>
        {children}
      </CustomCardContent>
    </StyledCard>
  );
};

export default CustomCardComponent;





// const StyledCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   boxShadow: theme.shadows[3],
//   borderRadius: 10,
// }));

// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   padding: theme.spacing(1),
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'hidden', // Ensure content does not overflow
// }));

// const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
//   '& .MuiCardHeader-title': {
//     textAlign: 'center',
//     fontSize: '30px',
//     fontFamily: 'Segoe UI',
//   },
// }));
// const CustomCardComponent = ({ title, children }) => {
//   return (
//     <StyledCard>
//       {/* <CustomCardHeader title={title} /> */}
//       <CustomCardContent>
//         {children}
//       </CustomCardContent>
//     </StyledCard>
//   );
// };

// export default CustomCardComponent;


// // Custom styled Card component
// const StyledCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   boxShadow: theme.shadows[3],
//   borderRadius: 10,
// }));

// // Custom styled CardContent component
// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   padding: theme.spacing(2),
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'hidden', // Ensure content does not overflow
// }));

// // Custom styled CardHeader component
// const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
//   paddingBottom: theme.spacing(1),
//   '& .MuiCardHeader-title': {
//     textAlign: 'center',
//     fontSize: '30px',
//     fontFamily: 'Segoe UI',
//   },
// }));

// // Custom card component using the custom header and content
// const CustomCardComponent = ({ title, children }) => {
//   return (
//     <StyledCard>
//       <CustomCardHeader title={title} />
//       <CustomCardContent>
//         {children}
//       </CustomCardContent>
//     </StyledCard>
//   );
// };

// export default CustomCardComponent;



// const CustomCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   boxShadow: theme.shadows[3],
//   borderRadius: 10,
// }));

// const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
//   paddingBottom: theme.spacing(1),
// }));

// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   padding: theme.spacing(1),
// }));

// const CustomCardComponent = ({ title, children }) => (
//   <CustomCard>
//     {title && <CustomCardHeader title={title} />}
//     <CustomCardContent>
//       {children}
//     </CustomCardContent>
//   </CustomCard>
// );

// export default CustomCardComponent;
