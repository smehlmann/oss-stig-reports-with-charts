import React, { useMemo, useEffect } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";

const ValueSumMap = (data, targetColumn, valueColumn) => {
  return data.reduce((acc, item) => {
    const key = item[targetColumn];
    const value = item[valueColumn];

    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += value;
    return acc;
  }, {});
};

const FromTwoPropertiesBarChart = ({ labelColumn, valueColumn, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  const sumMap = useMemo(() => ValueSumMap(filteredData, labelColumn, valueColumn), [filteredData, labelColumn, valueColumn]);
  const barLabels = useMemo(() => Object.keys(sumMap), [sumMap]);
  const barValues = useMemo(() => Object.values(sumMap), [sumMap]);

  // updates the filter criteria based on user's click
  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;

    console.log('Filter updated:', filter);

    if (selectedValue) {
      // Check if the selected value is already in the filter
      if (filter[labelColumn] === selectedValue) {
        // Remove the filter
        updateFilter({ [labelColumn]: undefined });
      } else {
        // Add the filter
        updateFilter({ [labelColumn]: selectedValue });
      }
    }
  };

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


export default FromTwoPropertiesBarChart;


