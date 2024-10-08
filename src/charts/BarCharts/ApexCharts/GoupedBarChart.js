import React, { useMemo } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
import HorizontalBarChartBuilder from "./HorizontalBarChartBuilder.js";
import GroupedChartBuilder from "./GroupedChartBuilder.js";


const GroupedBarChart = ({ targetColumn, columnDataIsGroupedBy, isHorizontal, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter, removeFilterKey } = useFilter();

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  // ValueCountMap -> count the number of times a value appears in the targetColumn grouped by columnDataIsGroupedBy
  const countMap = useMemo(() => {
    const map = {};
    filteredData.forEach(item => {
      const targetValue = item[targetColumn];
      const statusValue = item[columnDataIsGroupedBy];

      if (!map[targetValue]) {
        map[targetValue] = { saved: 0, submitted: 0, null: 0 };
      }

      if (statusValue === "saved") {
        map[targetValue].saved += 1;
      } else if (statusValue === "submitted") {
        map[targetValue].submitted += 1;
      } else {
        map[targetValue].null += 1;
      }
    });
    return map;
  }, [filteredData, targetColumn, columnDataIsGroupedBy]);

  const barLabels = Object.keys(countMap); // Labels = array of values in targetColumn
  const seriesData = [
    {
      name: "Saved",
      data: barLabels.map(label => countMap[label]?.saved || 0)
    },
    {
      name: "Submitted",
      data: barLabels.map(label => countMap[label]?.submitted || 0)
    },
    {
      name: "Null",
      data: barLabels.map(label => countMap[label]?.null || 0)
    }
  ];
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
    if (isHorizontal) {
      return (
        <GroupedChartBuilder
          dataLabels={barLabels}
          series={seriesData}
          title={chartTitle}
          isHorizontal={isHorizontal}
          xAxisHeader={xAxisTitle}
          yAxisHeader={yAxisTitle}
          onClick={handleBarClick}
        />
      );
    } else {
      return (
      //   <div>
      //   {barValues.map((val, index) => (
      //   <div key={index}>
      //     <body1>Name: {barLabels[index]} </body1><br></br>
      //     <body2>Count: {val}</body2>
      //     <hr />
      //   </div>
      // ))} 
        <ApexBarChartBuilder
          dataLabels={barLabels}
          series={seriesData}
          title={chartTitle}
          isHorizontal={isHorizontal}
          xAxisHeader={xAxisTitle}
          yAxisHeader={yAxisTitle}
          onClick={handleBarClick}
        />
        // </div>
      );
    }
  };

  // Return the chart
  return <>{renderChart()}</>;
};

export default GroupedBarChart;
