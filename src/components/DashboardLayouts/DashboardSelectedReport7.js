import React, {useMemo} from "react";
import { Grid, ThemeProvider,styled} from "@mui/material";
import AveragesGroupedByColumn from "../../charts/DataGridMUI/AveragesGroupedByColumn";
import ChartCardComponent from "../Cards/ChartCardComponent";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
import FromTwoPropertiesBarChart from "../../charts/BarCharts/ApexCharts/FromTwoPropertiesBarChart";
import FilterBar from "../FilterBar.js";


const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(3),

  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: '100vh',
  // display: 'flex', //stats cards will be enlarged in height
  // flex: 1,
  flexDirection: 'column',
  // position: 'inherit',

}));

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
  const { filter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  return (
    <ThemeProvider theme={theme}>
      {/* <FilterProvider> */}
        <Root>
          {/*Filter Bar*/}
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <FilterBar />
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <StatisticsCardGroup data={filteredData} />
            </Grid>

            <Grid item lg={8} sm={6} xl={8} xs={12}>
              <ChartCardComponent title = "Assets by eMass">
              <FromTwoPropertiesBarChart
                  labelColumn="acronym"
                  valueColumn = "asset"
                  isHorizontal={true}
                  xAxisTitle="Number of Assets"
                  yAxisTitle= "Acronym"
                  data={data}
                />
              </ChartCardComponent>
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

            
          </Grid> 
        </Root>
      {/* </FilterProvider> */}
    </ThemeProvider>
  );
};

export default DashboardSelectedReport7;