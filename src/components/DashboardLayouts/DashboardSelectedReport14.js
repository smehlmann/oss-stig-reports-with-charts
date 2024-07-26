import React, { useMemo } from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import HistoricalDataTracker from "../../charts/LineCharts/ApexCharts/HistoricalDataTracker"
import ChartCardComponent from "../Cards/ChartCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import Report5WithMultiLevelBenchmarks from "../../charts/TableUsingMUI/MultiLevelExpandableTable/Report5WithMultiLevelBenchmarks";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import FilterBar from "../FilterBar.js";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
// import AveragesGroupedByColumn from "../../charts/DataGridMUI/AveragesGroupedByColumn";
import AveragesAndCount from "../../charts/DataGridMUI/AveragesAndCount";


const Root = styled('div')(({ theme }) => {
  return ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100%',
    // display: 'flex',
    // flex: 1,
    // flexDirection: 'column',
    // position: 'inherit',
  });
});

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
  
  for(const date in dateObject) {
    if(!maxDate || date > maxDate) {
      maxDate = date;
      maxDateEntries = dateObject[date]
    }
  }
  return {[maxDate]: maxDateEntries}
};

const DashboardSelectedReport14 = ({ data, handleClick }) => {
  const { filter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);
  
  // let groupingColumn = 'datePulled'
  // const values = filteredData.map(item => item[groupingColumn])
  // values.forEach(item => {
  //   console.log(item);
  // })

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
  // console.log('dataGrouped: ', dataGroupedByDate);

  
  const latestDateObj = getLatestDate(dataGroupedByDate);

  //get values (entries with associated date)
  const dataFromLastPullDate = Object.values(latestDateObj)[0];
  // console.log(dataFromLastPullDate);

  // const listItems = data.map((item, index) => (
  //   <li key={index}> <pre>{JSON.stringify(item, null, 2)}</pre> </li>
  // ));


  
  return (
    <ThemeProvider theme={theme}>
    {/* <FilterProvider> */}
      <Root>
        {/*Filter Bar*/}
        <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
          <FilterBar />
        </Grid>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <StatisticsCardGroup data={dataFromLastPullDate} />
          </Grid>


          <Grid item lg={6} md = {6} sm={12} xl={6} xs={12}>
            <TableGridCardComponent>
              <AveragesAndCount 
                groupingColumn = 'code'
                data={dataFromLastPullDate} 
                targetColumns={["assessed", "submitted", "accepted", "rejected", "asset"]} 
              />
            </TableGridCardComponent>
          </Grid>
          
          <Grid item lg={6} sm={6} xl={6} xs={12}>
            <ChartCardComponent title = "Assets by Collection">
              <ApexCountByValueBarChart
                targetColumn="shortName"
                isHorizontal={false}
                xAxisTitle="Collection Name"
                yAxisTitle= "Number of Assets"
                data={dataFromLastPullDate}
              />
            </ChartCardComponent>
          </Grid> 

          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <ChartCardComponent title = 'Historical Data'>
              <HistoricalDataTracker
                groupingColumn="datePulled"
                targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
                xAxisTitle="Date"
                yAxisTitle= "Completion (%)"
                data={filteredData}
              />
            </ChartCardComponent>
          </Grid> 

          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <ExpandableTableCardComponent>
              <Report5WithMultiLevelBenchmarks data={dataFromLastPullDate}/>
            </ExpandableTableCardComponent>
          </Grid> 

        </Grid> 
      </Root>

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