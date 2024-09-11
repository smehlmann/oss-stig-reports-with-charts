import React, { useMemo} from "react";
import {ThemeProvider,Typography, Box} from "@mui/material";
import TableGridCardComponent from "../Cards/TableGridCardComponent";
import ChartCardComponent from "../Cards/ChartCardComponent";
import theme from "../../theme";
import {  useFilter } from "../../FilterContext";
import ExpandableTableCardComponent from "../Cards/ExpandableTableCardComponent";
import StatisticsCardGroup from "../StatisticsCardsGroup.js";
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


  
  return (
    <div>
      <ul>{data}</ul>
    </div>
  );
};

export default DashboardSelectedReport9;
