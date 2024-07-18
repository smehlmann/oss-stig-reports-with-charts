import React, { useMemo, useState, useEffect } from "react";
import LineChartBuilder from "./LineChartBuilder.js";
import CalculateArrayAvg from "../../../components/CalculateArrayAvg.js";
import { useFilter } from "../../../FilterContext.js";
import { parseISO } from 'date-fns';
import Chart from 'react-apexcharts';


const HistoricalDataTracker = ({ groupingColumn, targetColumns, chartTitle, xAxisTitle, yAxisTitle, data }) => {
  const { filter, updateFilter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) { 
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  const [averages, setAverages] = useState([]);

  const [chartData, setChartData] = useState([]);

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
        }, { [groupingColumn]: groupingValue });
        //basically the return the accumulator columnAvgAcc
        return averages;
      }).filter(avg => avg !== 'undefined'  !== null);

      setAverages(groupedAverages);
      
      // Transforming data for the chart
      const transformedData = filteredData
      .filter(item => item.datePulled !== null && item.datePulled !== undefined) // Filter out null datePulled
      .sort((a, b) => new Date(a.datePulled) - new Date(b.datePulled))
      .map(item => ({
        datePulled: item.datePulled,
        avgAssessed: item.avgAssessed !== undefined ? item.avgAssessed : null,
        avgSubmitted: item.avgSubmitted !== undefined ? item.avgSubmitted : null,
        avgAccepted: item.avgAccepted !== undefined ? item.avgAccepted : null,
        avgRejected: item.avgRejected !== undefined ? item.avgRejected : null
      }));
        
      setChartData(transformedData);
    }
  }, [targetColumns, filteredData, groupingColumn]);


  console.log("averages: ", averages);
  

  const chartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    title: {
      text: 'Average Metrics Over Time',
      align: 'left'
    },
    xaxis: {
      type: 'datetime',
      categories: chartData && chartData.map(item => item.datePulled), 
      labels: {
        format: 'yyyy-MM-dd'
      }
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    series: [
      {
        name: 'Avg Assessed',
        categories: chartData && chartData.map(item => item.datePulled), 
      },
      {
        name: 'Avg Submitted',
        data: chartData.map(item => item.avgSubmitted)
      },
      {
        name: 'Avg Accepted',
        data: chartData.map(item => item.avgAccepted)
      },
      {
        name: 'Avg Rejected',
        data: chartData.map(item => item.avgRejected)
      }
    ]
  };

  return (
    <div>
      {/* Render averages */}
      {/* <div>
        <h2>Averages</h2>
        {averages.map((avg, index) => (
          <div key={index}>
            {Object.entries(avg).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </div>
        ))}
      </div> */}

      {/* Render line chart */}
      <Chart options={chartOptions} series={chartOptions.series} type="line" height={350} />
    </div>
  );
  
  // //updates the filter criteria based on user's click
  // const handleBarClick = (event, chartContext, config) => {
  //   const categoryLabels = config.w.globals.labels || config.w.globals.categories;
  //   const selectedValue = categoryLabels ? categoryLabels[config.dataPointIndex] : null;

  //     if (selectedValue) {
  //     // Check if the selected value is already in the filter
  //     if (filter[xColumn] === selectedValue) {
  //       // Remove the filter
  //       updateFilter({ [xColumn]: undefined });
  //     } else {
  //       // Add the filter
  //       updateFilter({ [xColumn]: selectedValue });
  //     }
  //   }
  // };


  // return (
  //     <LineChartBuilder
  //       dataLabels={labels}
  //       dataValues={values}
  //       title={chartTitle}
  //       xAxisHeader={xAxisTitle}
  //       yAxisHeader={yAxisTitle}
  //       // onClick={handleBarClick}
  //     />
  //   // </div>
  // );
};

export default HistoricalDataTracker;
