import React, { useMemo } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
// import HorizontalBarChartBuilder from "./HorizontalBarChartBuilder.js";

const ApexCountByValueBarChart = ({ targetColumn, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter, removeFilterKey } = useFilter();

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  //ValueCountMap -> count the number of times a value appears in the targetColumn
  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);
  

  const barLabels = useMemo(() => Object.keys(countMap), [countMap]); //labels = array of values in targetColumn
  const barValues = useMemo(() => Object.values(countMap), [countMap]); //array of number of times a label appears

  //updates the filter criteria based on user's clicking on one of the bars
  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;
    if (selectedValue) {
      // Check if the selected value is already in the filter
      if (filter[targetColumn] === selectedValue) {
        // Remove the filter
        removeFilterKey(targetColumn);
      } else {
        // Add the filter
        updateFilter({ [targetColumn]: selectedValue });
      }
    }
  };

  //function to render the appropriate chart based on orientation
  const renderChart = () => {
    return (
      <ApexBarChartBuilder
        dataLabels={barLabels}
        dataValues={barValues}
        title={chartTitle}
        isHorizontal={isHorizontal}
        xAxisHeader={xAxisTitle}
        yAxisHeader={yAxisTitle}
        onClick={handleBarClick}
      />

    );

  };

  // Return the chart
  return <>{renderChart()}</>;
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