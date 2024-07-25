import React, { useMemo} from 'react';
import {Grid} from '@mui/material';
import StatisticsCardComponent from './Cards/StatisticsCardComponent';
import ValueCountMap from './ValueCountMap';

const StatisticsCardGroup = ({data}) => {

  //get sum of Cat1
  const cat1Sum = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.cat1 || 0), 0);
  }, [data]);

  //sum of Cat2
  const cat2Sum = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.cat2 || 0), 0);
  }, [data]);

  //sum of cat3
  const cat3Sum = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.cat3 || 0), 0);
  }, [data]);

  //number of assets
  const assetCount = useMemo(() => {
    const countMap = ValueCountMap(data, 'asset');
    return Object.keys(countMap).length;
  }, [data]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={assetCount}
          metricDisplayedName="Assets"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={cat1Sum}
          metricDisplayedName="CAT1"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={cat2Sum}
          metricDisplayedName="CAT2"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={cat3Sum}
          metricDisplayedName="CAT3"
          measurement="Total"
        />
      </Grid>
    </Grid>
  );
};
export default StatisticsCardGroup;

  /*
  //get avg of assessed
  const assessedValues = useMemo(() => filteredData.map(item => item.assessed), [filteredData]); //extracts values from 'assessed' property and stores them in assessedValues.
  const assessedAvg = CalculateArrayAvg(assessedValues); //gets avg of assessed vals
  const formattedAssessed = numeral(assessedAvg * 100).format('0.00') + '%';
  //get avg of submitted
  const submittedValues =  useMemo(() => filteredData.map(item => item.submitted), [filteredData]); //extracts 'submitted' prop values
  const submittedAvg = CalculateArrayAvg(submittedValues);
  const formattedSubmitted = numeral(submittedAvg * 100).format('0.00') + '%';
  const acceptedValues = useMemo(() => filteredData.map(item => item.accepted), [filteredData]);
  const acceptedAvg = CalculateArrayAvg(acceptedValues);
  const formattedAccepted = numeral(acceptedAvg * 100).format('0.00') + '%';
  const rejectedValues = useMemo(() => filteredData.map(item => item.rejected), [filteredData]);
  const rejectedAvg = CalculateArrayAvg(rejectedValues);
  const formattedRejected = numeral(rejectedAvg * 100).format('0.00') + '%';
*/