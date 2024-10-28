// import React, { useMemo } from "react";
import { Grid, styled } from "@mui/material";
import { Card, Box, CardContent, Typography, Avatar, Divider  } from "@mui/material";
// import ValueCountMap from './ValueCountMap'; // Assuming this is a utility function you've defined

// import CardActions from "@mui/material/CardActions";
// import Button from "@mui/material/Button";
import WebAssetIcon from '@mui/icons-material/WebAsset';
import PublishIcon from '@mui/icons-material/Publish';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';


const StatCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  '&:last-child': {
    paddingBottom: theme.spacing(1),
  },
}));

// Style background of card based on the metric name
const getCardBackgroundColor = (metricname) => {
  switch (metricname) {
    case 'Assessed':
    case 'CAT3':
      return '#cdd2ea';
    case 'Submitted':
      return '#c3deab';
    case 'Accepted':
      return '#81dfaa';
    case 'Rejected':
      return '#eba693';
    case 'CAT2':
      return '#ffd68f';
    case 'CAT1':
      return '#eba794';
    case 'Assets':
      return '#ead7cd';
    case 'Overall Assessed':
      return '#bdabe0';
    case 'Delinquents':
      return '#98E1DC';
    default:
      return '#ffffff'; // default bg
  }
};

const StyledCard = styled(Card)(({ theme, metricname}) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  backgroundColor: getCardBackgroundColor(metricname),
}));

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MainMetricValue = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h2.fontSize,
  fontWeight: 700,
  alignItems: 'left',
  color: '#2A2A2A', //light mode primary

}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#3E3E3E', //light mode secondary
}));

const StyledIconContainer = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  height: 50,
  width: 50,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#ffffff',

  boxShadow: theme.shadows[3],
}));


// Get specific icon based on name of metric
const getIcon = (metricname) => {
  switch (metricname) {
    case 'Assets':
      return <WebAssetIcon style={{ height: 40, width: 40 }} />;
    case 'Assessed':
      return <AssessmentIcon style={{ height: 40, width: 40 }} />;
    case 'Submitted':
      return <PublishIcon style={{ height: 40, width: 40 }} />;
    case 'Accepted':
      return <CheckBoxOutlinedIcon style={{ height: 40, width: 40 }} />;
    case 'Rejected':
      return <CloseIcon style={{ height: 40, width: 40 }} />;
    case 'CAT1':
    case 'CAT2':
    case 'CAT3':
      return <EqualizerOutlinedIcon style={{ height: 40, width: 40 }} />;
    default:
      return <EqualizerOutlinedIcon style={{ height: 40, width: 40 }} />;
  }
};

const CaptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#3E3E3E',
  display: 'flex',
  alignItems: 'center',
}));

const StatisticsCardComponent = ({ data, metricValue, metricDisplayedName, measurement}) => {
  return (
    <StyledCard metricname={metricDisplayedName}>
      <StatCardContent>
        <CustomGridContainer container spacing={2}>
          <Grid item style={{  alignSelf: 'flex-start'}}>
            <StyledIconContainer>
              {getIcon(metricDisplayedName)}
            </StyledIconContainer>
          </Grid>
          {/* flow of items is vertical from top to bottom */}
          <Grid item xs container direction="column" alignItems="flex-end"> 
            <Title variant="h7" style={{
              textAlign: "right", 
              wordBreak: "break-word", 
              wordWrap: "break-word", 
              // paddingBottom: metricDisplayedName !== "Command Overall Assessed" ? '16px' : '0px' // Conditional padding
            }}>
              {metricDisplayedName}
            </Title>
            <MainMetricValue variant="h3">
              {metricValue}
            </MainMetricValue>
          </Grid>
        </CustomGridContainer>
        <Divider style={{ margin: '10px 0', color: '#3E3E3E'}} />
        <Box display="flex" justifyContent="flex-start">
          <CaptionText variant="body2">
            {measurement}
          </CaptionText>
        </Box>
      </StatCardContent>
    </StyledCard>
  );
};

export default StatisticsCardComponent;

/*
Old code
const StyledCard = styled(Card)(({ theme, metricName }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  overflow: 'hidden',
  paddingTop: 0,
  paddingBottom: 0,
  backgroundColor: getCardBackgroundColor(metricName),
}));

const Difference = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  // overflow: 'auto',
  justifyContent: 'space-between',
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
    case 'Assets':
      return '#ead7cd';

      default:
        return '#ffffff'; // Default background color if none match
  }
};

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  spacing: 2,
  display: 'flex',
}));

const MainMetricValue = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h3.fontSize,
  marginRight: theme.spacing(4),
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center', // Center-align the content
  width: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  //initially had: gutterBottom variant="body1"
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 700,
  marginRight: theme.spacing(4),
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center', // Center-align the content
  width: '100%',
  marginBottom: theme.spacing(0.5),
}));

const StyledIconContainer = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 70,
  width: 70,
  
}));

const Icon = styled('div')(({ theme }) => ({
  height: 40,
  width: 40,
  // display: "contents",
}));

//get specific icon based on name of metric
const getIcon = (metricName) => {
  switch (metricName) {
    case 'Assets':
      return <WebAssetIcon style={{ height: 40, width: 40 }} />;
    case 'Assessed':
      return <AssessmentIcon style={{ height: 40, width: 40 }} />;
    case 'Submitted':
      return <CategoryIcon style={{ height: 40, width: 40 }} />;
    case 'Accepted':
      return <CheckCircleIcon style={{ height: 40, width: 40 }} />
    case 'Rejected':
      return <CloseIcon style={{ height: 40, width: 40 }} />;
    case 'CAT1':
    case 'CAT2':
    case 'CAT3':
      return <InsertChartOutlinedIcon style={{ height: 40, width: 40 }} />;
      
    default:
      return <InsertChartOutlinedIcon style={{ height: 40, width: 40 }} />;
  }
};

const CaptionText = styled(Typography) (({ theme }) => ({
  // fontSize: theme.typography.h3.fontSize,
  marginRight: theme.spacing(4),
  fontWeight: 600,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center', // Center-align the content
  width: '100%',
  marginTop: theme.spacing(0.5),
}));

const StatisticsCardComponent = ({ data, metricValue, metricDisplayedName, measurement }) => {
  return (
    <StyledCard metricName = {metricDisplayedName}>
      <StatCardContent>
        <CustomGridContainer container>
          <Grid item xs={4} display="flex" justifyContent="center" alignItems="center">
            <StyledIconContainer>
              <Icon>{getIcon(metricDisplayedName)}</Icon>
            </StyledIconContainer>
          </Grid>
          <Grid item >
            <Title color="textPrimary">  
              {metricDisplayedName}
            </Title>
            <MainMetricValue>
              {metricValue}
            </MainMetricValue>
            <CaptionText fontSize='caption'>
              {measurement}
            </CaptionText>
          </Grid>
          
        </CustomGridContainer>

      </StatCardContent>
    </StyledCard>
  );
};

export default StatisticsCardComponent;

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
  display: 'flex',
  flexDirection: 'column',

  // position: 'inherit',
}));
*/