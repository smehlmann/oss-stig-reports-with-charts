import React, { useMemo, useEffect, useState } from "react";
// import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
import GroupedOrStackedBarBuilder from "./GroupedOrStackedBarBuilder.js";
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";


const GroupedAveragesBar = ({ 
  groupByColumn, 
  breakdownColumns, 
  dataLabelsArePercentages,
  isHorizontal, 
  showLabelsOnBars, 
  isStackedBarChart, 
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
      const currentGroupingValue = currentItem[groupByColumn];
      //if currentGroupingValue doesn't exists as key in accumulator
      if (!accumulator[currentGroupingValue]) {
        //if not, add key to accumulator with empty array as value.
        accumulator[currentGroupingValue] = []; 
      }
      //add the currentItem to the array to associated key.
      accumulator[currentGroupingValue].push(currentItem);
      return accumulator; //returns {key1:[...], key2:[...], ...}
    }, {});

    /*
    reduce will calculate the sum of each breakdown column (from breakdownColumns) and the total checks per group
    iterate over each key-value pair (or group) in dataGroupedByBenchmarks. [groupingValue, dataPerGroup] destructures the key-value pairs of dataGroupedByBenchmarks into {groupingValue: dataPerGroup}
    */
    let groupedAverages = Object.entries(dataGroupedByBenchmarks).reduce((acc, [groupingValue, dataPerGroup ]) => {
      const productSums = {};  //will store cumulative product sums for each column in breakdownColumns
      let totalChecksPerGroup=0;

    //initializes each breakdown column's sum to 0
    breakdownColumns.forEach(column => {
      productSums[column] = 0;
    })

    //iterates over each item within a group to calculate totalChecksPerGroup and product sum for each breakdown column
    dataPerGroup.forEach(item => {
      const checksInItem = item.checks; 
      totalChecksPerGroup += checksInItem; //accumulate checks in this group
      
      //calculates cumulative product for each breakdown column within each group
      /* ie. current column is 'accepted'
        for each entry in my value array, calculate the checks[i] * assessed[i] and add it to productSums[assessed] array.  */
      breakdownColumns.forEach(column => {
        productSums[column] += checksInItem * (item[column] || 0); 
      });
    });

    //calculate averages for each breakdownColumn
    const averages = {};
    //for each breakdown column, new key is created (ie. avgAssessed) and we calculate the avg of productSums['assessed']/totalChecksPerGroup for value
    breakdownColumns.forEach(column => {
      averages[`avg${column.charAt(0).toUpperCase() + column.slice(1)}`] = productSums[column] / totalChecksPerGroup;
    }) //ie. averages={avgAssessed: (totalSums['assessed']/totalChecksPerGroup)}

    //groupingValue and averages are added to the acc
    acc.push({
      groupingColumn: groupingValue, //groupingColumn holds value of groupingValue
      ...averages, //calculated averages for breakdown columns
    });
   
    return acc; //final accumulator = groupedAverages
    }, []);
    //store as an array of objects
    setAverages(groupedAverages);

  }, [filteredData, groupByColumn, breakdownColumns]);


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

  return (
    <GroupedOrStackedBarBuilder
      dataLabels={dataLabels}
      series={seriesData}
      showLabelsOnBars={showLabelsOnBars}
      dataLabelsArePercentages={dataLabelsArePercentages}
      isHorizontal={isHorizontal}
      isStackedBarChart={isStackedBarChart}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
      onClick={handleBarClick}
      formatLabelToPercent={percentageFormatterObject}

    />
  );
}

export default GroupedAveragesBar;


/*
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
*/