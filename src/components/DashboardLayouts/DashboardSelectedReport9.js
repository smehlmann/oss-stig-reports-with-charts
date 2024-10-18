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
import SimpleExpandableTable from "../../charts/TableUsingMUI/SimpleExpandableTable.js";

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
      {/* <FilterProvider> */}
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
              <FilterSelectionDrawer data={filteredData} />
              </Box>
            </Grid> 
            

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ChartCardComponent title = 'Assets by STIG Benchmark'>
                <ApexCountByValueBarChart
                  targetColumn="benchmark"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "STIG Benchmark"
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>
            
            {/* <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <Report9ResultsBenchmarksMetrics data={filteredData}/>
              </ExpandableTableCardComponent>
            </Grid> */}

            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <SimpleExpandableTable
                  parentRowColumn="benchmark"
                  childRows={["asset", "latestRev", "quarterVer", "status", "detail", "comment"]} 
                  expandedSectionHeaders={['Asset', 'Latest Revision', 'Current Quarter STIG', 'Status', 'Detail', 'Comment']}
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