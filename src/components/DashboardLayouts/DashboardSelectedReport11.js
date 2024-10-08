import React, { useMemo} from "react";
import {ThemeProvider,Typography, Box} from "@mui/material";
import HorizontalCardComponent from "../Cards/HorizontalCardComponent";
import ChartCardComponent from "../Cards/ChartCardComponent";

import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import SimpleExpandableTable from "../../charts/TableUsingMUI/SimpleExpandableTable";
import { format } from 'date-fns';
import GroupedBarChart from "../../charts/BarCharts/ApexCharts/GoupedBarChart";


/* Displays report option 6. Checks Not Updated in x Days (eMASS number(s) required)  */

//formats date objects to strings
const formatDate = (date) => {
  if (date instanceof Date) {
    return format(date, 'MM/dd/yyyy'); // Customize the format string as needed
  }
  return date;
};

const DashboardSelectedReport11 = ({ title, data }) => {
  const { filter, isWebOrDBIncluded} = useFilter();
  
  //gets the data when filter is applied
  const filteredData = useMemo(() => {
    let result = GetFilteredData(data, filter);
    if (!isWebOrDBIncluded) {
      result = result.filter(item => !item.cklWebOrDatabase);
    }
    return result;
  }, [filter, data, isWebOrDBIncluded]);


  filteredData.forEach(obj => {
    obj.modifiedDate = formatDate(obj.modifiedDate);
  })



  // useEffect(() => {
  //   console.log('Formatted Data:', filteredData);
  // }, [filteredData]);

  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <DashboardRoot>
          <Grid container 
            spacing={{xs:2, s:2, md:3, lg:3}}
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
                <GroupedBarChart
                  targetColumn="benchmark"
                  isHorizontal={true}
                  columnDataIsGroupedBy="status"
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "STIG Benchmark"
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>
        

          
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <ExpandableTableCardComponent>
                <SimpleExpandableTable 
                    parentRowColumn="benchmark"
                    childRows={["asset", "primOwner", "sysAdmin", "revision", "groupId", 
                      "result", "status","modifiedDate", "modifiedBy"]} 
                    expandedSectionHeaders={['Asset','Primary Owner', 'System Admin', 'Revision', 
                      'Group ID', 'Result','Status', 'Modified Date', 'Modified By']}
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
export default DashboardSelectedReport11;