import React, { useMemo} from "react";
import {ThemeProvider,Typography, Box} from "@mui/material";
import ApexCountByValueBarChart from "../../charts/BarCharts/ApexCharts/ApexCountByValueBarChart";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import HistoricalDataTracker from "../../charts/LineCharts/ApexCharts/HistoricalDataTracker"
import ChartCardComponent from "../Cards/ChartCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import Report5WithMultiLevelBenchmarks from "../../charts/TableUsingMUI/MultiLevelExpandableTable/Report5WithMultiLevelBenchmarks";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
import HistoricalDataGrid from "../../charts/DataGridMUI/HistoricalDataGrid";
import GetFilteredData from "../GetFilteredData.js";
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardRoot } from "./DashboardRoot.js";
import FilterSelectionDrawer from "../FilterSideMenu/FilterSelectionDrawer.js";


const DashboardSelectedReport9 = ({ data }) => {

  // const { filter, updateFilter } = useFilter();
  // //stores the data filter has been applied
  // const filteredData = useMemo(() => {
  //   if (Object.keys(filter).length > 0) {
  //     const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
  //     return filtered;
  //   }
  //   return data;
  // }, [filter, data]);

  const listItems = data.map((d) => (
    <li key={d}> {d}</li>
  ));
  
  return (
    <div>
      <ul>{listItems}</ul>
    </div>
  );
};

export default DashboardSelectedReport9;
