import { useMemo, useEffect} from "react";

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
  

  //keeps track of averages for each column (NO LONGER USED. NEEDS UPDATING)
  useEffect(() => {
    //calculate prodSums
    const answer = filteredData.reduce((acc, currentItem) => {
      const checksInItem = currentItem.checks;

      // const productSums = {};

      targetColumns.forEach(column => {
        if (!acc[column]) {
          acc[column] = 0;
        }
        acc[column] += currentItem[column] * checksInItem;
      });
      
      console.log('acc: ', acc);
      return acc;
    });
    

  }, [filteredData, targetColumns]);

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


