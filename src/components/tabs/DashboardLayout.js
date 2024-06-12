import React, { useMemo } from "react";
import { Grid, ThemeProvider, styled } from "@mui/material";
import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
import ApexStandardBarChart from "../../charts/BarCharts/ApexCharts/ApexStandardBarChart";
import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";
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

const gridHeaders = [
  { field: 'code', headerName: 'Code', flex: 1 },
  { field: 'avgAssessed', headerName: 'Avg of Assessed', flex: 1 },
  { field: 'avgSubmitted', headerName: 'Avg of Submitted', flex: 1 },
  { field: 'avgAccepted', headerName: 'Avg of Accepted', flex: 1 },
  { field: 'avgRejected', headerName: 'Avg of Rejected', flex: 1 },
];

const DashboardLayout = ({ data }) => {
  return (
    <ThemeProvider theme={theme}>
      <FilterProvider>
        <Root>
          <Grid container spacing={4}>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent>
                <ApexSimplePieChart
                  targetColumn="shortName"
                  chartTitle="Collections"
                  legendName="Name of collection"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={8} sm={6} xl={8} xs={12}>
              <TableGridCardComponent>
                <Report2AveragesPerCode data={data} 
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]} 
                  columnHeaders = {gridHeaders} 
                />
              </TableGridCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent>
                <ApexStandardBarChart
                  targetColumn="code"
                  isHorizontal={false}
                  chartTitle="Code by Frequency"
                  xAxisTitle="Code"
                  yAxisTitle="Frequency"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent>
                <ApexDonutCountChart
                  targetColumn="shortName"
                  chartTitle="Collections"
                  legendName="Name of collection"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CustomCardComponent>
                <DonutAvgChart
                  targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                  chartTitle="Averages"
                  legendName="Amounts"
                  data={data}
                />
              </CustomCardComponent>
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
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