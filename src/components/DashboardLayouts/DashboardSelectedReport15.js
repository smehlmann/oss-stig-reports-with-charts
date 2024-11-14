import React, { useMemo} from "react";
import { ThemeProvider, Box, Typography} from "@mui/material";
import TwoPropsCountByValues from "../../charts/BarCharts/ApexCharts/TwoPropsCountByValues";
import ChartCardComponent from "../Cards/ChartCardComponent";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import StatisticsCardGroup from "../Cards/StatisticsCardsGroup.js";
import MultiLevelTableDataFormatter from "../../charts/ExpandableTables/MultiLevelExpandableTable/MultiLevelTableDataFormatter.js";
import AveragesGroupedByColumn from "../../charts/DataGridMUI/AveragesGroupedByColumn";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js"; 
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";

/*
 Displays report option 9. Unclass Core Printers Metrics
*/

const DashboardSelectedReport15 = ({ data, title }) => {

  const { filter, isWebOrDBIncluded} = useFilter();
  
  //gets the data when filter is applied
  const filteredData = useMemo(() => {
    let result = GetFilteredData(data, filter);

    //remove any assets where cklWebOrDatabase = true
    if (!isWebOrDBIncluded) {
      result = result.filter(item => !item.cklWebOrDatabase);
    }

    return result;
  }, [filter, data, isWebOrDBIncluded, ]);
  
  return (
    <ThemeProvider theme={theme}>
        <DashboardRoot>
          <Grid container 
            spacing={{xs:2, s:2, md:2.5, lg:2.5}}
            sx={{
              px: { lg: 5, xl: 15 }, // Padding-left and padding-right for lg and xl screens
            }}
          >
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <Box display='inline-flex' justifyContent="space-between" sx={{ width:'100%'}} >
                <Typography variant='h1'>{title}</Typography> 
                <FilterSelectionDrawer data={filteredData} source='report15'/>
              </Box>
            </Grid>

            <Grid lg={12} md={12} xl={12} xs={12}>
              <Box> 
                <StatisticsCardGroup data={filteredData} source='report15' />
              </Box>
            </Grid>

            <Grid lg={4} sm={4} xl={6} xs={12}>
              <ChartCardComponent title = "Assets by Package">
                <TwoPropsCountByValues
                  categoryField="department"
                  metricField="asset"
                  isHorizontal={false}
                  xAxisTitle="Department"
                  yAxisTitle= "Number of Assets"
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>

            {/* data grid */}
            <Grid lg={8} sm={8} xl={6} xs={12} >
              <TableGridCardComponent>
                <AveragesGroupedByColumn 
                  groupingColumn = 'department'
                  data={filteredData} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected", "asset", "checks", "delinquent"]} 
                />
              </TableGridCardComponent>
            </Grid>



            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <MultiLevelTableDataFormatter 
                  parentRowColumn = "shortName"
                  firstLevelChildRows = {['asset', 'sysAdmin', 'primOwner', 'assessed', 'submitted', 'accepted']}
                  firstLevelChildRowHeaders= {['Asset', 'System Admin', 'Primary Owner', 'Assessed %', 'Submitted %', 'Accepted %']}
                  secondLevelChildRows = {['benchmarks']}
                  secondLevelChildRowHeaders = {['Benchmarks']}
                  data={filteredData}
                />
              </ExpandableTableCardComponent>
            </Grid>

          </Grid> 
        </DashboardRoot>
    </ThemeProvider>

  );
};

export default DashboardSelectedReport15;