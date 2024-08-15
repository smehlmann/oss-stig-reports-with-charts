import { useMemo } from "react";
import PropertyAvgMap from "../../../components/PropertyAvgMap.js";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";
import GetFilteredData from "../../../components/GetFilteredData.js";

//"data" is an array of objects. 

const DonutAvgChart = ({ targetColumns, legendName, disableFilterUpdate, data }) => {
  
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  //keeps track of averages for each column 
  // const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);
  const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);

  //capitalize first letter of the donutLabels
  const donutLabels = useMemo(() => Object.keys(averageMap).map(label => label.charAt(0).toUpperCase() + label.slice(1)), [averageMap]);
  //set to average
  const donutValues = useMemo(() => Object.values(averageMap), [averageMap]);


  //utility function gets the formatter object and stores in useMemo
  //object holds the formatter function that will be applied to labels 
  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);

  //updates the filter criteria based on user's click
  const handleDonutClick = (event, chartContext, config) => {
    if (disableFilterUpdate) {
      return; // Do nothing if filter update is disabled
    }
  }


  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      lengendTitle={legendName}
      onClick = {handleDonutClick}
      formatLabelToPercentage = {percentageFormatterObject}
      
    />
  );
};

export default DonutAvgChart;
