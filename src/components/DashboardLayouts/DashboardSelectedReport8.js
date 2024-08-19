import React, { useMemo } from "react";
import {ThemeProvider } from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart"
import Report8BenchmarksExpanded from "../../charts/TableUsingMUI/Report8BenchmarksExpanded";
import ChartCardComponent from "../Cards/ChartCardComponent";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
// import StatisticsCardGroup from "../StatisticsCardsGroup.js";
import {  useFilter } from "../../FilterContext";
import FilterBar from "../FilterBar.js";
import GetFilteredData from "../GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";

/*
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)
*/

const DashboardSelectedReport5 = ({ data }) => {

  const { filter, isWebOrDBIncluded} = useFilter();
  
  //gets the data when filter is applied
  const filteredData = useMemo(() => {
    let result = GetFilteredData(data, filter);

    if (!isWebOrDBIncluded) {
      result = result.filter(item => !item.cklWebOrDatabase);
    }

    return result;
  }, [filter, data, isWebOrDBIncluded]);
  
  
  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <DashboardRoot>

          <Grid container spacing={{xs:2, s:2, md:3, lg:3}} >
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <FilterBar />
            </Grid>

            {/* <Grid lg={12} sm={12} xl={12} xs={12}>
              <StatisticsCardGroup data={filteredData} />
            </Grid> */}
            

            <Grid lg={8} sm={6} xl={8} xs={12}>
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
            
            <Grid lg={4} sm={6} xl={4} xs={12}>
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

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <Report8BenchmarksExpanded data={data}/>
              </ExpandableTableCardComponent>
            </Grid>
            

          </Grid> 
        </DashboardRoot>
      {/* </FilterProvider> */}
    </ThemeProvider>
  );
};

export default DashboardSelectedReport5;