import { useMemo } from "react";

import PropertyAvgMap from "../../../components/PropertyAvgMap.js";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
// import numeral from "numeral";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";

//"data" is an array of objects. 

const ApexBarAvgChart = ({ targetColumns, isHorizontal, dataLabelsArePercentages, xAxisTitle, yAxisTitle, disableFilterUpdate, data}) => {
  
  //useFilter contains 'filter' state and when it's updated
  const { filter } = useFilter();
  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);
  console.log('filteredData: ', filteredData);
  
  //keeps track of averages for each column (NO LONGER USED. NEEDS UPDATING)
  const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);

  //capitalize first letter of the donutLabels
  const barLabels = useMemo(() => Object.keys(averageMap).map(label => label.charAt(0).toUpperCase() + label.slice(1)), [averageMap]);
  //set to average
  const barValues = useMemo(() => Object.values(averageMap), [averageMap]);


  const handleBarClick = (event, chartContext, config) => {
    if (disableFilterUpdate) {
      return; // Do nothing if filter update is disabled
    }
  }
  

  return (
    <ApexBarChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      dataLabelsArePercentages={dataLabelsArePercentages}
      isHorizontal = {isHorizontal}
      xAxisHeader = {xAxisTitle}
      yAxisHeader = {yAxisTitle}
      onClick={handleBarClick}
    />
  );
};

export default ApexBarAvgChart;


