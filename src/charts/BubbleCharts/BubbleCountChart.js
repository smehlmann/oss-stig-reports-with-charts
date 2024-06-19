import React, { useMemo } from "react";
import BubbleChartBuilder from "./BubbleChartBuilder.js";
import ValueCountMap from "../ValueCountMap.js";
import { useFilter } from "../../FilterContext.js";

const BubbleCountChart = ({ targetColumn, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  const countMap = useMemo(() => ValueCountMap(filteredData, targetColumn), [filteredData, targetColumn]);
  const barLabels = useMemo(() => Object.keys(countMap), [countMap]);
  const barValues = useMemo(() => Object.values(countMap), [countMap]);

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
    <BubbleChartBuilder
      dataLabels={barLabels}
      dataValues={barValues}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
      onClick={handleBarClick}
    />
  );
};

export default BubbleCountChart;

