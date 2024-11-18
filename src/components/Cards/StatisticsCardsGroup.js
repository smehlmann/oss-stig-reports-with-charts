import React, { useMemo, useEffect, useState} from 'react';
import {Grid, useMediaQuery} from '@mui/material';
import StatisticsCardComponent from './StatisticsCardComponent';
import ValueCountMap from '../ValueCountMap';
import numeral from 'numeral';

const StatisticsCardGroup = ({data = [], source='' }) => {
  const safeData = useMemo(() => data || [], [data]);
  const [averages, setAverages] = useState([]);

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

  useEffect(() => {
    //compute averages for each entry 
    const calculatedAverages = safeData.map((item, index) => {
      //destructure the relevant properties from current item
      const { checks, assessed, submitted, accepted, rejected } = item;

      //if there are no checks or checks=0, set average to 0 to avoid division by zero
      //basically (checks[i]*assessed[i])/checks[i] for each item 
      const avgAssessed = checks ? (checks * (assessed || 0)) / checks : 0; 
      const avgSubmitted = checks ? (checks * (submitted || 0)) / checks : 0;
      const avgAccepted = checks ? (checks * (accepted || 0)) / checks : 0;
      const avgRejected = checks ? (checks * (rejected || 0)) / checks : 0;

      //return an object containing the calculated averages and unique ID for each entry
      return {
        id: `ent-${index}`, //ensure entry has unique ID
        avgAssessed,
        avgSubmitted,
        avgAccepted,
        avgRejected,
        checks, // keep checks for later aggregation
      };
    }); // creates an array of objects wherein each object contains an id, avgs and checks

    //aggregate the totals across all calculated averages 
    const aggregatedTotals = calculatedAverages.reduce((acc, currentItem) => {
      //get the total number of checks 
      acc.totalChecks += currentItem.checks;

      //gets the sum of all the prior calculated averages
      acc.avgAssessedSum += currentItem.avgAssessed * currentItem.checks; 
      acc.avgSubmittedSum += currentItem.avgSubmitted * currentItem.checks;
      acc.avgAcceptedSum += currentItem.avgAccepted * currentItem.checks;
      acc.avgRejectedSum += currentItem.avgRejected * currentItem.checks;
      return acc;
    }, {
      //set initial values to all 0
      totalChecks: 0,
      avgAssessedSum: 0,
      avgSubmittedSum: 0,
      avgAcceptedSum: 0,
      avgRejectedSum: 0,
    });

    //finalize the averages by dividing summed products by total checks
    const finalAverages = {
      id: 'overall', // Single ID for the overall averages
      avgAssessed: aggregatedTotals.totalChecks ? aggregatedTotals.avgAssessedSum / aggregatedTotals.totalChecks : 0,
      avgSubmitted: aggregatedTotals.totalChecks ? aggregatedTotals.avgSubmittedSum / aggregatedTotals.totalChecks : 0,
      avgAccepted: aggregatedTotals.totalChecks ? aggregatedTotals.avgAcceptedSum / aggregatedTotals.totalChecks : 0,
      avgRejected: aggregatedTotals.totalChecks ? aggregatedTotals.avgRejectedSum / aggregatedTotals.totalChecks : 0,
    };

    // Set the final result to the state
    setAverages([finalAverages]); // Wrap it in an array since you are not separating by groupingColumn
  
  }, [safeData, source]);

  const delinquentCount = useMemo(() => {
    if (source ==='report5' || source === 'report14' || source==='report15' ) {
      const trueDelinquents = safeData.filter(item => item['delinquent'] === 'Yes');
      return trueDelinquents.length;
    }
  }, [safeData, source]);

  //use custom breakpoint for screens less than 1512px with delinquent card
  const isBreakPointForDelinquentCard= useMediaQuery('(max-width: 1512px)');
  //override grid properties with delinquent card
  const getGridPropsWithDelinquentCard = () => {
    //if screen is less than 1512px apply custom grid sizes
    if(isBreakPointForDelinquentCard) {
      return { lg: 4, extendedLg: 4,  xl: 2, sm: 6, xs: 12 };
    } else {
      return { lg: 4, extendedLg: 2, xl: 2, sm: 6, xs: 12 }; 
    }
  };

  const renderCardGroup =() => {
    if(source ==='report14' || source==='report5' || source==='report15') {
      return (
        <Grid container spacing={2.5}>
          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={assetCount}
              metricDisplayedName="Assets"
              measurement="Total"
            />
          </Grid>

          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={delinquentCount}
              metricDisplayedName="Delinquents"
              measurement="Total"
            />
          </Grid>

          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={
                (averages[0]?.avgAssessed || 0) <= 1 
                  ? `${numeral(averages[0]?.avgAssessed * 100).format('0.00')}%` 
                  : averages[0]?.avgAssessed || 0
              }
              metricDisplayedName="Overall Assessed"
              measurement="Average"
            />
          </Grid>

          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={cat1Sum}
              metricDisplayedName="CAT1"
              measurement="Total"
            />
          </Grid>
          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={cat2Sum}
              metricDisplayedName="CAT2"
              measurement="Total"
            />
          </Grid>
          <Grid item {...getGridPropsWithDelinquentCard()}>
            <StatisticsCardComponent 
              metricValue={cat3Sum}
              metricDisplayedName="CAT3"
              measurement="Total"
            />
          </Grid>
        </Grid>
      );
    }
    else {
      return (
        <Grid container spacing={2.5}>
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
    } 
  };

  // return based on the source
  return <>{renderCardGroup()}</>;
  
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