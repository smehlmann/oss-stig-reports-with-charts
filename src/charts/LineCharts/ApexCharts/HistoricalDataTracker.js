import React, { useMemo } from "react";
import LineChartBuilder from "./LineChartBuilder.js";
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

const HistoricalDataTracker = ({ xColumn, yColumn, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) { 
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  const sumMap = useMemo(() => ValueSumMap(filteredData, xColumn, yColumn), [filteredData, xColumn, yColumn]);
  const labels = useMemo(() => Object.keys(sumMap), [sumMap]);
  const values = useMemo(() => Object.values(sumMap), [sumMap]);

  // console.log(sumMap);
  //updates the filter criteria based on user's click
  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;

      if (selectedValue) {
      // Check if the selected value is already in the filter
      if (filter[xColumn] === selectedValue) {
        // Remove the filter
        updateFilter({ [xColumn]: undefined });
      } else {
        // Add the filter
        updateFilter({ [xColumn]: selectedValue });
      }
    }
  };


  return (
      <LineChartBuilder
        dataLabels={labels}
        dataValues={values}
        title={chartTitle}
        xAxisHeader={xAxisTitle}
        yAxisHeader={yAxisTitle}
        onClick={handleBarClick}
      />
    // </div>
  );
};

export default HistoricalDataTracker;
