import React, { useMemo } from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";

import ApexBarAvgChart from "../../charts/BarCharts/ApexCharts/ApexBarAvgChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart"
import ValueCountMap from "../ValueCountMap";
import Report8BenchmarksExpanded from "../../charts/TableUsingMUI/Report8BenchmarksExpanded";
import ChartCardComponent from "../Cards/ChartCardComponent";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
import StatisticsCardComponent from "../Cards/StatisticsCardComponent"
import {  useFilter } from "../../FilterContext";

const Root = styled('div')(({ theme }) => {
  return ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100%',
    // display: 'flex',
    // flex: 1,
    // flexDirection: 'column',
    // position: 'inherit',
  });
});

/*
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)
*/

const DashboardSelectedReport5 = ({ data }) => {

  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);
  

  //get sum of Cat1
  const cat1Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat1 || 0), 0);
  }, [filteredData]);
  //sum of Cat2
  const cat2Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat2 || 0), 0);
  }, [filteredData]);
  //sum of cat3
  const cat3Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat3 || 0), 0);
  }, [filteredData]);
  //number of assets
  const assetCount = useMemo(() => {
    const countMap = ValueCountMap(filteredData, 'asset');
    return Object.keys(countMap).length;
  }, [filteredData]);
  
  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <Root>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={assetCount}
                  metricDisplayedName = "Assets"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat1Sum}
                  metricDisplayedName = "CAT1"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat2Sum}
                  metricDisplayedName = "CAT2"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat3Sum}
                  metricDisplayedName = "CAT3"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            

            <Grid item lg={8} sm={6} xl={8} xs={12}>
              <ChartCardComponent title = 'Assets by Benchmark'>
                <ApexCountByValueBarChart
                  targetColumn="benchmarks"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "STIGG Benchmark"
                  data={data}
                />
              </ChartCardComponent>
            </Grid>
            
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = "Averages">
                <DonutAvgChart
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                  xAxisTitle= "Packages"
                  yAxisTitle= "Number of Assets"
                  disableFilterUpdate={true}
                  data={data}
                />
              </ChartCardComponent>
            </Grid> 

            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <Report8BenchmarksExpanded data={data}/>
              </ExpandableTableCardComponent>
            </Grid>
            {/* <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = "Averages">
                <ApexBarAvgChart
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                  isHorizontal = {false}
                  xAxisTitle= "Packages"
                  yAxisTitle= "Number of Assets"
                  disableFilterUpdate={true}
                  data={data}
                />
              </ChartCardComponent>
            </Grid> 
            
            */}

          </Grid> 
        </Root>
      {/* </FilterProvider> */}
    </ThemeProvider>
  );
};

export default DashboardSelectedReport5;