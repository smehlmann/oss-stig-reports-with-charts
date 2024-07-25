
import React, { useState, useMemo,  useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useFilter } from '../../FilterContext';
import DataGridBuilder from './DataGridBuilder';
import {getPercentageFormatterObject} from "../../components/getPercentageFormatterObject.js";
import CalculateArrayAvg from "../../components/CalculateArrayAvg.js";
import ValueCountMap from "../../components/ValueCountMap.js";

const renderProgressBarCell = (params) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
    <LinearProgress variant="determinate" value={params.value * 100} 
     color="primary"
     style={{ height: '10px', borderRadius: '5px' }}
    />
    <Typography variant="body2" align="center">
      {numeral(params.value * 100).format('0.00')}%
    </Typography>
  </div>
);

function AveragesAndCount({ groupingColumn, data, targetColumns }) {
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);


  const [averages, setAverages] = useState([]);

  //format the averages
  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);
  
  // const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    if (Array.isArray(filteredData) && filteredData) {
      //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...}) 
      const dataGrouped = filteredData.reduce((accumulator, currentItem) => {
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
      
      //Creates an array of key-value pairs. Calculate averages for the targetColumns in the array associated with a given groupingValue. ie. for code= [0:{'10:[avgAssessed, avgSubmitted...]}, 1:{'25':[avg1, avg2..]}, ...]
      //destructures key-value pair where groupingVal=key, dataPerGroup=value(array of items per group)
      const groupedAverages = Object.entries(dataGrouped).map(([groupingValue, dataPerGroup]) => {
        
        /*averages is single object that initially contains 'id' key to identify the grouping value--> ie. for code 15= {id:'15', code:'15'} just to ensure unique identifier and no duplicates
        columnAcc= accumulator object to store avg of columnName values, columnName= current column name being processed.
        averages will contain an array of objects that contain calculated average values of targetColumns based on each groupingColumn entry
        */
          const averages = targetColumns.reduce((columnAcc, columnName) => {
            //values = array that extracts values from a columnName for each entry in dataPerGroup. This is for each columnName
            const values = dataPerGroup.map((item) => item[columnName]).filter(val => val !== undefined);

              //first creates a new property and names it, then obtains average of all the values (values from columnName for each record).  
              columnAcc[`avg${columnName.charAt(0).toUpperCase() + columnName.slice(1)}`] = CalculateArrayAvg(values);
      
            //columnAcc is object where:, for each of our targetColumns, we will have something like {id: '10', 'code':10, avgAssessed:0.978, avgSubmitted:0.922...}
            return columnAcc;

          }, { id: groupingValue, [groupingColumn]: groupingValue, count: dataPerGroup.length});
      
        //basically the return the accumulator columnAvgAcc
        return averages;
      });
      setAverages(groupedAverages);
    }
  }, [targetColumns, filteredData, groupingColumn]);


  const handleRowClick = (params) => {
    const selectedValue = params.row[groupingColumn]; 
    updateFilter({ [groupingColumn]: selectedValue });
  };

  //headers for columns
  const tableColumns = [
    { field: groupingColumn , 
      headerName: groupingColumn.charAt(0).toUpperCase() + groupingColumn.slice(1) , 
      flex: 1 
    },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),

      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      flex: 1,
      type: 'number', // Set the type to 'number' for proper filtering
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
    
      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      flex: 1,
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
      // renderCell: renderProgressBarCell,
    },
    { field: 'count', headerName: 'Count', flex: 1, type: 'number' }
  ];

  return (
    <DataGridBuilder 
      data={averages} 
      columns={tableColumns}
      onRowClick={handleRowClick}

      
    />
  );
}
export default AveragesAndCount;