import React, { useState, useMemo,  useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useFilter } from '../../FilterContext';
import DataGridBuilder from './DataGridBuilder';
import ValueCountMap from "../../components/ValueCountMap.js";
import {  getGridNumericOperators } from '@mui/x-data-grid';
import DropdownInputValue from './DropdownInputValue';
import GetFilteredData from "../../components/Filtering/GetFilteredData.js";

const renderProgressBarCell = (params) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding:'8px' }}>
      <Typography variant="body2" align="center">
        {numeral(params.value * 100).format('0.00')}%
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={params.value * 100} 
        color="secondary"
        style={{ height: '10px', borderRadius: '5px', width: '100%' }}
      />
      
    </div>
  );
};


function HistoricalDataGrid({ groupingColumn, data, targetColumns }) {
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  const [setFilterModel] = useState({
    items: [],
  });
  const [averages, setAverages] = useState([]);

  const columnsToCalculateAvg = useMemo(() => {
    const filteredColumns = targetColumns.filter(currColumn =>
      currColumn === 'assessed' ||
      currColumn === 'submitted' ||
      currColumn === 'accepted' ||
      currColumn === 'rejected'
    );
    return filteredColumns;
  }, [targetColumns]);
  
  
  // gets the data when filter is applied
  const filteredData = useMemo(() => GetFilteredData(data, filter) || [], [filter, data]);

  useEffect(() => {
    const aggregatedData = filteredData.reduce((accumulator, currentItem) => {
      //get value to group by in currentItem
      const groupingValue = currentItem[groupingColumn];

      //if groupingValue is not key
      if(!accumulator[groupingValue])
      {
        //add key to accumulator with empty array as value
        accumulator[groupingValue] = [];
      }
      //otherwise, push the currentItem to the array with associated key
      accumulator[groupingValue].push(currentItem);
      return accumulator;
    }, {}); //initial state is empty object

    /*
    reduce will get sum of each targetColumn and total checks per group and stores it in an array.
    Iterate over each key-value pair (or group) in aggregatedData.
    [groupingValue: dataPerGroup] destructures each key-value pair in aggregatedData to {groupingValue: dataPerGroup}.
    */
    let groupedAverages = Object.entries(aggregatedData).reduce((acc, [groupingValue, dataPerGroup]) => {
      const productSums = []; //store cumulative sum of products for each targetColumn
      let checksPerGroup = 0;
      let assetCount = 0;
      let delinquentCount = 0;
      let latestDatePulled = new Date();

      //initializes each targetColumn's sum to 0 in productSums
      targetColumns.forEach(column => {
        productSums[column] = 0;
      }) //ie. totalSums=['assessed':0, 'submitted':0...] (?)

      //iterate over each item within a group to calculate totalChecksPerGroup and sum of products(productSums) for each targetColumn
      dataPerGroup.forEach(item => {
        const checksInItem = item.checks;
        checksPerGroup += checksInItem;

        //number of assets
        const countMap = ValueCountMap(dataPerGroup, item['asset']);
        assetCount = Object.values(countMap)[0];
        
        if(item['datePulled']) {
          latestDatePulled = item['datePulled'];
        }
        /* 
        calculates cumulative product for each targetColumn within each group
        ie. for each entry in my value array, calculate the checks[i] * assessed[i] and add it to totalSums[assessed].  */
        targetColumns.forEach(targetColumn => {
          productSums[targetColumn] += checksInItem * (item[targetColumn]|| 0);
        });
      });

      //calculate averages for each targetColumn
      const averages = {};
      //for each targetColumn, a new key is created (ie.avgAssessed) and get value = productSums['assessed']/totalChecksPerGroup 
      targetColumns.forEach( targetColumn => {
        //if column ='assessed', 'submitted', 'accepted' or 'rejected'
        if(columnsToCalculateAvg.includes(targetColumn)) {
          averages[`avg${targetColumn.charAt(0).toUpperCase() + targetColumn.slice(1)}`] = productSums[targetColumn] / checksPerGroup;
        }  //ie. averages={avgAssessed: (totalSums['assessed']/totalChecksPerGroup)}
        else if (targetColumn === 'delinquent') { 
          delinquentCount = dataPerGroup.filter(
            item => item['delinquent'] === 'Yes'
          ).length;
        }
      })

     //add groupingValue and averages to acc
      acc.push({
        id: groupingValue,
        [groupingColumn]: groupingValue,
        assetCount,
        delinquentCount,
        latestDatePulled,
        ...averages,
      });

      return acc
    }, []);

    setAverages(groupedAverages);
  }, [groupingColumn, filteredData, columnsToCalculateAvg, targetColumns]);

  const handleRowClick = (params) => {
    const selectedValue = params.row[groupingColumn]; 
    updateFilter({ [groupingColumn]: selectedValue });
  };

  //extract operator for filtering all visuals
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
    { field: 'assetCount', headerName: 'Asset Count', type: 'number' },
    { field: 'delinquentCount', headerName: 'Delinquent Count', type: 'number' },
    { field: 'latestDatePulled', headerName: 'Date Pulled', flex: 1, type: 'date' },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      type: 'number',

      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      flex: 1,
      type: 'number',
      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      flex: 1,
      type: 'number',
      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      flex: 1,
      type: 'number',
      filterOperators: operatorsForFiltering,
      renderCell: renderProgressBarCell,
    },
  ];

  return (
    <DataGridBuilder 
      data={averages} 
      columns={tableColumns}
      onRowClick={handleRowClick}
      // filterModel={filterModel}
      onFilterModelChange={setFilterModel}
    
    />
  );
}
export default HistoricalDataGrid;


  
  // useEffect(() => {
  //   if (Array.isArray(filteredData) && filteredData) {
  //     //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...}) 
  //     const dataGroupedByCode = filteredData.reduce((accumulator, currentItem) => {
  //       //get groupingColumn value in our currentItem
  //       const groupingValue = currentItem[groupingColumn];
  //       //if groupingValue not key in accumulator
  //       if (!accumulator[groupingValue]) {
  //         //add key to accumulator with empty array as value.
  //         accumulator[groupingValue] = []; 
  //       }
  //       //add the currentItem to the array to associated key.
  //       accumulator[groupingValue].push(currentItem);
  //       return accumulator; 
  //     }, {});
  //     /*groupedAverages = large object where we have {codeValue: {assessedProdSum:_, submittedProdSum:[],...}, codeValue2:{...}, }
  //     groupingVal is codeVal, dataPerGroup is array of entries where key=codeValue
  //     acc stores the calculated sum of products for each entry within the array of grouped entries (ie. products of entries in the values array from dataGroupedByCode).
  //     [groupingValue, dataPerGroup] destructures objects in  dataGroupedByCode into {groupingVal: dataPerGroup}
  //     */
  //     let groupedAverages = Object.entries(dataGroupedByCode).reduce((acc, [groupingValue, dataPerGroup]) => {
  //       let assessedProductSum = 0; //SUM(checks[i]*assessed[i])
  //       let submittedProductSum = 0; //SUM (checks[i]*submitted[i])
  //       let acceptedProductSum = 0; //SUM(checks[i]*submitted[i])
  //       let rejectedProductSum = 0; //SUM (checks[i]*rejected[i])
  //       let assetCount = 0;
  //       let totalChecksPerCode = 0; //will store the total checks per code
  //       let pullDate = new Date();
  //       let delinquentCount = 0;

  //       //for each entry in dataPerGroup
  //       dataPerGroup.forEach(item => {
  //         //accesses nested object (codeVal: entries) and extracts product properties from said object and assigns them corresponding variables 
  //         const { checks, assessed, submitted, accepted, rejected, asset, datePulled} = item;

  //         //sum of checks for each code
  //         totalChecksPerCode +=checks;

  //         //get the number of unique assets
  //         const countMap = ValueCountMap(dataPerGroup, asset);
  //         assetCount = Object.values(countMap)[0];

  //         //get latest date
  //         pullDate = datePulled;

  //         //for each entry in my entry, calculate the SUM(checks[i] * assessed[i]), SUM(checks[i]*submitted[i])...
  //         assessedProductSum += (checks * (assessed || 0));
  //         submittedProductSum += (checks * (submitted || 0));
  //         acceptedProductSum += (checks * (accepted || 0));
  //         rejectedProductSum += (checks * (rejected || 0));
  //       });
        
  //       //get count where 'delinquent' value = 'Yes'
  //       delinquentCount = dataPerGroup.filter(
  //         item => item['delinquent'] === 'Yes'
  //       ).length;

  //       //calculate the averages (ProductSum/totalChecksPerCode)
  //       const avgAssessed = assessedProductSum/totalChecksPerCode;
  //       const avgSubmitted = submittedProductSum/totalChecksPerCode;
  //       const avgAccepted = acceptedProductSum/totalChecksPerCode;
  //       const avgRejected = rejectedProductSum/totalChecksPerCode;

  //       //for each grouping value, store avgs in acc under each groupingVal
  //       acc[groupingValue] = {
  //         id: groupingValue,
  //         groupingColumn: groupingValue,
  //         pullDate,
  //         assetCount,
  //         delinquentCount,
  //         avgAssessed,
  //         avgSubmitted,
  //         avgAccepted,
  //         avgRejected,
  //       };
  //       return acc; //final accumulator = groupedAverages
  //     }, {});


  //     //convert groupedAverages object to array
  //     const groupedAveragesArray = Object.keys(groupedAverages).map(groupingValue => {
  //       return {
  //         [groupingColumn]: groupingValue,
  //         ...groupedAverages[groupingValue]
  //       };
  //     });
      
  //     setAverages(groupedAveragesArray);
  //   }
  // }, [filteredData, groupingColumn]);
