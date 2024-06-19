import React, { useMemo } from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexStandardBarChart from "../../charts/BarCharts/ApexCharts/ApexStandardBarChart";
import BubbleCountChart from "../../charts/BubbleCharts/BubbleCountChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";
import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
import ApexBarAvgChart from "../../charts/BarCharts/ApexCharts/ApexBarAvgChart";

import ValueCountMap from "../../charts/ValueCountMap";
import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";
import CustomCardComponent from "./CustomCardComponent";
import TableGridCardComponent from "./TableGridCardComponent";
import { FilterProvider } from "../../FilterContext";
import theme from "../../theme"



const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
  // position: 'inherit',

}));

const AssetCountCard = ({ data }) => {
  const assetCount = useMemo(() => {
    const countMap = ValueCountMap(data, 'asset');
    return Object.keys(countMap).length;
  }, [data]);

  return (
    <CustomCardComponent title="Asset Count">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px' }}>{assetCount}</div>
        <div style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>Asset</div>
      </div>
    </CustomCardComponent>
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


const DashboardLayout = ({ data }) => {
  return (
    <ThemeProvider theme={theme}>
      <FilterProvider>
        <Root>
          <Grid container spacing={4}>

            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent title = 'Assets by Code'>
                <ApexStandardBarChart
                  targetColumn="code"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "Code"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={8} sm={6} xl={8} xs={12}>
              <TableGridCardComponent>
                <Report2AveragesPerCode data={data} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
                />
              </TableGridCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent title = "Assets by Collection">
              <ApexStandardBarChart
                  targetColumn="shortName"
                  isHorizontal={false}
                  xAxisTitle="Collection Name"
                  yAxisTitle= "Number of Assets"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent title = "Averages">
                <ApexBarAvgChart
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                  isHorizontal = {false}
                  xAxisTitle= "Packages"
                  yAxisTitle= "Number of Assets"
                  disableFilterUpdate={true}
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent title = "Assets by Package">
                <BubbleCountChart
                  targetColumn="shortName"
                  isHorizontal={false}
                  xAxisTitle = "Package Name"
                  yAxisTitle="Number of Assets"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>

            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <TableGridCardComponent>
                <Report2CollectionsExpanded data={data}/>
              </TableGridCardComponent>
            </Grid>
          </Grid> 
        </Root>
      </FilterProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;