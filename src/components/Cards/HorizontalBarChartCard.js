
import React from 'react';
import { Card, CardHeader, CardContent, styled} from '@mui/material';
import CollapsibleCard from './CollapsibleCard';
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
  paddingBottom: theme.spacing(1),
  backgroundColor: theme.palette.secondary.light,
  alignItems: 'center', //vertically center
  '& .MuiCardHeader-title': {
    textAlign: 'left',
    fontSize: theme.typography.h4.fontSize,
    fontWeight: 'bold',
    fontFamily: 'Segoe UI',
    lineHeight: 1.2,
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
    <CollapsibleCard
      title={title}
      HeaderComponent={CustomCardHeader}
      ContentComponent = {CustomCardContent}
    >
      {children}
   </CollapsibleCard>
  );
};

export default HorizontalBarChartCard;
