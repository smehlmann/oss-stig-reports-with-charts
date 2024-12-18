import React, { useMemo,} from "react";
import {ThemeProvider,Box, Typography } from "@mui/material";
import TwoLevelTableDataFormatter from "../../charts/ExpandableTables/TwoLevelTable/TwoLevelTableDataFormatter";
import HorizontalBarChartCard from "../Cards/HorizontalBarChartCard.js";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";
import GroupedAveragesBar from "../../charts/BarCharts/ApexCharts/GroupedAveragesBar.js";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart.js";


/*
 Displays report option 4. STIG Benchmark Version Deltas (eMASS number(s) required)
*/

const DashboardSelectedReport5 = ({ data, title }) => {

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
              <FilterSelectionDrawer data={filteredData} source ='report8'/>
              </Box>
            </Grid> 

            {/* displays horizontal bar chart */}
            <Grid lg={6} extendedLg={6} sm={12} md={12} xl={6} xs={12}>
              <HorizontalBarChartCard title = 'Assets by STIG Benchmark'>
               <ApexCountByValueBarChart
                  targetColumn="benchmarkId"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "STIG Benchmark"
                  data={filteredData}
                />
              </HorizontalBarChartCard>
            </Grid> 

            <Grid lg={6} extendedLg={6} sm={12} md={12} xl={6} xs={12}>
              <HorizontalBarChartCard title = 'STIG Benchmark by Completion'>
                <GroupedAveragesBar
                  groupByColumn='benchmarkId'
                  breakdownColumns={['assessed', 'submitted']}
                  dataLabelsArePercentages = {true}
                  isHorizontal={true}
                  isStackedBarChart={false}
                  xAxisTitle="Percentage"
                  yAxisTitle= "STIG Benchmark"
                  data={filteredData}
                />
              </HorizontalBarChartCard>
            </Grid>

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <TwoLevelTableDataFormatter
                  parentRowColumn="benchmarkId"
                  childRows={["collectionName", "asset", "sysAdmin", "primOwner", "latestRev", 
                    "quarterVer"]} 
                  expandedSectionHeaders={['Collection','Asset','System Admin', 'Primary Owner', 
                    'Latest Revision', 'Current Quarter STIG']}
                  data={filteredData}
                />
              </ExpandableTableCardComponent>
            </Grid>
          </Grid> 
        </DashboardRoot>
    </ThemeProvider>
  );
};

export default DashboardSelectedReport5;

/*
To make DonutAvgChart:
<ChartCardComponent title = "Averages">
  <DonutAvgChart
    targetColumns={["assessed", "submitted", "accepted", "rejected"]}
    xAxisTitle= "Packages"
    yAxisTitle= "Number of Assets"
    disableFilterUpdate={true}
    data={data}
  />
 
 */