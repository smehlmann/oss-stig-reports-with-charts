import React, { useMemo, useState, useEffect } from "react";
import MultiLineChartBuilder from "./MultiLineChartBuilder.js";
import CalculateArrayAvg from "../../../components/CalculateArrayAvg.js";
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
      const filteredAndCleanedData = filteredData.filter(item => item.datePulled !== null && item.datePulled !== undefined);

      //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...})
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
      
      //Creates an array of key-value pairs. Calculate averages for the targetColumns in the array associated with a given groupingValue. ie. for code= [{'10:[avgAssessed, avgSubmitted...], '25':[avg1, avg2..]}, ...]
      //destructures key-value pair where groupingVal=key, dataPerGroup=value(array of items per group)
      let groupedAverages = Object.entries(dataGrouped).map(([groupingValue, dataPerGroup]) => {
        
        /*averages is single object that initially contains 'id' key to identify the grouping value--> ie. for code 15= {id:'15', code:'15'} just to ensure unique identifier and no duplicates
        columnAvgAcc= accumulator object to store avg of columnName values, columnName= current column name being processed.
        averages will contain an array of objects that contain calculated average values of targetColumns based on each groupingColumn entry
        */
        const averages = targetColumns.reduce((columnAvgAcc, columnName) => {
          //values = array that extracts values from a columnName for each entry in dataPerGroup. This is for each columnName
          const values = dataPerGroup.map((item) => item[columnName]).filter(val => val !== undefined);
          //first creates a new property and names it, then obtains average of all the values (values from columnName for each record).  
          columnAvgAcc[`avg${columnName.charAt(0).toUpperCase() + columnName.slice(1)}`] = CalculateArrayAvg(values);

          //columnAvgAcc is object where:, for each of our targetColumns, we will have something like {id: '10', 'code':10, avgAssessed:0.978, avgSubmitted:0.922...}
          return columnAvgAcc;
        }, { [groupingColumn]: groupingValue});
        //basically the return the accumulator columnAvgAcc
        return averages;
      }).filter(avg => avg !== 'undefined'  !== null);

      groupedAverages.sort((a, b) => new Date(a.datePulled) - new Date(b.datePulled));

      setAverages(groupedAverages);
      // setChartData(transformedData);
    }
  }, [targetColumns, filteredData, groupingColumn]);

    // console.log("averages: ", averages);

  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);

  //format data into series and list of dates
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
    const avgAcceptedData = averages.map(item => ({
      x: item.datePulled,
      y: item.avgAccepted || 0 
    }));
    const avgRejectedData = averages.map(item => ({
      x: item.datePulled,
      y: item.avgRejected || 0 
    }));
  
    return {
      dates,
      //return series: an array of objects 
      series: [
        { name: 'Avg Assessed', data: avgAssessedData },
        { name: 'Avg Submitted', data: avgSubmittedData },
        { name: 'Avg Accepted', data: avgAcceptedData },
        { name: 'Avg Rejected', data: avgRejectedData }
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
