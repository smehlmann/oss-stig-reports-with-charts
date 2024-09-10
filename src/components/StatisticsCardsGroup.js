import React, { useMemo} from 'react';
import {Grid} from '@mui/material';
import StatisticsCardComponent from './Cards/StatisticsCardComponent';
import ValueCountMap from './ValueCountMap';

const StatisticsCardGroup = ({data = [], source='' }) => {
  const safeData = useMemo(() => data || [], [data]);

  //get sum of Cat1
  const cat1Sum = useMemo(() => {
    return safeData.reduce((sum, item) => sum + (item.cat1 || 0), 0);
  }, [safeData]);

  //sum of Cat2
  const cat2Sum = useMemo(() => {
    return safeData.reduce((sum, item) => sum + (item.cat2 || 0), 0);
  }, [safeData]);

  //sum of cat3
  const cat3Sum = useMemo(() => {
    return safeData.reduce((sum, item) => sum + (item.cat3 || 0), 0);
  }, [safeData]);

  //number of assets
  const assetCount = useMemo(() => {
    if (source === 'report7') {
      return safeData.reduce((sum, item) => sum + (item.asset || 0), 0);
    } else {
      const countMap = ValueCountMap(safeData, 'asset');
      return Object.values(countMap).reduce((sum, value) => sum + (value || 0), 0); //sum of all asset values (includes dups)
    }
  }, [safeData, source]);


  return (
    <Grid container spacing={3}>
      <Grid item lg={3} md={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={assetCount}
          metricDisplayedName="Assets"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} md={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={cat1Sum}
          metricDisplayedName="CAT1"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} md={3} sm={6} xl={3} xs={12}>
        <StatisticsCardComponent 
          metricValue={cat2Sum}
          metricDisplayedName="CAT2"
          measurement="Total"
        />
      </Grid>
      <Grid item lg={3} md={3} sm={6} xl={3} xs={12}>
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
  Code for Reference

  // const assets = [];
  // //store unique assset values
  // const unqiueAssets = new Set();

  // //iterate through safeData array
  // safeData.forEach((obj) => {
  //   const asset = obj.asset;
  //   if (!unqiueAssets.has(asset)) {
  //     //if asset not in set, add to both set and items array
  //     unqiueAssets.add(asset);
  //     assets.push(asset);
  //   }
  // })

  // console.log("assets array: ", assets);
  // const assetCount = assets.length;
  // console.log("assetCount: ", assetCount);

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