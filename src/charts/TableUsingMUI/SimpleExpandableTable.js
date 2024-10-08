import React, { useState, useEffect, useMemo} from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import TableBody from '@mui/material/TableBody';

import { useFilter } from '../../FilterContext';
import {
  StyledTable,
  StyledTableRow,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedFirstLevelHeaderCell,
  ExpandedTableCell,
  StyledTableSortLabel
} from './StyledTableComponents';
import GetFilteredData from "../../components/Filtering/GetFilteredData";

//format sysAdmin and primOwner to remove quotation marks
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

function SimpleExpandableTable({ parentRowColumn, childRows, expandedSectionHeaders, data }) {
  const { updateFilter, clearFilter} = useFilter();
  const [searchText] = useState("");
  const [parentRows, setParentRows] = useState([]);
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
      'Benchmarks': 'benchmarks',
      'Collection': 'collection',
      'Latest Revision': 'latestRev',
      'Current Quarter STIG': 'quarterVer'
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
  //checks if data is array of objects. If so, group by 'parentRow' property dynamically
  useEffect(() => {
    try {
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        //group all of the data by the value in the 'parentRow' variable 
        const dataGroupedByBenchmarks = filteredData.reduce((accumulator, currentValue) => {
          if (!accumulator[currentValue[parentRowColumn]]) {
            accumulator[currentValue[parentRowColumn]] = [];
          }        
          
          //object to hold the formatted values for each child row
          const formattedChildRow = {}; 
          childRows.forEach(child => {
            //for every item in childRows, will extract the corresponding values for every object in formatted form (ie. {asset:'...', latestRev:'...', status:'...'})
            formattedChildRow[child] = formatString(currentValue[child]);
          })
          //pushes formattedChildRow object into the array for a given parent row ([RHEL_7_STIG:{asset:'..', 'latestRev:'',..}, ])
          
          accumulator[currentValue[parentRowColumn]].push(formattedChildRow);
          return accumulator;
        }, {});

        //parentRows display 'benchmark' value, and childRows are content for each 'benchmarkId' value
        const parentRows = Object.entries(dataGroupedByBenchmarks).map(([row, childRows]) => ({
          row,
          childRows
        }));

        setParentRows(parentRows);
        
      } else { 
        setParentRows([]);
      }
    } catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [filteredData, parentRowColumn, childRows]);

  //function to get number of childrows (needed for table pagination)
  const getFilteredChildRowsCount = (parentRowObject, searchText) => {
    return parentRowObject.childRows.filter((childRow) => {
      return childRows.some(child =>
        childRow[child]?.toLowerCase().includes(searchText.toLowerCase())
      );
    }).length;
  };
  
  
  //code responsible for creating childRows in expanded section
  // const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
  //   //filter child rows based on text in searchbar
  //   const filteredChildRows = parentRow.childRows.filter((childRow) => {
  //     return childRows.some(child =>
  //       childRow[child]?.toLowerCase().includes(searchText.toLowerCase())
  //     );
  //   });
    
  //   if (filteredChildRows.length === 0) {
  //     return null;
  //   }


  //   const displayedChildRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  //   //update state with filtered dat

  //   //displays header rows of the table in the expanded section. 
  //   return (
  //     <>
  //       <StyledChildTableContainer sx={{ margin: 1 }}>
  //         <StyledTable size="small" aria-label="child table">
  //           <ExpandedTableHead sx={{ border: 'none'}}>
  //             {expandedSectionHeaders.map((headerName, index ) => (
  //               <ExpandedFirstLevelHeaderCell key={index}> {headerName} </ExpandedFirstLevelHeaderCell>
  //             ))} 
  //           </ExpandedTableHead>
  //           <TableBody>
  //             {displayedChildRows.map((childRow, objInArrayIndex) => (
  //               //all the first-level child rows
  //               <StyledTableRow key={objInArrayIndex} className="first-level-child-row">
  //                  {childRows.map((key, keyInObjIndex) => (
  //                 <ExpandedTableCell key={keyInObjIndex}> {childRow[key]} </ExpandedTableCell>
  //               ))}
  //               </StyledTableRow>
  //             ))}
  //           </TableBody>
  //         </StyledTable>
  //       </StyledChildTableContainer>
  //     </>
  //   );
  // };

  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    //filter child rows based on text in searchbar
    const filteredChildRows = parentRow.childRows.filter((childRow) => {
      return childRows.some(child =>
        childRow[child]?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    

    if (filteredChildRows.length === 0) {
      return null;
    }
    
    // Sort the filtered rows
    const sortedChildRows = sortChildRows(filteredChildRows);
    const displayedChildRows = sortedChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



    const handleSort = (headerName) => {
      const isAsc = sortField === headerName && sortDirection === 'asc';
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortField(headerName);
    };

    //displays header rows of the table in the expanded section. 
    return (
      <>
        <StyledChildTableContainer sx={{ margin: 1 }}>
          <StyledTable size="small" aria-label="child table">
            <ExpandedTableHead sx={{ border: 'none'}}>
              {expandedSectionHeaders.map((headerName, index ) => (
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
              {displayedChildRows.map((childRow, objInArrayIndex) => (
                //all the first-level child rows
                <StyledTableRow key={objInArrayIndex} className="first-level-child-row">
                   {childRows.map((key, keyInObjIndex) => (
                  <ExpandedTableCell key={keyInObjIndex}> {childRow[key]} </ExpandedTableCell>
                ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledChildTableContainer>
      </>
    );
  };




  const columnHeaders = [
    { id: 'benchmark', label: 'STIG Benchmarks' }
  ];

  const filteredChildRowsCount = parentRows.map(parentRow => getFilteredChildRowsCount(parentRow, searchText));


  return (
    <ExpandableTableBuilder 
      rows={parentRows} 
      columns={columnHeaders} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty={parentRowColumn}
      updateFilter={updateFilter}
      clearFilter={clearFilter}
      childRowCount={filteredChildRowsCount}
    />
  );
}

export default SimpleExpandableTable;
