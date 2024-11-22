import React, { useMemo } from "react";
import ApexBarChartBuilder from "./ApexBarChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
// import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";
import ValueCountMap from "../../../components/ValueCountMap.js";

//calculates the total of vlaues in the specified numeric field for each unique category in targetColumn
const ValueSumMap = (data, targetColumn, numericalField) => {
  return data.reduce((acc, item) => {
    const key = item[targetColumn]; //category of current item
    const value = item[numericalField]; //numerical for current item
    //if category not in accumulator, initialize it
    if (!acc[key]) {
      acc[key] = 0;
    }
    //add current item's value to the sum for this category
    acc[key] += value;
    return acc;
  }, {});
};

const TwoPropsCountByValues = ({ categoryField, metricField, isHorizontal, xAxisTitle, yAxisTitle, data, source='' }) => {
  const { filter, updateFilter } = useFilter();

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  
  //gets the sum of numbers for each item in the categoryField
  const sumMap = useMemo(
    () => ((source === 'report9' || source==='report15' )
      ? ValueCountMap(filteredData, categoryField, metricField) 
      : ValueSumMap(filteredData, categoryField, metricField)),
    [filteredData, categoryField, metricField, source]
  );

  
  //construct barLabels and barValues based on categoryField
  const {barLabels, barValues} = useMemo(() => {
    const statusOrder = ['saved', 'submitted', 'accepted'];

    if (categoryField === 'status') {
      //reorder barLabels based on statusOrder
      const barLabels = statusOrder.filter((key) => Object.keys(sumMap).includes(key));
      //align with reordering
      const barValues = barLabels.map((label) => sumMap[label]); 
      
      return {barLabels, barValues};
    } else {
      const barLabels = Object.keys(sumMap);
      const barValues = Object.values(sumMap);

      return {barLabels, barValues};
    }

  }, [categoryField, sumMap]);


  //updates the filter criteria based on user's click
  const handleBarClick = (event, chartContext, config) => {
    const categoryLabels = config.w.globals.labels || config.w.globals.categories;
    const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;

    if (selectedValue) {
      //check if the selected value is already in the filter
      if (filter[categoryField] === selectedValue) {
        //remove from the filter
        updateFilter({ [categoryField]: undefined });
      } else {
        //add to the filter
        updateFilter({ [categoryField]: selectedValue });
      }
    }
  };


  //function to render the appropriate chart based on orientation
  const renderChart = () => {
    return (
      <ApexBarChartBuilder
        dataLabels={barLabels}
        dataValues={barValues}
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


export default TwoPropsCountByValues;


