import React, { useMemo} from "react";
import {ThemeProvider,Typography, Box} from "@mui/material";
import ChartCardComponent from "../Cards/ChartCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import TwoLevelTableDataFormatter from "../../charts/ExpandableTables/TwoLevelTable/TwoLevelTableDataFormatter.js";
import TwoPropsCountByValues from "../../charts/BarCharts/ApexCharts/TwoPropsCountByValues.js";
import HorizontalBarChartCard from "../Cards/HorizontalBarChartCard.js";

/* Displays report option 5.Open Result Finding Metrics (eMASS number(s) required)  */

const DashboardSelectedReport9 = ({ title, data }) => {
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

      {/* <div>
        <ul>{listItems}</ul>
     </div> */}
        <DashboardRoot>
          <Grid container 
            spacing={{xs:2, s:2, md:2.5, lg:2.5}}
            sx={{
              px: { lg: 5, xl: 15 }, //padding-left and padding-right for lg and xl screens
            }}
          >

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <Box display="flex" justifyContent="space-between">
              <Typography variant='h1'> {title} </Typography>
              <FilterSelectionDrawer data={filteredData} source='report9' />
              </Box>
            </Grid> 
            
            <Grid lg={6} sm={12} xl={6} xs={12}>
              <HorizontalBarChartCard title = 'Assets by STIG Benchmark'>
                <ApexCountByValueBarChart
                  targetColumn="benchmark"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "STIG Benchmark"
                  data={filteredData}
                />
              </HorizontalBarChartCard>
            </Grid>
            

            <Grid lg={6} sm={12} xl={6} xs={12}>
              <ChartCardComponent title = 'Status Breakdown'>
                <TwoPropsCountByValues
                  categoryField="status"
                  metricField="groupId"
                  isHorizontal={false}
                  xAxisTitle="Status"
                  yAxisTitle= "Number of Checks"
                  source='report9'
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <TwoLevelTableDataFormatter
                  parentRowColumn="benchmark"
                  childRows={["asset","groupId", "latestRev", "quarterVer", "status", "detail", "comment"]} 
                  expandedSectionHeaders={['Asset','Group ID', 'Latest Revision', 'Current Quarter STIG', 'Status', 'Detail', 'Comment']}
                  data={filteredData}
                />
              </ExpandableTableCardComponent>
            </Grid>

            

          </Grid> 
        </DashboardRoot>
      {/* </FilterProvider> */}
    </ThemeProvider>
  );
};
export default DashboardSelectedReport9;