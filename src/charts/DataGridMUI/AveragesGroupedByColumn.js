
import React, { useState, useMemo,  useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useFilter } from '../../FilterContext';
import DataGridBuilder from './DataGridBuilder';
import ValueCountMap from "../../components/ValueCountMap.js";
import { getGridNumericOperators } from '@mui/x-data-grid';
import DropdownInputValue from './DropdownInputValue';
import GetFilteredData from "../../components/GetFilteredData.js";

const renderProgressBarCell = (params) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding:'8px' }}>
      <Typography variant="body2" align="center">
        {numeral(params.value * 100).format('0.00')}%
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={params.value * 100} 
        color="primary"
        style={{ height: '10px', borderRadius: '5px', width: '100%' }}
      />
      
    </div>
  );
};

function AveragesGroupedByColumn({ groupingColumn, data, targetColumns }) {
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [averages, setAverages] = useState([]);

  //gets the data when filter has been applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  //stores the data filter has been applie
  // const filteredData = useMemo(() => {
  //   console.log('Filtering data with filter:', filter);
  //   if (!filter || typeof filter !== 'object') {
  //     console.log('No valid filter; returning unfiltered data.');
  //     return data;
  //   }
  //   const result = data.filter(item => {
  //     return Object.keys(filter).every(key => item[key] === filter[key]);
  //   });
  //   console.log('Filtered data:', result);
  //   return result;
  // }, [data, filter]);


  useEffect(() => {
    if (Array.isArray(filteredData) && filteredData) {
      //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...}) 
      const dataGroupedByCode = filteredData.reduce((accumulator, currentItem) => {
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
      
      // console.log("grouped by code: ", dataGroupedByCode);
      /*large object where we have {codeValue: {assessedProdSum:_, submittedProdSum:[],...}, codeValue2:{...}, }
      groupingVal is codeVal, dataPerGroup is array of entries where key=codeValue
      acc stores the calculated sum of products for each entry within the array of entries grouped by the groupingColumn (ie. products of entries in the values array from dataGroupedByCode)
      basically [groupingValue, dataPerGroup] destructures entries of dataGroupedByCode into {grouingVal: dataPerGroup}
      */
      let groupedAverages = Object.entries(dataGroupedByCode).reduce((acc, [groupingValue, dataPerGroup]) => {
        let assessedProductSum = 0; //contains (checks[i]*assessed[i])
        let submittedProductSum = 0;
        let acceptedProductSum = 0;
        let rejectedProductSum = 0;
        let assetCount = 0;
        let totalChecksPerCode = 0; //will store the total checks per code

        //for each entry in dataPerGroup
        dataPerGroup.forEach(item => {
          //accesses nested object (codeVal: entries)- and extracts product properties from said object and assigns them corresponding variables 
          const { checks, assessed, submitted, accepted, rejected, asset} = item;

          //sum of checks for each code
          totalChecksPerCode +=checks;

          //get the number of unique assets
          const countMap = ValueCountMap(dataPerGroup, asset);
          assetCount = Object.values(countMap)[0];

          //for each entry in my value array, calculate the checks[i] * assessed[i] and push it to assessedProducts array. 
          assessedProductSum += (checks * (assessed || 0));
          submittedProductSum += (checks * (submitted || 0));
          acceptedProductSum += (checks * (accepted || 0));
          rejectedProductSum += (checks * (rejected || 0));
        });

        //calculate the averages (ProductSum/totalChecksPerCode)
        const avgAssessed = assessedProductSum/totalChecksPerCode;
        const avgSubmitted = submittedProductSum/totalChecksPerCode;
        const avgAccepted = acceptedProductSum/totalChecksPerCode;
        const avgRejected = rejectedProductSum/totalChecksPerCode;


        //for each grouping value, store avgs in acc under each groupingVal
        acc[groupingValue] = {
          id: groupingValue,
          groupingColumn: groupingValue,
          assetCount,
          avgAssessed,
          avgSubmitted,
          avgAccepted,
          avgRejected,
        };
        return acc; //final accumulator = groupedAverages
      }, {});

      //convert groupedProducts object to array
      const groupedAveragesArray = Object.keys(groupedAverages).map(groupingValue => {
        return {
          [groupingColumn]: groupingValue,
          ...groupedAverages[groupingValue]
        };
      });
      
      setAverages(groupedAveragesArray);
    }
  }, [filteredData, groupingColumn]);

  const handleRowClick = (params) => {
    const selectedValue = params.row[groupingColumn]; 
    updateFilter({ [groupingColumn]: selectedValue });
  };

  const operatorsForFiltering = getGridNumericOperators()
  .filter(op => op.value !== 'isAnyOf')
  .map(op => ({
    ...op,
    InputComponent: DropdownInputValue,
  }));
  //headers for columns
  const tableColumns = [
    { field: groupingColumn , 
      headerName: groupingColumn.charAt(0).toUpperCase() + groupingColumn.slice(1) , 
      flex: 1 
    },
    { field: 'assetCount', headerName: 'Asset Count', flex: 1, type: 'number' },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      type: 'number',
      // renderCell: (params) => (
      //   <div>
      //     {numeral(params.value * 100).format('0.00')}%
      //   </div>
      // ),
      renderCell: renderProgressBarCell,
      filterOperators: operatorsForFiltering,
      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      flex: 1,
      type: 'number',
      // renderCell: (params) => (
      //   <div>
      //     {numeral(params.value * 100).format('0.00')}%
      //   </div>
      // ),
      filterOperators: operatorsForFiltering,

      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      flex: 1,
      type: 'number', // Set the type to 'number' for proper filtering
      // renderCell: (params) => (
      //   <div>
      //     {numeral(params.value * 100).format('0.00')}%
      //   </div>
      // ),
      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      flex: 1,
      type: 'number',
      // renderCell: (params) => (
      //   <div>
      //     {numeral(params.value * 100).format('0.00')}%
      //   </div>
      // ),
      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
  ];

  return (
    <DataGridBuilder 
      data={averages} 
      columns={tableColumns}
      onRowClick={handleRowClick}
      onFilterModelChange={setFilterModel}
    

      
    />
  );
}
export default AveragesGroupedByColumn;



/*
OLD useEffect
  const targetColumnsToBeAveraged = useMemo(() => {
    const filteredColumns = targetColumns.filter(currColumn =>
      currColumn === 'assessed' ||
      currColumn === 'submitted' ||
      currColumn === 'accepted' ||
      currColumn === 'rejected'
    );
    return filteredColumns;
  }, [targetColumns]);


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
        
        // averages is single object that initially contains 'id' key to identify the grouping value--> ie. for code 15= {id:'15', code:'15'} just to ensure unique identifier and no duplicates
        // columnAcc= accumulator object to store avg of columnName values, columnName= current column name being processed.
        // averages will contain an array of objects that contain calculated average values of targetColumns based on each groupingColumn entry
      
        const averages = targetColumns.reduce((columnAcc, columnName) => {
          //values = array that extracts values from a columnName for each entry in dataPerGroup. This is for each columnName
          const values = dataPerGroup.map((item) => item[columnName]).filter(val => val !== undefined);

          if(targetColumnsToBeAveraged.includes(columnName)) {
            //first creates a new property and names it, then obtains average of all the values (values from columnName for each record).  
            columnAcc[`avg${columnName.charAt(0).toUpperCase() + columnName.slice(1)}`] = CalculateArrayAvg(values);
          }
          else {
            const countMap = ValueCountMap(values, columnName);
            const countValue = Object.values(countMap)[0];
            columnAcc[`${columnName}Count`] = countValue;
          }
          //columnAcc is object where:, for each of our targetColumns, we will have something like {id: '10', 'code':10, avgAssessed:0.978, avgSubmitted:0.922...}
          return columnAcc;

        }, { id: groupingValue, [groupingColumn]: groupingValue});
        
        //basically the return the accumulator columnAvgAcc
        return averages;
      });
      setAverages(groupedAverages);
    }
  }, [targetColumns, targetColumnsToBeAveraged, filteredData, groupingColumn]);
*/

