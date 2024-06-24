import { useMemo } from "react";

import PropertyAvgMap from "../../PropertyAvgMap.js";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
import numeral from "numeral";
import {getPercentageFormatterObject} from "../../getPercentageFormatterObject.js";

//"data" is an array of objects. 

const ApexBarAvgChart = ({ targetColumns, isHorizontal, xAxisTitle, yAxisTitle, disableFilterUpdate, data}) => {
  
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
  

  //keeps track of averages for each column 
  // const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);
  const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);

  //capitalize first letter of the donutLabels
  const barLabels = useMemo(() => Object.keys(averageMap).map(label => label.charAt(0).toUpperCase() + label.slice(1)), [averageMap]);
  //set to average
  const barValues = useMemo(() => Object.values(averageMap), [averageMap]);

  //utility function gets the formatter object and stores in useMemo
  //object holds the formatter function that will be applied to labels 
  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);

  const handleBarClick = (event, chartContext, config) => {
    if (disableFilterUpdate) {
      return; // Do nothing if filter update is disabled
    }
  }
  

  return (
    <ApexBarChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      isHorizontal = {isHorizontal}
      xAxisHeader = {xAxisTitle}
      yAxisHeader = {yAxisTitle}
      onClick={handleBarClick}
      formatLabelToPercentage = {percentageFormatterObject}
    />
  );
};

export default ApexBarAvgChart;
