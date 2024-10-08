import React, { useState, useEffect, useMemo } from "react";
import MultiLevelTableBuilder from "./MultiLevelTableBuilder.js";
import TableBody from '@mui/material/TableBody';
// import { useFilter } from '../../../FilterContext.js';
import {useTheme} from "../../../theme.js"
// import { useTheme } from '@mui/material/styles';
import {
  StyledTable,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedFirstLevelHeaderCell,
  StyledTableSortLabel,
} from '../StyledTableComponents.js';
import NestedSecondLevelChildRow from "./NestedSecondLevelChildRow.js"
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
import { useFilter } from "../../../FilterContext.js";

//remove quotation marks around strings
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

function MultiLevelCollapsibleTable({  parentRowColumn, firstLevelChildRowHeaders, secondLevelChildRowHeaders, data}) {
  // const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [searchText] = useState("");
  const [parentRows, setParentRows] = useState([]); //parentRows = actual variable that holds state, and setParentRows=updates state variable based on action.
  const {filter} =  useFilter();

  //sorting states for headers in expanded child table
  const [sortDirection, setSortDirection] = useState('asc'); // or 'desc'
  const [sortField, setSortField] = useState(''); // field to sort by

 // Sorting function
  const sortChildRows = (rows) => {
    if (!sortField) return rows;
    // console.log("rows: ", rows);

    // console.log('sortField: ', sortField);

    const headerToPropertyMap = {
      'Asset': 'asset',
      'Primary Owner': 'primOwner',
      'System Admin' : 'sysAdmin',
      'Accepted %': 'accepted',
      'Benchmarks': 'benchmarks'
  };

    return [...rows].sort((a, b) => {
      const valueA = headerToPropertyMap[sortField] ? a[headerToPropertyMap[sortField]] : undefined;
      const valueB = headerToPropertyMap[sortField] ? b[headerToPropertyMap[sortField]] : undefined;
      
      // Handle missing values
      if (valueA === undefined && valueB === undefined) return 0; // Both are missing, considered equal
      if (valueA === undefined) return 1; // Place missing values last
      if (valueB === undefined) return -1; // Place missing values last


      // Check if values are strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Alphabetical sort for strings
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Check if values are numbers
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      // In case the values are not comparable (null, undefined, etc.)
      return 0;
    });
  };

  // gets the data when filter has been applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  //checks if data is array of objects. If so, group by 'shortName' property.
  useEffect(() => {
    try {
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        const dataGroupedByShortName = filteredData.reduce((accumulator, currentValue) => {
          //the accumulator is an object whose properties (or keys)= the values for shortName. 
          if (!accumulator[currentValue[parentRowColumn]]) { 
            accumulator[currentValue[parentRowColumn]] = [];  //each property is assigned empty array  
          }  //ie. accumulator = {'B3COI': [], 'NCCM-S':[]...}
          //populates the empty array associated with a given key
          accumulator[currentValue[parentRowColumn]].push({
            asset: currentValue.asset,
            sysAdmin: formatString(currentValue.sysAdmin),
            primOwner: formatString(currentValue.primOwner),
            accepted: currentValue.accepted,
            benchmarks: currentValue.benchmarks
          });

          //ie. accumulator:{"B3COI": [{asset: val1, sysAdmin: val2, primOwner: val3, accepted: val4}, {..}], 'NCCM'...}
          return accumulator;
        }, {});

        

        //parentRows is an array of objects where each object has 2 properties (or keys): shortName and childRows. shortName is what everything is grouped by, and the childRows are an array of objects {asset:__, sysAdmin:__, primOwner:__, accepted:__} associated with the shortName value. 
        const parentRows = Object.entries(dataGroupedByShortName).map(([shortName, childRows]) => ({
          shortName,
          childRows
        }));
      
        setParentRows(parentRows);

      } else { 
        setParentRows([]);
      }
    } catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [parentRowColumn, filteredData, filter]);



  //code responsible for creating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText) => {
    //filter child rows based on text in searchbar in expanded Section
    const childRowsFilteredByTextInput = parentRow.childRows.filter((childRow) => { //childRowsFilteredByTextInput
      //filtering specifically for accepted column
      const searchValue = searchText.toLowerCase();

      // console.log('The type for searchValue: ', typeof searchValue);
      const searchValueAsNumber = parseFloat(searchValue);

      const formattedAccepted = (childRow.accepted * 100).toFixed(2);
      const acceptedMatches = formattedAccepted.startsWith(searchValue) || childRow.accepted.toString().includes(searchValueAsNumber.toString());
      
      return (
      //set to lowercase for searchability 
      childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
      acceptedMatches
      );
    

    });
    if (childRowsFilteredByTextInput.length === 0) {
      return null;
    }

    // Sort the filtered rows
    const sortedChildRows = sortChildRows(childRowsFilteredByTextInput);
    const displayedRows = sortedChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleSort = (headerName) => {
      const isAsc = sortField === headerName && sortDirection === 'asc';
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortField(headerName);
    };
   
    return (
      <StyledChildTableContainer sx={{ margin: 1 }}>
        <StyledTable size="small" aria-label="child table">
          <ExpandedTableHead sx={{ border: 'none', backgroundColor: theme.palette.secondary.main}}>
            {/* create headers using firstLevelChildRowHeaders */}
            {firstLevelChildRowHeaders.map((headerName, index) => (
              <ExpandedFirstLevelHeaderCell key={index}>
                <StyledTableSortLabel className='first-level-child-sort'
                active={sortField === headerName}
                direction={sortField === headerName ? sortDirection : 'asc'}
                onClick={() => handleSort(headerName)}
                >  
                {headerName}
                </StyledTableSortLabel>
              </ExpandedFirstLevelHeaderCell>
            ))}
          </ExpandedTableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
                <NestedSecondLevelChildRow key={index}  childRow={childRow}  
                />
            ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const mainColumnHeader = [
    { id: 'shortName', label: 'Packages' }
  ];

  return (
    <MultiLevelTableBuilder 
      rows={parentRows} 
      columns={mainColumnHeader} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty="shortName"
    />
  );
}
export default MultiLevelCollapsibleTable;


//  //code responsible for creating childRows in expanded section
//  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
//   const filteredChildRows = parentRow.childRows.filter(
//     (childRow) => 

//     //set to lowercase for searchability 
//     (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.accepted.toString().includes(searchText)
//     )
//   );

//   if (filteredChildRows.length === 0) {
//     return null;
//   }

//   const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   //update state with filtered dat

//   return (
//     <StyledChildTableContainer sx={{ margin: 1 }}>
//       <StyledTable size="small" aria-label="child table">
//         <ExpandedTableHead sx={{ border: 'none'}}>
//           <StyledTableRow>
//             <ExpandedFirstLevelHeaderCell>Asset</ExpandedFirstLevelHeaderCell>
//             <ExpandedFirstLevelHeaderCell >Sys Admin</ExpandedFirstLevelHeaderCell>
//             <ExpandedFirstLevelHeaderCell >Primary Owner</ExpandedFirstLevelHeaderCell>
//             <ExpandedFirstLevelHeaderCell >Accepted %</ExpandedFirstLevelHeaderCell>
//           </StyledTableRow>
//         </ExpandedTableHead>
//         {/* <TableBody>
//           {displayedRows.map((childRow, index) => (
//             <StyledTableRow key={index} className="child-row">
//               <ExpandedTableCell>{childRow.asset}</ExpandedTableCell>
//               <ExpandedTableCell>{childRow.sysAdmin}</ExpandedTableCell>
//               <ExpandedTableCell>{childRow.primOwner}</ExpandedTableCell>
//               <ExpandedTableCell>
//                 {percentageFormatterObject.formatter(childRow.accepted)}
//               </ExpandedTableCell>
//             </StyledTableRow>
//           ))}
//         </TableBody> */}
//         <TableBody>
//           {displayedRows.map((childRow, index) => (
//               <NestedChildRow key={index} childRow={childRow} />
//             ))}
//         </TableBody>
//       </StyledTable>
//     </StyledChildTableContainer>
//   );
// };