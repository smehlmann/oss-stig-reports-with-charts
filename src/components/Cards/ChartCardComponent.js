
import React from 'react';
import { Card, CardHeader, CardContent, styled, CardHeader as MuiCardHeader  } from '@mui/material';


const StyledCard = styled(Card)(({ theme }) => ({
  // height: '100%', 
  height: '450px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  overflow: 'clip',
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
  padding: 0,
  margin: 0,
  // height: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  justifyContent: "center",
  alignContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // Ensure content does not overflow
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
