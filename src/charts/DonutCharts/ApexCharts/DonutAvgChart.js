import { useEffect, useState, useMemo } from "react";
// import { Chart } from "chart.js/auto";
// import { palette} from "../../palette.js";

import PropertyAvgMap from "../../PropertyAvgMap.js";
import numeral from "numeral";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";

//"data" is an array of objects. 

const DonutAvgChart = ({ targetColumns, chartTitle, legendName, data }) => {
  
  //prints out properties of each item 
  // data.forEach((item, index) => {
  //   console.log(`Keys of item at index ${index}:`, Object.keys(item));
  // });

  const averageMap = useMemo(() => PropertyAvgMap(data, targetColumns), [data, targetColumns]);
  
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

  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      title={chartTitle}
      lengendTitle={legendName}
      
    />
  );
};

export default DonutAvgChart;
