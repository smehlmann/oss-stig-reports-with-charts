import { useEffect, useState, useMemo } from "react";

import PropertyAvgMap from "../../PropertyAvgMap.js";
import numeral from "numeral";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";

//"data" is an array of objects. 

const DonutAvgChart = ({ targetColumns, chartTitle, legendName, data }) => {
  
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
  const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);

  // format avgs as percentages 
  const formattedAverageMap = useMemo(() => {
    const formattedMap = {};
    Object.keys(averageMap).forEach((key) => {
      formattedMap[key] = numeral(averageMap[key] * 100).format('0.00') + '%';
    });
    return formattedMap;
  }, [averageMap]);

  const donutLabels = useMemo(() => Object.keys(averageMap), [averageMap]);
  const donutValues = useMemo(() => Object.values(averageMap), [averageMap]);


  //updates the filter criteria based on user's click
  const handleDonutClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.dataPointIndex];
    updateFilter({ [targetColumns]: selectedValue });
  };
  
  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      title={chartTitle}
      lengendTitle={legendName}
      onClick = {handleDonutClick}
      
    />
  );
};

export default DonutAvgChart;
