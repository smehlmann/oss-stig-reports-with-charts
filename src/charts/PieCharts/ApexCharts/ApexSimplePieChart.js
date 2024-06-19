import React, { useMemo } from "react";
import ValueCountMap from "../../ValueCountMap.js";
import ApexPieChartBuilder from "./ApexPieChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";


const ApexSimplePieChart = ({ targetColumn, legendName, data }) => {
  
  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  
  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);
  const pieLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const pieValues = useMemo(() => Object.values(countMap), [countMap]);

  const handlePieClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.dataPointIndex];
    updateFilter({ [targetColumn]: selectedValue });
  };

  return (
    <ApexPieChartBuilder
      dataLabels={pieLabels}
      dataValues={pieValues}
      legendTitle={legendName}
      onClick={handlePieClick}
    />
  );
};

export default ApexSimplePieChart;



// const ApexSimplePieChart = ({ targetColumn, chartTitle, legendName, data}) => {
//   const { filter, updateFilter } = useFilter();

//   const filteredData = useMemo(() => {
//     if (Object.keys(filter).length > 0) {
//       return data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
//     }
//     return data;
//   }, [filter, data]);

//   //pieLabels = value, pieValues = number of occurrences of value
//   const countMap = useMemo(() => ValueCountMap(data, targetColumn), [data, targetColumn]);
  
//   const pieLabels = useMemo(() => Object.keys(countMap), [countMap]);
//   const pieValues = useMemo(() => Object.values(countMap), [countMap]);

//   const handlePieClick = (event, chartContext, config) => {
//     const selectedValue = config.w.config.labels[config.dataPointIndex];
//     updateFilter({ [targetColumn]: selectedValue }); // Dynamically set filter based on targetColumn
//   };

//   return (
//     <ApexPieChartBuilder
//       dataLabels={pieLabels}
//       dataValues={pieValues}
//       title={chartTitle}
//       lengendTitle={legendName}
//       onClick={handlePieClick}
//     />
//   );
// };

// export default ApexSimplePieChart;
