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

  //get unique values from breakdownColumn
  const getUniqueValuesInColumn= (data, breakdownColumn) => {
    return [...new Set(data.map(item => item[breakdownColumn]))]; //returns all unique values in groupByColumn
  }

  // ValueCountMap -> count the number of times a value appears in the groupByColumn grouped by breakdownColumn
  const countMap = useMemo(() => {
    const map = {}; //stores counts for each combination of groupByColumn and breakdownColumn 

    //obtain unique values in groupByColumn and breakdownColumn
    const valuesInGroupingColumn = getUniqueValuesInColumn(filteredData, groupByColumn);
    const valuesInBreakdownColumn = getUniqueValuesInColumn(filteredData,breakdownColumn )

    //initialize map for each value in groupByCOlumn with all possible breakdownColumn counts set to 0
    valuesInGroupingColumn.forEach(groupingValue => {
      map[groupingValue] = {};
      valuesInBreakdownColumn.forEach(targetValue => {
        map[groupingValue][targetValue === '' ? 'null' : targetValue] = 0; //initialize empty string as null
      })
    })

    //populate countmap based on the filteredData
    filteredData.forEach(item => {
      const groupingColumn = item[groupByColumn];
      let targetValue = item[breakdownColumn];

      //if breakdownColumn is empty string, treat as 'null'
      if (targetValue === '') {
        targetValue = 'null';
      }

      //increment count for current combo of groupingColumn and targetValue
      if(map[groupingColumn] && map[groupingColumn][targetValue] !== undefined) {
        map[groupingColumn][targetValue] +=1;
      }
    })
    return map;
  }, [filteredData, groupByColumn, breakdownColumn]);


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
              return countMap[groupingId][status] || 0; // Get the count or 0 if undefined
          }),
      };
  });
}, [countMap]);



  //updates the filter criteria based on user's clicking on one of the bars
  const handleBarClick = (event, chartContext, config) => {

    const groupingColumns = config.w.globals.labels
    const selectedGroupingColumn = groupingColumns ? groupingColumns[config.dataPointIndex] : null;
    const seriesName = config.seriesIndex !== undefined ? chartContext.w.config.series[config.seriesIndex].name : null

    if (selectedGroupingColumn && seriesName) {
      //create new filter object on selected groupByColumn and series
      const newFilter = {
        [groupByColumn]: selectedGroupingColumn,
        [breakdownColumn]: seriesName === 'null' ? '': seriesName,
      }

      //check for duplicate items in filter
      const isFilterAlreadyApplied = 
      filter[groupByColumn] === selectedGroupingColumn && 
      filter[breakdownColumn] === seriesName;

      //remove duplicate filters
      if (isFilterAlreadyApplied) {
        removeFilterKey(groupByColumn);
        removeFilterKey(breakdownColumn);
      } else {
        //update filter to include both groupByColumn and breakdown values
        updateFilter(newFilter);
      }
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
