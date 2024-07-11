import React, { useMemo } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";

const ApexCountByValueBarChart = ({ targetColumn, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) { 
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  //ValueCountMap -> count the number of times a value appears in the targetColumn
  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);

  // //specific check when targetProperty is "shortName"
  // if (targetColumn === "shortName") {
  //   //only look at records whose shortName = NCCM
  //   const filteredNccmData = data.filter(
  //     (entry) => entry.shortName === "NCCM",
  //   );

  //   //use reduce to get values of 'nccm' column and their counts
  //   const nccmMap = filteredNccmData.reduce((accumulator, row) => {
  //     //extract a nccm property values(ie. "NCCM-W", "NCCM-S"...) from row
  //     const nccmPropValue = row["nccm"];
  //     //if nccmPropValue (the key) is null, the key is changed to "NCCM"
  //     const nccmKey = nccmPropValue === null ? "NCCM" : nccmPropValue;
  //     // Increment the count for the extracted property value
  //     accumulator[nccmKey] = (accumulator[nccmKey] || 0) + 1;
  //     return accumulator;
  //   }, {});

  //   //key-value pairs from nccmMap added to countMap,nccmMap keys overrides duplicate keys
  //   Object.keys(nccmMap).forEach((key) => {
  //     countMap[key] = nccmMap[key];
  //   });
  // }

  const barLabels = useMemo(() => Object.keys(countMap), [countMap]); //labels = array of values in targetColumn
  const barValues = useMemo(() => Object.values(countMap), [countMap]); //array of number of times a label appears

  //updates the filter criteria based on user's click
  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;

      if (selectedValue) {
      // Check if the selected value is already in the filter
      if (filter[targetColumn] === selectedValue) {
        // Remove the filter
        updateFilter({ [targetColumn]: undefined });
      } else {
        // Add the filter
        updateFilter({ [targetColumn]: selectedValue });
      }
    }
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      {/* {barValues.map((val, index) => (
        <div key={index}>
          <body1>Name: {barLabels[index]} </body1><br></br>
          <body2>Count: {val}</body2>
          <hr />
        </div>
      ))} */}

      <ApexBarChartBuilder
        dataLabels={barLabels}
        dataValues={barValues}
        title={chartTitle}
        isHorizontal={isHorizontal}
        xAxisHeader={xAxisTitle}
        yAxisHeader={yAxisTitle}
        onClick={handleBarClick}
      />
    </div>
  );
};

export default ApexCountByValueBarChart;


/*
const ApexStandardBarChart = ({ targetColumn, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter } = useFilter();
  
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      return data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
    }
    return data;
  }, [filter, data]);

  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);
  const barLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const barValues = useMemo(() => Object.values(countMap), [countMap]);

  return (
    <ApexBarChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      title={chartTitle}
      isHorizontal={isHorizontal}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
      rawData={filteredData} // Pass the raw filtered data
    />
  );
};

export default ApexStandardBarChart;
*/