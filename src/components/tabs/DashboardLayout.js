import React, { useMemo } from "react";
import { Grid, createTheme, ThemeProvider, styled } from "@mui/material";
import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
import ApexStandardBarChart from "../../charts/BarCharts/ApexCharts/ApexStandardBarChart";
import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";
import ValueCountMap from "../../charts/ValueCountMap";

import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";
import CustomCardComponent from "./CustomCardComponent";
import { FilterProvider } from "../../FilterContext";

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

const DashboardLayout = ({ data }) => {
  return (
    <ThemeProvider theme={theme}>
      <FilterProvider>
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
                  isHorizontal={false}
                  chartTitle="Code by Frequency"
                  xAxisTitle="Code"
                  yAxisTitle="Frequency"
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
      </FilterProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;