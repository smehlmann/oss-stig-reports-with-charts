import React, { useMemo, useEffect, useState } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
// import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
// import HorizontalBarChartBuilder from "./HorizontalBarChartBuilder.js";
import GroupedOrStackedBarBuilder from "./GroupedOrStackedBarBuilder.js";
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";


const GroupedAveragesBar = ({ 
  groupByColumn, 
  breakdownColumns, 
  dataLabelsArePercentages,
  isHorizontal, 
  showDataLabels, 
  isStackedBarChart, 
  chartTitle, 
  xAxisTitle, 
  yAxisTitle, 
  data 
}) => {
  const { filter, updateFilter, removeFilterKey } = useFilter();

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  const [averagesPerBenchmark, setAverages] = useState([]);



  useEffect(() => {
    const dataGroupedByBenchmarks = filteredData.reduce((accumulator, currentItem) => {
      //get groupingColumn value in our currentItem
      const groupingValue = currentItem[groupByColumn];
      //if groupingValue exists as key in accumulator
      if (!accumulator[groupingValue]) {
        //if not, add key to accumulator with empty array as value.
        accumulator[groupingValue] = []; 
      }
      //add the currentItem to the array to associated key.
      accumulator[groupingValue].push(currentItem);
      return accumulator; //returns {key1:[...], key2:[...], ...}
    }, {});

    let groupedAverages = Object.entries(dataGroupedByBenchmarks).reduce((acc, [groupingValue, dataPerGroup ]) => {
      let assessedProductSum = 0; //will contain checks[i]*assessed[i]
      let submittedProductSum = 0;
      let totalChecksPerGroup = 0;

    //accesses each nested object
    dataPerGroup.forEach(item => {
      //each item contains:
      const {checks, assessed, submitted} = item;
      //increment the number of checks for each code
      totalChecksPerGroup +=checks;

      //for each entry in value array, calculate calculate the checks[i] * assessed[i] and push it to assessedProductSum array. 
      assessedProductSum +=(checks* (assessed || 0));
      submittedProductSum += (checks * (submitted || 0));
    });

    //calculate the averages
    const avgAssessed = assessedProductSum/totalChecksPerGroup;
    const avgSubmitted = submittedProductSum/totalChecksPerGroup;

    acc.push({
      groupingColumn: groupingValue,
      avgAssessed,
      avgSubmitted,
    });

    return acc; //final accumulator = groupedAverages
    }, []);

    //store as an array of objects
    setAverages(groupedAverages);

  }, [filteredData, groupByColumn]);

  const dataLabels = averagesPerBenchmark.map(entry => entry.groupingColumn);

  const seriesData = [
    {
      name: "Average Assessed",
      data: averagesPerBenchmark.map(entry => entry.avgAssessed || 0),
    },
    {
      name: "Average Submitted",
      data: averagesPerBenchmark.map(entry => entry.avgSubmitted || 0),
    },
  ];

  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;
    if (selectedValue) {
      // check if the selected value is already in the filter
      if (filter[groupByColumn] === selectedValue) {
        // Remove the filter
        removeFilterKey(groupByColumn);
      } else {
        // Add the filter
        updateFilter({ [groupByColumn]: selectedValue });
      }
    }
  };

  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);

  //function to render the appropriate chart based on orientation
  const renderChart = () => {
    if (isHorizontal) {
      return (
        <GroupedOrStackedBarBuilder
          dataLabels={dataLabels}
          series={seriesData}
          showDataLabels={showDataLabels}
          dataLabelsArePercentages={dataLabelsArePercentages}
          title={chartTitle}
          isHorizontal={isHorizontal}
          isStackedBarChart={isStackedBarChart}
          xAxisHeader={xAxisTitle}
          yAxisHeader={yAxisTitle}
          onClick={handleBarClick}
          formatLabelToPercent={percentageFormatterObject}

        />
      );
    } else {
      return (
        <ApexBarChartBuilder
          dataLabels={dataLabels}
          series={seriesData}
          dataLabelsArePercentages={dataLabelsArePercentages}
          title={chartTitle}
          showDataLabels={showDataLabels}
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

export default GroupedAveragesBar;
