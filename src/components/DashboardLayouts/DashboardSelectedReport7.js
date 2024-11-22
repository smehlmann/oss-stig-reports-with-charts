import React, {useMemo} from "react";
import {ThemeProvider, Typography,Box} from "@mui/material";
import AveragesGroupedByColumn from "../../charts/DataGridMUI/AveragesGroupedByColumn";
import ChartCardComponent from "../Cards/ChartCardComponent";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import StatisticsCardGroup from "../Cards/StatisticsCardsGroup.js";
import TwoPropsCountByValues from "../../charts/BarCharts/ApexCharts/TwoPropsCountByValues.js";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
// import FilterBar from "../Filtering/FilterBar.js";
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";

/*
 Displays report option 3. RMF Package Asset Count 
*/

const DashboardSelectedReport7 = ({ data, title }) => {

  //useFilter contains 'filter' state and when it's updated
  const { filter } = useFilter();
  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  return (
    <ThemeProvider theme={theme}>
        <DashboardRoot>
          <Grid container 
            spacing={{xs:2, s:2, md:2.5, lg:2.5}}
            sx={{px: {lg:5, xl: 10}}}
          >
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <Box display="flex" justifyContent="space-between">
              <Typography variant='h1'> {title} </Typography>
              <FilterSelectionDrawer data={filteredData} source ='report7'/>
              </Box>
            </Grid> 
            
            <Grid lg={12} sm={12} xl={12} xs={12}>
              <StatisticsCardGroup source='report7' data={filteredData} />
            </Grid>

            <Grid lg={6} sm={6} xl={6} xs={12}>
              <ChartCardComponent title = "Assets by Package">
              <TwoPropsCountByValues
                  categoryField="acronym"
                  metricField = "asset"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "Acronym"
                  data={filteredData}
                />
              </ChartCardComponent>
            </Grid>
            
            <Grid lg={6} sm={6} xl={6} xs={12}>
              <TableGridCardComponent title = 'Averages by eMASS Number'>
                <AveragesGroupedByColumn 
                  groupingColumn = "emass"
                  data={filteredData} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected", "checks", "emass"]} 
                  source='report7'
                />
              </TableGridCardComponent>
            </Grid>

          </Grid> 
        </DashboardRoot>
    </ThemeProvider>
  );
};

export default DashboardSelectedReport7;