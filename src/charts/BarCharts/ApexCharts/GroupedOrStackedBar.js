// import React, { useMemo } from "react";

import React, { useMemo, useEffect} from "react";
// import ValueCountMap from "../../../components/ValueCountMap.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
import GroupedOrStackedBarBuilder from "./GroupedOrStackedBarBuilder.js";
// import ValueCountMap from "../../../components/ValueCountMap.js";


const GroupedOrStackedBar = ({ groupByColumn, breakdownColumn, isHorizontal, isStackedBarChart, xAxisTitle, yAxisTitle, data }) => {
  
  const { filter, updateFilter, removeFilterKey } = useFilter();

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter, "report8"), [filter, data]);

  //get unique values from column
  const getUniqueValuesInColumn= (data, selectedColumn) => {
    return [...new Set(data.map(item => item[selectedColumn]))]; 
  }

  const countMap = useMemo(() => {
    const valuesInBreakdownColumn = getUniqueValuesInColumn(filteredData,breakdownColumn )

    //group the data based on values in groupByColumn
    const aggregatedData = filteredData.reduce((accumulator, currentItem) => {
      //current item's value for shortname
      const groupingValue = currentItem[groupByColumn]; 
      const seriesValue = currentItem[breakdownColumn]; //currentItem's code val

      //if groupingValue exists as key in accumulator
      if (!accumulator[groupingValue]) {
        //if not, add key to accumulator with empty array as value.
        valuesInBreakdownColumn.forEach(breakdownVal => {
          accumulator[groupingValue] = {};
        })
      }
      if(!accumulator[groupingValue][seriesValue]){
        accumulator[groupingValue][seriesValue] = 0;
      }
      accumulator[groupingValue][seriesValue] += 1;

      return accumulator; //returns {key1:[...], key2:[...], ...}
    }, {});
    return aggregatedData;

  }, [filteredData, breakdownColumn, groupByColumn]);
  
  useEffect(() => {
    // console.log('tempFilter: ', tempFilter);
    // console.log('map: ', countMap);

  }, [countMap, filter]); 

  const barLabels = Object.keys(countMap); //labels = array of values in groupByColumn

//transform countMap to the required series format for the chart
 const updatedSeries = useMemo(() => {
  //extract unique statuses (keys) from the first entry in countMap
  const uniqueStatuses = new Set();
  Object.values(countMap).forEach(entry => {
      Object.keys(entry).forEach(status => {
          uniqueStatuses.add(status);
      });
  });

  //convert the Set to an array
  const statusesArray = Array.from(uniqueStatuses);

  //make the series data
  return statusesArray.map(status => {
      return {
          name: status,
          data: Object.keys(countMap).map(groupingId => {
              return countMap[groupingId][status] || 0; // get the count or 0 if undefined
          }),
      };
  });
}, [countMap]);



  //updates the filter criteria based on user's clicking on one of the bars
  const handleBarClick = (event, chartContext, config) => {

    const groupingColumns = config.w.globals.labels //values in groupByColumn (bars)
    const selectedGroupingColumn = groupingColumns ? groupingColumns[config.dataPointIndex] : null;
    const seriesName = config.seriesIndex !== undefined ? chartContext.w.config.series[config.seriesIndex].name : null

    //if user selects segement in bar, create new filter
    if (selectedGroupingColumn && seriesName) {
      //create new filter object on selected groupByColumn and series
      const newFilter = {
        [groupByColumn]: selectedGroupingColumn,
        [breakdownColumn]: seriesName === 'null' ? '': seriesName,
      }

      updateFilter(newFilter, 'stackedOrGroupedBarChart');
    }
  };

  return (
    <GroupedOrStackedBarBuilder
      dataLabels={barLabels}
      series={updatedSeries}
      isHorizontal={isHorizontal}
      isStackedBarChart={isStackedBarChart}
      xAxisHeader={xAxisTitle}
      yAxisHeader={yAxisTitle}
      onClick={handleBarClick}
      tooltipLabelPrefix ={breakdownColumn}
    />
  );
};

export default GroupedOrStackedBar;




  // const countMap = useMemo(() => {
  //   const valuesInBreakdownColumn = getUniqueValuesInColumn(filteredData,breakdownColumn )

  //   //group the data based on values in groupByColumn
  //   const aggregatedData = filteredData.reduce((accumulator, currentItem) => {
  //     const groupingValue = currentItem[groupByColumn];
  //     //if groupingValue exists as key in accumulator
  //     if (!accumulator[groupingValue]) {
  //       //if not, add key to accumulator with empty array as value.
  //       accumulator[groupingValue] = []; 
  //     }
  //     accumulator[groupingValue].push(currentItem);
  //     return accumulator; //returns {key1:[...], key2:[...], ...}
  //   }, {});
    
  //   let countMap= Object.entries(aggregatedData).reduce((acc, [groupingValue, dataPerGroup ]) => {
  //     const valueCount = {};  //stores the value per key in the dataPerGroup { ASI: {codeVal:valueCount}, ...}

  //     //initializes each breakdown column's sum to 0
  //     valuesInBreakdownColumn.forEach(column => {
  //       valueCount[column] = 0;
  //     })

  //     //get the counts for each value in breakdown column
  //     dataPerGroup.forEach(item => {
  //       const breakdownVal = item[breakdownColumn] || 'null';
  //       valueCount[breakdownVal] += 1;
  //     });

  //     acc[groupingValue] = {
  //       ...valueCount
  //     };
  //     return acc; 
  //   }, {});

  //   return countMap;
  // }, [filteredData, breakdownColumn, groupByColumn]);