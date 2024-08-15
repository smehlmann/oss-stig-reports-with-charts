import React, { useMemo } from "react";
import { ThemeProvider, styled } from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import ChartCardComponent from "../Cards/ChartCardComponent";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
import Report5WithMultiLevelBenchmarks from "../../charts/TableUsingMUI/MultiLevelExpandableTable/Report5WithMultiLevelBenchmarks";
import FilterBar from "../FilterBar.js";
import AveragesGroupedByColumn from "../../charts/DataGridMUI/AveragesGroupedByColumn";
import GetFilteredData from "../GetFilteredData.js";
import FilterMenu from "../FilterMenu.js";
import Grid from '@mui/material/Unstable_Grid2';


const Root = styled('div')(({ theme }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)}`,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    // height:  `calc(100vh - ${verticalPadding}px)`, // subtract verticalPadding from 100vh
    minHeight: '100vh',
    boxSizing: 'border-box',
    flexGrow: 1, //take up remaining space
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

  const { filter, isWebOrDBIncluded} = useFilter();
  
  //gets the data when filter is applied
  const filteredData = useMemo(() => {
    let result = GetFilteredData(data, filter);

    if (!isWebOrDBIncluded) {
      result = result.filter(item => item.cklWebOrDatabase);
    }

    return result;
  }, [filter, data, isWebOrDBIncluded]);
  
    // const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  //get objs whose cklWebOrDatabase val != empty
  // const WebOrDBAssets = filteredData.reduce((accumulator, currentObj) => { 
  //   //if currentObj's prop is not empty/null
  //   if(currentObj['cklWebOrDatabase']) {
  //     //add to accumulator array
  //     accumulator.push(currentObj);
  //   } 
  //   return accumulator;
  // }, []);
  // console.log("count: ", WebOrDBAssets);


  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <Root>
          {/*Filter Bar*/}

          <Grid container spacing={{xs:2, s:2, md:3, lg:3}} >
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <FilterBar />
            </Grid>
            {/* Stats cards */}
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <StatisticsCardGroup data={filteredData} />
            </Grid>
            
            {/* data grid */}
            <Grid lg={6} sm={6} xl={6} xs={12} >
              <TableGridCardComponent>
                <AveragesGroupedByColumn 
                  groupingColumn = 'code'
                  data={filteredData} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected", "asset", "checks"]} 
                />
              </TableGridCardComponent>
            </Grid>
            
            <Grid lg={6} sm={6} xl={6} xs={12}>
              <ChartCardComponent title = "Assets by Collection">
                <ApexCountByValueBarChart
                  targetColumn="shortName"
                  isHorizontal={false}
                  xAxisTitle="Collection Name"
                  yAxisTitle= "Number of Assets"
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <Report5WithMultiLevelBenchmarks data={filteredData}/>
              </ExpandableTableCardComponent>
            </Grid> 

          </Grid> 
        </Root>
    </ThemeProvider>
  );
};

export default DashboardSelectedReport5;