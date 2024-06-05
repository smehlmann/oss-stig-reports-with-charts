import React from "react";
import { Grid, Card, CardHeader, CardContent, createTheme, ThemeProvider, styled } from "@mui/material";
import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
import ApexStandardBarChart from "../../charts/BarCharts/ApexCharts/ApexStandardBarChart";
import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";
import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";
import CustomCardComponent from "./CustomCardComponent";
const theme = createTheme({
  palette: {
    background: {
      default: "#f4f6f8",
    },
    text: {
      primary: "#333333",
    },
  },
  spacing: 8,
});

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary
}));

const DashboardLayout = ({ data }) => {
  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
           <CustomCardComponent>
              <ApexSimplePieChart
                targetColumn="shortName"
                chartTitle="Collections"
                legendName="Name of collection"
                data={data}
              />
            </CustomCardComponent>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <CustomCardComponent>
              <ApexStandardBarChart
                targetColumn="code"
                isHorizontal = {false}
                chartTitle="Code Frequency"
                yAxisTitle="Code"
                xAxisTitle="Frequency"
                data={data}
              />
            </CustomCardComponent>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <CustomCardComponent> 
              <ApexDonutCountChart
                targetColumn="shortName"
                chartTitle="Collections"
                legendName="Name of collection"
                data={data}
              />
            </CustomCardComponent>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <CustomCardComponent>
              <DonutAvgChart
                targetColumns={["assessed", "submitted", "accepted", "rejected"]}
                chartTitle="Averages"
                legendName="Amounts"
                data={data}
              />
            </CustomCardComponent>
          </Grid>

          <Grid item lg={4} md={6} xl={3} xs={12}>
            <CustomCardComponent>
              <Report2CollectionsExpanded data={data} />
            </CustomCardComponent>
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <CustomCardComponent>
              <Report2AveragesPerCode data={data} />
            </CustomCardComponent>
          </Grid>
        </Grid>
      </Root>
    </ThemeProvider>
  );
};

export default DashboardLayout;