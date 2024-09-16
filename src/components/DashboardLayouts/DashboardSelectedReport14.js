import React, { useMemo} from "react";
import {ThemeProvider,Typography, Box} from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import HistoricalDataTracker from "../../charts/LineCharts/ApexCharts/HistoricalDataTracker"
import ChartCardComponent from "../Cards/ChartCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import MultiLevelCollapsibleTable from "../../charts/TableUsingMUI/MultiLevelExpandableTable/MultiLevelCollapsibleTable.js";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import StatisticsCardGroup from "../Cards/StatisticsCardsGroup.js";
import HistoricalDataGrid from "../../charts/DataGridMUI/HistoricalDataGrid";
import GetFilteredData from "../Filtering/GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
import FilterSelectionDrawer from "../Filtering/FilterSideMenu/FilterSelectionDrawer.js";

/*
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)
*/

function getLatestDate(dateObject) {
  let maxDate = null;
  let maxDateEntries = null;
  
  for (const date in dateObject) {
    if (!maxDate || new Date(date) > new Date(maxDate)) {
      maxDate = date;
      maxDateEntries = dateObject[date];
    }
  }
  return { [maxDate]: maxDateEntries };
}

const DashboardSelectedReport14 = ({ data, title}) => {
  const { filter, isWebOrDBIncluded} = useFilter();
  
  //gets the data when filter is applied
  const filteredData = useMemo(() => {
    let result = GetFilteredData(data, filter);

    if (!isWebOrDBIncluded) {
      result = result.filter(item => !item.cklWebOrDatabase);
    }

    return result;
  }, [filter, data, isWebOrDBIncluded]);
  
  //group all data entries by their date
  const dataGroupedByDate = filteredData.reduce((accumulator, currentItem) => {
    //get groupingColumn value in our currentItem
    const groupingValue = currentItem['datePulled'];
    //if groupingValue exists as key in accumulator
    if (!accumulator[groupingValue]) {
      //if not, add key to accumulator with empty array as value.
      accumulator[groupingValue] = []; 
    }
    //add the currentItem to the array to associated key.
    accumulator[groupingValue].push(currentItem);
    return accumulator; //returns {key1:[...], key2:[...], ...}
  }, {});
  //latest date
  const latestDateObj = getLatestDate(dataGroupedByDate);

  //get values (entries from latest date)
  const dataFromLastPullDate = Object.values(latestDateObj)[0];

  return (
    <ThemeProvider theme={theme}>
    {/* <FilterProvider> */}
      <DashboardRoot>
        {/*Filter Bar*/}
        <Grid container
          spacing={{xs:2, s:2, md:2, lg:2.5}}
          sx={{
            px: { lg: 5, xl: 15 }, // Padding-left and padding-right for lg and xl screens
          }}
        >

          <Grid lg={12} sm={12} xl={12} xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems='center'>
              <Typography variant='h1'> {title} </Typography>
              <FilterSelectionDrawer data={dataFromLastPullDate} />
            </Box>
          </Grid>
          
          <Grid lg={12} sm={12} xl={12} xs={12}>
            <StatisticsCardGroup data={dataFromLastPullDate} />
          </Grid>

          <Grid lg={8} md={8} sm={12} xl={6} xs={12}>
            <TableGridCardComponent>
              <HistoricalDataGrid 
                groupingColumn = 'code'
                data={dataFromLastPullDate} 
                targetColumns={["assessed", "submitted", "accepted", "rejected", "asset", "checks", "datePulled"]} 
              />
            </TableGridCardComponent>
          </Grid>
          
          <Grid lg={4} md={4} sm={12} xl={6} xs={12}>
            <ChartCardComponent title = "Assets by Packages">
              <ApexCountByValueBarChart
                targetColumn="shortName"
                isHorizontal={false}
                xAxisTitle="Package Name"
                yAxisTitle= "Number of Assets"
                data={dataFromLastPullDate}
              />
            </ChartCardComponent>
          </Grid> 

          <Grid lg={12} sm={12} xl={12} xs={12}>
            <ChartCardComponent title = 'Historical Data'>
              <HistoricalDataTracker
                groupingColumn="datePulled"
                targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
                xAxisTitle="Date"s
                yAxisTitle= "Completion (%)"
                data={filteredData}
              />
            </ChartCardComponent>
          </Grid> 

          <Grid lg={12} sm={12} xl={12} xs={12}>
            <ExpandableTableCardComponent>
              <MultiLevelCollapsibleTable data={dataFromLastPullDate}/>
            </ExpandableTableCardComponent>
          </Grid> 

        </Grid> 
      </DashboardRoot>

  </ThemeProvider>

  );
};

export default DashboardSelectedReport14;

// const DashboardSelectedReport14 = ({ data }) => {

//   const { filter, updateFilter } = useFilter();
//   //stores the data filter has been applied
//   const filteredData = useMemo(() => {
//     if (Object.keys(filter).length > 0) {
//       const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
//       return filtered;
//     }
//     return data;
//   }, [filter, data]);

//   const listItems = filteredData.map((d) => (
//     <li key={d}> {d}</li>
//   ));
  
//   return (
//     <div>
//       <ul>{listItems}</ul>
//     </div>
//   );
// };

// export default DashboardSelectedReport14;