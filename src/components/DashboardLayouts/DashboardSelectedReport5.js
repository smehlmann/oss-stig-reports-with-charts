import React, { useMemo } from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import AveragesAndCount from "../../charts/DataGridMUI/AveragesAndCount";
import ChartCardComponent from "../Cards/ChartCardComponent";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
import Report5WithMultiLevelBenchmarks from "../../charts/TableUsingMUI/MultiLevelExpandableTable/Report5WithMultiLevelBenchmarks";
import FilterBar from "../FilterBar.js";

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
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

const DashboardSelectedReport5 = ({ data }) => {

  const { filter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);
  

  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <Root>
          {/*Filter Bar*/}
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <FilterBar />
          </Grid>
          <Grid container spacing={3}>
            {/* Stats cards */}
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <StatisticsCardGroup data={filteredData} />
            </Grid>
            
          
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = 'Assets by Code'>
                <ApexCountByValueBarChart
                  targetColumn="code"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "Code"
                  data={data}
                />
              </ChartCardComponent>
            </Grid>

            {/* data grid */}
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TableGridCardComponent>
                <AveragesAndCount 
                  groupingColumn = 'code'
                  data={data} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected", "asset", "checks"]} 
                />
              </TableGridCardComponent>
            </Grid>
            
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = "Assets by Collection">
                <ApexCountByValueBarChart
                  targetColumn="shortName"
                  isHorizontal={false}
                  xAxisTitle="Collection Name"
                  yAxisTitle= "Number of Assets"
                  data={data}
                />
              </ChartCardComponent>
            </Grid>

            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <Report5WithMultiLevelBenchmarks data={data}/>
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

    </ThemeProvider>
  );
};

export default DashboardSelectedReport5;