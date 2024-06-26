import React, { useMemo } from "react";
import { Grid, styled } from "@mui/material";
import { Card, Box, CardContent, Typography, Avatar } from "@mui/material";

// import CardActions from "@mui/material/CardActions";
// import Button from "@mui/material/Button";

import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import ValueCountMap from './ValueCountMap'; // Assuming this is a utility function you've defined


const Difference = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

//style background of card based on the metric name
const getCardBackgroundColor = (metricName) => {
  // console.log("metricName: ", metricName);
  switch (metricName) {
    case 'Accessed':
    case 'CAT3':
      return '#cdd2ea';
    case 'submitted':
      return '#c3deab';
    case 'accepted':
      return '#81dfaa';
    case 'rejected':
      return '#eba693';
    case 'CAT2':
      return '#ffd68f';
    case 'CAT1':
      return '#eba794';

      default:
        return '#ffffff'; // Default background color if none match
  }
};

const StyledCard = styled(Card)(({ theme, metricName }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  flex: 1,
  overflow: 'hidden',
  backgroundColor: getCardBackgroundColor(metricName),
}));

const MainMetricValue = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  // marginRight: theme.spacing(4),
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center', // Center-align the content
  width: '100%',
}));


const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
}));

const StyledIconContainer = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  height: 56,
  width: 56,
  
}));

const Icon = styled(InsertChartOutlinedIcon)(({ theme }) => ({
  height: 32,
  width: 32,
}));


const StatisticsCardComponent = ({ data, metricValue, metricDisplayedName, measurement }) => {
  return (
    <StyledCard metricName = {metricDisplayedName}>
      <StatCardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <StyledIconContainer>
              <Icon />
            </StyledIconContainer>
          </Grid>
          <Grid item>
            <Title color="textPrimary" gutterBottom variant="body2">
              {metricDisplayedName}
            </Title>
            <MainMetricValue>
              {metricValue}
            </MainMetricValue>
          </Grid>
        </Grid>
        {/* <Difference> */}
        {/* </Difference> */}
      </StatCardContent>
    </StyledCard>
  );
};

export default StatisticsCardComponent;



// const Root = styled('div')(({ theme }) => ({
//   padding: theme.spacing(4),
//   backgroundColor: theme.palette.background.default,
//   color: theme.palette.text.primary,
//   height: "100%",
//   display: 'flex',
//   flexDirection: 'column',

//   // position: 'inherit',
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   boxShadow: theme.shadows[3],
//   borderRadius: 10,
//   flex: 1,
//   overflow: 'hidden',
// }));


// const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
//   '& .MuiCardHeader-title': {
//     margin: 0,
//     fontWeight: 400,
//     color: theme.palette.text.secondary,
//     fontSize: theme.typography.h5.fontSize,
//   },
// }));


// const CustomCardContent = styled(CardContent)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'auto',
//   // justify: "space-between"
//   // overflow: 'hidden', // Ensure content does not overflow
// }));


// const Difference = styled(Box)(({ theme }) => ({
//   marginTop: theme.spacing(2),
//   display: 'flex',
//   alignItems: 'center',
// }));

// const StatCardContent = styled(CardContent)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'auto',
//   // justify: "space-between"
//   // overflow: 'hidden', // Ensure content does not overflow
// }));

// const DifferenceValue = styled(Typography)(({ theme }) => ({
//   color: theme.palette.error.dark,
//   marginRight: theme.spacing(1),
// }));

// // const StatisticsCardComponent = ({ data }) => {
// //   const cat1Sum = useMemo(() => {
// //     return data.reduce((sum, item) => sum + (item.cat1 || 0), 0);
// //   }, [data]);


// const StatisticsCardComponent = ({ title, children }) => {
//   // const cat1Sum = useMemo(() => {
//   //   return data.reduce((sum, item) => sum + (item.cat1 || 0), 0);
//   // }, [data]);

//   return (
//     <StyledCard>
//       <CustomCardHeader title={title} />
//       <StatCardContent>
//         <Grid container justifyContent="space-between">
//           <Grid item>
//             <Typography variant="h3">New Card</Typography>
//           </Grid>
//           <Grid item>

//           </Grid>
//         </Grid>
//         <Difference>
//           <DifferenceValue variant="body2">12%</DifferenceValue>
//           <Typography variant="caption">Since last month</Typography>
//         </Difference>
//       </StatCardContent>
//     </StyledCard>
//   );
// };

// export default StatisticsCardComponent;