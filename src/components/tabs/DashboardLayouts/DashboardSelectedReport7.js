import React, {useMemo} from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexStandardBarChart from "../../../charts/BarCharts/ApexCharts/ApexStandardBarChart";
import ApexBarAvgChart from "../../../charts/BarCharts/ApexCharts/ApexBarAvgChart";

import ValueCountMap from "../../../charts/ValueCountMap";
import AveragesGroupedByColumn from "../../../charts/DataGridMUI/AveragesGroupedByColumn";
import ChartCardComponent from "../ChartCardComponent";
import StatisticsCardComponent from "../StatisticsCardComponent"
import TableGridCardComponent from "../TableGridCardComponent";
import { FilterProvider } from "../../../FilterContext";
import theme from "../../../theme";


const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
  display: 'flex',
  flexDirection: 'column',

  // position: 'inherit',
}));




/*
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)
*/

const DashboardSelectedReport7 = ({ data }) => {
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
    <ThemeProvider theme={theme}>
      <FilterProvider>
        <Root>
          <Grid container spacing={4}>
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
          <Grid item lg={3} sm={6} xl={3} xs={12}>
              <StatisticsCardComponent 
                metricValue={assetCount}
                metricDisplayedName = "Assets"
                measurement="Total"
              >
              </StatisticsCardComponent>
          </Grid>
        
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <ChartCardComponent title = 'Assets by Code'>
              <ApexStandardBarChart
                targetColumn="emass"
                isHorizontal={true}
                xAxisTitle="Number of Assets"
                yAxisTitle= "eMass Number"
                data={data}
              />
            </ChartCardComponent>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <TableGridCardComponent>
              <AveragesGroupedByColumn 
                groupingColumn = 'emass'
                data={data} 
                targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
              />
            </TableGridCardComponent>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <ChartCardComponent title = "Assets by eMass">
            <ApexStandardBarChart
                targetColumn="acronym"
                isHorizontal={false}
                xAxisTitle="Acronym"
                yAxisTitle= "Number of Assets"
                data={data}
              />
            </ChartCardComponent>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
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

{/* 
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <TableGridCardComponent>
                <Report2CollectionsExpanded data={data}/>
              </TableGridCardComponent>
            </Grid> */}
          </Grid> 
        </Root>
      </FilterProvider>
    </ThemeProvider>
  );
};

export default DashboardSelectedReport7;