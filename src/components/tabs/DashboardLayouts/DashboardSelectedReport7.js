import React, {useMemo} from "react";
import { Grid, ThemeProvider, Paper, styled, Card, CardHeader, Box} from "@mui/material";
import ApexCountByValueBarChart from "../../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import ApexBarAvgChart from "../../../charts/BarCharts/ApexCharts/ApexBarAvgChart";

import ValueCountMap from "../../../charts/ValueCountMap";
import AveragesGroupedByColumn from "../../../charts/DataGridMUI/AveragesGroupedByColumn";
import ChartCardComponent from "../ChartCardComponent";
import StatisticsCardComponent from "../StatisticsCardComponent"
import TableGridCardComponent from "../TableGridCardComponent";
// import { FilterProvider } from "../../../FilterContext";
import theme from "../../../theme";
import {  useFilter } from "../../../FilterContext";
import CalculateArrayAvg from "../../../charts/CalculateArrayAvg";
import numeral from 'numeral';


const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
  display: 'flex',
  flexDirection: 'column',

  // position: 'inherit',
}));

const MyBox = styled(Box)(({ theme }) => ({
  box: {
    backgroundColor: 'purple',
    color: 'white', // Change text color to white for better visibility
    padding: '10px',
  },
}));

const MyCard = () => {

  return (
    <Card>
      <CardHeader title="My Card Header" />
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={6} sm={3} key={item}>
            <Paper elevation={3} className={theme.box}>
              <p>Box {item}</p>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

/*
Grid spacing is split into 12 parts:
  For evenly spaced cards:
  {3} = 4 cards in row (each is 1/4 of section)
  {4} = 3 cards in row (each is 1/3 of section)
  {6} = 2 cards in row (each is 1/2 of section)
  {12} = 1 card in row (takes up whole section)
*/



const DashboardSelectedReport7 = ({ data }) => {

  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);
  

  //get sum of Cat1
  const cat1Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat1 || 0), 0);
  }, [filteredData]);

  //sum of Cat2
  const cat2Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat2 || 0), 0);
  }, [filteredData]);

  //sum of cat3
  const cat3Sum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.cat3 || 0), 0);
  }, [filteredData]);

  //sum of assets
  const assetCount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.asset || 0), 0);
  }, [filteredData]);

  // //get avg of assessed
  // const assessedValues = useMemo(() => filteredData.map(item => item.assessed), [filteredData]); //extracts values from 'assessed' property and stores them in assessedValues.
  // const assessedAvg = CalculateArrayAvg(assessedValues); //gets avg of assessed vals
  // const formattedAssessed = numeral(assessedAvg * 100).format('0.00') + '%';
  // //get avg of submitted
  // const submittedValues =  useMemo(() => filteredData.map(item => item.submitted), [filteredData]); //extracts 'submitted' prop values
  // const submittedAvg = CalculateArrayAvg(submittedValues);
  // const formattedSubmitted = numeral(submittedAvg * 100).format('0.00') + '%';
  // const acceptedValues = useMemo(() => filteredData.map(item => item.accepted), [filteredData]);
  // const acceptedAvg = CalculateArrayAvg(acceptedValues);
  // const formattedAccepted = numeral(acceptedAvg * 100).format('0.00') + '%';
  // const rejectedValues = useMemo(() => filteredData.map(item => item.rejected), [filteredData]);
  // const rejectedAvg = CalculateArrayAvg(rejectedValues);
  // const formattedRejected = numeral(rejectedAvg * 100).format('0.00') + '%';

  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <Root>
          <Grid container spacing={2}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={assetCount}
                  metricDisplayedName = "Assets"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat1Sum}
                  metricDisplayedName = "CAT1"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat2Sum}
                  metricDisplayedName = "CAT2"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticsCardComponent 
                  metricValue={cat3Sum}
                  metricDisplayedName = "CAT3"
                  measurement="Total"
                >
                </StatisticsCardComponent>
            </Grid>
            
              
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TableGridCardComponent>
                <AveragesGroupedByColumn 
                  groupingColumn = 'emass'
                  data={data} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
                />
              </TableGridCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = "Assets by eMass">
              <ApexCountByValueBarChart
                  targetColumn="acronym"
                  isHorizontal={false}
                  xAxisTitle="Acronym"
                  yAxisTitle= "Number of Assets"
                  data={data}
                />
              </ChartCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <ChartCardComponent title = "Averages">
                <ApexBarAvgChart
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                  isHorizontal = {false}
                  xAxisTitle= "Packages"
                  yAxisTitle= "Number of Assets"
                  disableFilterUpdate={true}
                  data={data}
                />
              </ChartCardComponent>
            </Grid>

  {/* 
              <Grid item lg={12} sm={12} xl={12} xs={12}>
                <TableGridCardComponent>
                  <Report2CollectionsExpanded data={data}/>
                </TableGridCardComponent>
              </Grid> */}
          </Grid> 
        </Root>
      {/* </FilterProvider> */}
    </ThemeProvider>
  );
};

export default DashboardSelectedReport7;