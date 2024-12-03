import React, { useMemo, useState, useEffect } from "react";
import MultiLineChartBuilder from "./MultiLineChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";
import { getPercentageFormatterObject } from "../../../components/getPercentageFormatterObject.js";
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";

const HistoricalDataTracker = ({ groupingColumn, targetColumns, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter } = useFilter();

  // const values = data.map(item => item[groupingColumn])
  // console.log(values instanceof Date);

  //gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  const [averages, setAverages] = useState([]);

  useEffect(() => {
    if (Array.isArray(filteredData) && filteredData) {
      const filteredAndCleanedData = filteredData.filter(
        item => item.datePulled && !isNaN(new Date(item.datePulled))
      );
      const dataGrouped = filteredAndCleanedData.reduce((accumulator, currentItem) => {
        //get groupingColumn value in our currentItem
        const groupingValue = currentItem[groupingColumn];
        //if groupingValue exists as key in accumulator
        if (!accumulator[groupingValue]) {
          //if not, add key to accumulator with empty array as value.
          accumulator[groupingValue] = []; 
        }
        //add the currentItem to the array to associated key.
        accumulator[groupingValue].push(currentItem);
        return accumulator; //returns {key1:[...], key2:[...], ...}
      }, {});
      
      let groupedAverages = Object.entries(dataGrouped).reduce((acc, [groupingValue, dataPerGroup]) => {
        const productSums = {}; //sum of all products
        let totalChecksPerGroup =0;

        //initialize each targetColumn sum to 0
        targetColumns.forEach(column => {
          productSums[column] = 0;
        }); //ie. {assessed:0, submitted:0...}

        //calculate checks in each group
        dataPerGroup.forEach(item => {
          totalChecksPerGroup += item.checks || 0;

          //calculate each product and add all products in targetColumns
          targetColumns.forEach(targetColumn => {
            productSums[targetColumn] += (item.checks || 0) * (item[targetColumn] || 0);
          });
        });

        //calculate averages for each targetColumn
        const averages = {};
        targetColumns.forEach(column => {
          averages[`avg${column.charAt(0).toUpperCase() + column.slice(1)}`] = productSums[column] / totalChecksPerGroup;
        }) //ie. averages={avgAssessed: (totalSums['assessed']/totalChecksPerGroup)}

        acc.push({
          id: groupingValue,
          [groupingColumn]: groupingValue,
          ...averages,
        });

        return acc;
      }, []);

      groupedAverages.sort(
        (a, b) => new Date(a[groupingColumn]) - new Date(b[groupingColumn])
      );
    
      setAverages(groupedAverages);
      // setChartData(transformedData);
    }
  }, [targetColumns, filteredData, groupingColumn]);



  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);


  const formatChartData = (averages) => {
    //sort the dates and ensure they are of type date
    const dates = averages.map(item => new Date(item.datePulled)).sort((a, b) => a - b);
  
    //create series data for each line (represented by each avg)
    //for each item in averages, map datePulled and avg of column
    const avgAssessedData = averages.map(item => ({
      x: item.datePulled,
      y: item.avgAssessed || 0 
    }));
    const avgSubmittedData = averages.map(item => ({
      x: item.datePulled,
      y: item.avgSubmitted || 0 
    }));

  
    return {
      dates,
      //return series: an array of objects 
      series: [
        { name: 'Avg. Assessed', data: avgAssessedData },
        { name: 'Avg. Submitted', data: avgSubmittedData },

      ]
    };
  };

  const { series, dates } = useMemo(() => formatChartData(averages), [averages]);

  return (
    <div className="apex-chart" style={{ height: '100%', width: '95%', margin: "0" }}>
      {/* Render averages */}
       {/* <div sx={{ margin: '10px' }}>
        <h2>Averages</h2>
          {averages.map((avg, index) => (
            <div key={index}>
              {Object.entries(avg).map(([key, value]) => (
                <p key={key}>{key}: {value}</p>
              ))}
            </div>
          ))}
        </div>  */}

      <MultiLineChartBuilder
        xValues={dates}
        yValues={series}
        xAxisHeader = {xAxisTitle}
        yAxisHeader = {yAxisTitle}
        formatLabelToPercentage = {percentageFormatterObject}
      />
      {/* <ReactApexChart options={chartOptions} series={chartOptions.series} type="line" /> */}
    </div>
  );

};

export default HistoricalDataTracker;
