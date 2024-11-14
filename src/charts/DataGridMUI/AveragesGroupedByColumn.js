
import React, { useState, useMemo,  useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useFilter } from '../../FilterContext';
import DataGridBuilder from './DataGridBuilder';
import ValueCountMap from "../../components/ValueCountMap.js";
import { getGridNumericOperators } from '@mui/x-data-grid';
import DropdownInputValue from './DropdownInputValue';
import GetFilteredData from "../../components/Filtering/GetFilteredData.js";

const renderProgressBarCell = (params) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding:'4px' }}>
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


function AveragesGroupedByColumn({ groupingColumn, data, targetColumns, source=[] }) {
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  const [ setFilterModel] = useState({
    items: [],
  });
  const [averages, setAverages] = useState([]);

  //returns the columns where we calculate averages
  const columnsToCalculateAvg = useMemo(() => {
    const filteredColumns = targetColumns.filter(currColumn =>
      currColumn === 'assessed' ||
      currColumn === 'submitted' ||
      currColumn === 'accepted' ||
      currColumn === 'rejected'
    );
    return filteredColumns;
  }, [targetColumns]);

  // gets the data when filter has been applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);



  useEffect(() => {
    if (Array.isArray(filteredData) && filteredData) {
      //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...}) 
      const aggregatedData = filteredData.reduce((accumulator, currentItem) => {
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
      
      /*large object where we have {codeValue: {assessedProdSum:_, submittedProdSum:[],...}, codeValue2:{...}, }
      groupingVal is codeVal, dataPerGroup is array of entries where key=codeValue
      acc stores the calculated sum of products for each entry within the array of entries grouped by the groupingColumn (ie. products of entries in the values array from dataGroupedByCode)
      basically [groupingValue, dataPerGroup] destructures entries of dataGroupedByCode into {groupingVal: dataPerGroup}
      */
      let groupedAverages = Object.entries(aggregatedData).reduce((acc, [groupingValue, dataPerGroup]) => {
        let productSums = []; //stores the cumulative sum of products for each targetColumn; ie. {assessed: sum( checks[i]*assessed[i] ), ...}
        let assetCount = 0;
        let checksPerGroup = 0;
        let delinquentCount = 0;
        
        //initialize each targetColumn's sum to in productSums
        targetColumns.forEach(column => {
          productSums[column] = 0;
        })


        //iterate over each item within a group to calculate totalChecksPerGroup and sum of products (productSums) for each targetColumn
        dataPerGroup.forEach(item => {
          const assetPerItem = item.asset;
          const checksInItem = item.checks;
          checksPerGroup += checksInItem;

          //get assetCounts depending on the report
          if(source === 'report7') {
            assetCount +=assetPerItem;
          } 
          else if (source === "report5") {
            const countMap = ValueCountMap(dataPerGroup, assetPerItem);
            assetCount = Object.values(countMap)[0];
          }

          /* 
          calculates cumulative product for each targetColumn within each group
          ie. for each entry in my value array, calculate the checks[i] * assessed[i] and add it to totalSums[assessed].  */
          targetColumns.forEach(targetColumn => {
            productSums[targetColumn] += checksInItem * (item[targetColumn] || 0);
          });
        });

        //calculate averages for appropriate targetColumns
        const averages = {};

        //for each targetColumn, a new key is created (ie.avgAssessed) and get value = productSums['assessed']/totalChecksPerGroup 
        targetColumns.forEach(targetColumn => {
          //if column = 'assessed', 'submitted'...
          if(columnsToCalculateAvg.includes(targetColumn)) {
            averages[`avg${targetColumn.charAt(0).toUpperCase() + targetColumn.slice(1)}`] = productSums[targetColumn] / checksPerGroup;
          } //ie. averages={avgAssessed: (totalSums['assessed']/totalChecksPerGroup)}
          else if(targetColumn === 'delinquent') {
            delinquentCount = dataPerGroup.filter(item => item['delinquent'] === 'Yes'
            ).length;
          }
        })

        //add groupingValue and averages to acc
        acc.push({
          id: groupingValue,
          [groupingColumn]: groupingValue,
          //include delinquentCount and assetCount depending on source
          ...(source==='report5'|| source ==='report7' 
            ? { assetCount } : {}
          ),
          ...(source==='report5' ? { delinquentCount } : {}),
          ...averages,
        });
        
        return acc; //final accumulator = groupedAverages
      }, []);

      setAverages(groupedAverages);
    }
  }, [filteredData, groupingColumn, source, columnsToCalculateAvg, targetColumns]);

  // handles when user clicks on row -> data filtered by selected row
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
    //conditionally insert delinquentCount and assetCount
    ...(source === 'report5' ? [
      { field: 'assetCount', 
        headerName: 'Asset Count', 
        flex: 1, type: 'number' 
      },
      {
        field: 'delinquentCount', 
        headerName: 'Delinquent Count', 
        flex: 1, 
        type: 'number' 
      },
    ] : []),
    ...(source === 'report7' ? [  
      { field: 'assetCount', 
        headerName: 'Asset Count', 
        flex: 1, type: 'number' 
      },
    ] : []),
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      type: 'number',
      renderCell: renderProgressBarCell,
      filterOperators: operatorsForFiltering,
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
      type: 'number', // Set the type to 'number' for proper filtering
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
      onFilterModelChange={setFilterModel}
    />
  );
}
export default AveragesGroupedByColumn;







// function AveragesGroupedByColumn({ groupingColumn, data, source=[] }) {
//   //useFilter contains 'filter' state and when it's updated
//   const { filter, updateFilter } = useFilter();
//   const [ setFilterModel] = useState({items: []});
//   const [averages, setAverages] = useState([]);

//   // gets the data when filter has been applied
//   const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);


//   useEffect(() => {
//     if (Array.isArray(filteredData) && filteredData) {
//       //groups the filteredData by the groupingColumn by making an object whose keys=values in grouping column, values per key=array of records belonging to that group. currentItem = current item being processed. (ie. groupingColumn = code --> {'10': [all records belonging to code 10], ...}) 
//       const dataGroupedByCode = filteredData.reduce((accumulator, currentItem) => {
//         //get groupingColumn value in our currentItem
//         const groupingValue = currentItem[groupingColumn];
//         //if groupingValue exists as key in accumulator
//         if (!accumulator[groupingValue]) {
//           //if not, add key to accumulator with empty array as value.
//           accumulator[groupingValue] = []; 
//         }
//         //add the currentItem to the array to associated key.
//         accumulator[groupingValue].push(currentItem);
//         return accumulator; //returns {key1:[...], key2:[...], ...}
//       }, {});
      
//       // console.log("grouped by code: ", dataGroupedByCode);
//       /*large object where we have {codeValue: {assessedProdSum:_, submittedProdSum:[],...}, codeValue2:{...}, }
//       groupingVal is codeVal, dataPerGroup is array of entries where key=codeValue
//       acc stores the calculated sum of products for each entry within the array of entries grouped by the groupingColumn (ie. products of entries in the values array from dataGroupedByCode)
//       basically [groupingValue, dataPerGroup] destructures entries of dataGroupedByCode into {grouingVal: dataPerGroup}
//       */
//       let groupedAverages = Object.entries(dataGroupedByCode).reduce((acc, [groupingValue, dataPerGroup]) => {
//         let assessedProductSum = 0; //contains (checks[i]*assessed[i])
//         let submittedProductSum = 0;
//         let acceptedProductSum = 0;
//         let rejectedProductSum = 0;
//         let assetCount = 0;
//         let totalChecksPerCode = 0; //will store the total checks per code
//         let delinquentCount = 0;
//         //for each entry in dataPerGroup
//         dataPerGroup.forEach(item => {
//           //accesses nested object (codeVal: entries)- and extracts product properties from said object and assigns them corresponding variables 
//           const { checks, assessed, submitted, accepted, rejected, asset} = item;

//           //sum of checks for each code
//           totalChecksPerCode +=checks;

//           //get the number of unique assets
//           if(source === 'report7') {
//             assetCount +=asset;
//           }else {
//             const countMap = ValueCountMap(dataPerGroup, asset);
//             assetCount = Object.values(countMap)[0];
//           }


//           // console.log("delinquentMap: ", delinquentMap);
//           // delinquentCount 

//           //for each entry in my value array, calculate the checks[i] * assessed[i] and push it to assessedProductSum array. 
//           assessedProductSum += (checks * (assessed || 0));
//           submittedProductSum += (checks * (submitted || 0));
//           acceptedProductSum += (checks * (accepted || 0));
//           rejectedProductSum += (checks * (rejected || 0));
//         });

//         //get count where 'delinquent' value = 'Yes'
//         delinquentCount = dataPerGroup.filter(
//           item => item['delinquent'] === 'Yes'
//         ).length;


//         //calculate the averages (ProductSum/totalChecksPerCode)
//         const avgAssessed = assessedProductSum/totalChecksPerCode;
//         const avgSubmitted = submittedProductSum/totalChecksPerCode;
//         const avgAccepted = acceptedProductSum/totalChecksPerCode;
//         const avgRejected = rejectedProductSum/totalChecksPerCode;

//         //for each grouping value, store avgs in acc under each groupingVal
//         acc[groupingValue] = {
//           id: groupingValue,
//           groupingColumn: groupingValue,
//           assetCount,
//           ...(source === 'report5' ? { delinquentCount } : {}), //conditionally include delinquentCount
//           avgAssessed,
//           avgSubmitted,
//           avgAccepted,
//           avgRejected,
//         };
//         return acc; //final accumulator = groupedAverages
//       }, {});

//       //convert groupedProducts object to array
//       const groupedAveragesArray = Object.keys(groupedAverages).map(groupingValue => {
//         return {
//           [groupingColumn]: groupingValue,
//           ...groupedAverages[groupingValue]
//         };
//       });
//       setAverages(groupedAveragesArray);
//     }
//   }, [filteredData, groupingColumn, source]);

//   // handles when user clicks on row -> data filtered by selected row
 
//   const handleRowClick = (params) => {
//     const selectedValue = params.row[groupingColumn]; 
//     updateFilter({ [groupingColumn]: selectedValue });
//   };

//   const operatorsForFiltering = getGridNumericOperators()
//   .filter(op => op.value !== 'isAnyOf')
//   .map(op => ({
//     ...op,
//     InputComponent: DropdownInputValue,
//   }));

//   //headers for columns
//   const tableColumns = [
//     { field: groupingColumn , 
//       headerName: groupingColumn.charAt(0).toUpperCase() + groupingColumn.slice(1) , 
//       flex: 1 
//     },
//     //conditionally insert delinquentCount column
//     ...(source === 'report5' ? [
//         { field: 'assetCount', 
//           headerName: 'Asset Count', 
//           flex: 1, type: 'number' 
//         },
//         {
//           field: 'delinquentCount', 
//           headerName: 'Delinquent Count', 
//           flex: 1, 
//           type: 'number' 
//         },
//     ] : []),
//     {
//       field: 'avgAssessed',
//       headerName: 'Avg of Assessed',
//       wrap: true,
//       flex: 1,
//       type: 'number',
//       renderCell: renderProgressBarCell,
//       filterOperators: operatorsForFiltering,
//     },
//     {
//       field: 'avgSubmitted',
//       headerName: 'Avg of Submitted',
//       flex: 1,
//       type: 'number',
//       filterOperators: operatorsForFiltering,

//       renderCell: renderProgressBarCell,
//     },
//     {
//       field: 'avgAccepted',
//       headerName: 'Avg of Accepted',
//       flex: 1,
//       type: 'number', // Set the type to 'number' for proper filtering
//       filterOperators: operatorsForFiltering,
//       renderCell: renderProgressBarCell,
//     },
//     {
//       field: 'avgRejected',
//       headerName: 'Avg of Rejected',
//       flex: 1,
//       type: 'number',
//       filterOperators: operatorsForFiltering,
//       renderCell: renderProgressBarCell,
//     },
//   ];

//   return (
//     <DataGridBuilder 
//       data={averages} 
//       columns={tableColumns}
//       onRowClick={handleRowClick}
//       onFilterModelChange={setFilterModel}
//     />
//   );
// }
// export default AveragesGroupedByColumn;

