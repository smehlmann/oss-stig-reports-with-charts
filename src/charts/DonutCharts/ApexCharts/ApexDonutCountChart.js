import { useEffect, useState, useMemo } from "react";
// import { Chart } from "chart.js/auto";
import ValueCountMap from "../../../components/ValueCountMap.js";
// import PieChartBuilder from "./PieChartBuilder.js";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
//"data" is an array of objects. 

const ApexDonutCountChart = ({ targetColumn, legendName, data }) => {

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


  //donutLabels = value, donutValues = number of occurrences of value
  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);
  
  const donutLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const donutValues = useMemo(() => Object.values(countMap), [countMap]);
  
  //updates the filter criteria based on user's click
  const handleDonutClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.dataPointIndex];
    updateFilter({ [targetColumn]: selectedValue });
  };


  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      lengendTitle={legendName}
      onClick = {handleDonutClick}
    />
  );
};

export default ApexDonutCountChart;

/*
So I have the following functional component that takes in a target column, counts the values present in the target column, and then passes these to another function to build the chart. However, what I want to do is to create a 
*/