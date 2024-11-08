import React, { useState, useEffect, useMemo, useCallback } from "react";
import MultiLevelTableRenderer from "./MultiLevelTableRenderer.js";
import TableBody from '@mui/material/TableBody';
// import { useFilter } from '../../../FilterContext.js';
// import {useTheme} from "../../../theme.js"
// import { useTheme } from '@mui/material/styles';
import useSortableData from "../hooks/useSortableData.js";
import {
  StyledTable,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedFirstLevelHeaderCell,
  StyledTableSortLabel,
} from '../RenderingLogic/StyledTableComponents.js';
import SecondLevelChildRenderer from "./SecondLevelChildRenderer.js"
import GetFilteredData from "../../../components/Filtering/GetFilteredData.js";
import { useFilter } from "../../../FilterContext.js";
import TwoLevelTableRenderer from "../TwoLevelTable/TwoLevelTableRenderer.js";

function MultiLevelTableDataFormatter({ parentRowColumn, firstLevelChildRows, secondLevelChildRows, firstLevelChildRowHeaders, secondLevelChildRowHeaders, data}) {
  // const theme = useTheme();
  const [searchText] = useState("");
  const [parentRows, setParentRows] = useState([]); //parentRows = actual variable that holds state, and setParentRows=updates state variable based on action.

  //store and dynamically update count of filtered childRows
  const [filteredChildRowsCount, setFilteredChildRowsCount] = useState();
  
  const {filter} =  useFilter();
  const {sortField, sortDirection, handleSort, sortData} = useSortableData();

  const sortChildRows = rows => sortData(rows);

  // gets the data when filter has been applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);

  // checks if data is array of objects. If so, group by 'shortName' property.
  useEffect(() => {
    try {
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        const aggregatedData = filteredData.reduce((accumulator, currentValue) => {

          const allChildRows = firstLevelChildRows.concat(secondLevelChildRows);
          const groupKey = currentValue[parentRowColumn]; //what the childRows are grouped by parentRowColumn

          //the accumulator is an object whose properties (or keys) = the values for . 
          if (!accumulator[groupKey]) { 
            accumulator[groupKey] = [];  //each property is assigned empty array  
          }  //ie. accumulator = {'B3COI': [], 'NCCM-S':[]...}


          //extact the the value
          const entry = {};
          allChildRows.forEach(key => {
            entry[key] = currentValue[key];
          });
          
          //populates the empty array associated with a given key
          accumulator[groupKey].push(entry);

          //ie. accumulator:{"B3COI": [{asset: val1, sysAdmin: val2, primOwner: val3, accepted: val4}, {..}], 'NCCM'...}
          return accumulator;
        }, {});
        
        //parentRows is an array of objects where each object has 2 properties (or keys): shortName and childRows. row is what everything is grouped by, and the childRows are an array of objects {asset:__, sysAdmin:__, primOwner:__, accepted:__} associated with the 'row' value. 
        const parentRows = Object.entries(aggregatedData).map(([row, childRows]) => ({
          [parentRowColumn]: row,
          childRows
        }));
        setParentRows(parentRows);

      } else { 
        setParentRows([]);
      }
    } catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [parentRowColumn, filteredData, firstLevelChildRows, secondLevelChildRows, filter]);

  //determines which columns are averages
  const averageColumns = useMemo(() => {
    const filteredColumns = firstLevelChildRows.filter(currColumn =>
      currColumn === 'assessed' ||
      currColumn === 'submitted' ||
      currColumn === 'accepted' ||
      currColumn === 'rejected'
    );
    return filteredColumns;
  }, [firstLevelChildRows]);
    
  //checks if any text in searchbar matches values
  const checkForMatchFromSearchBar = useCallback((childRow, searchText) => {
    if (searchText === undefined) {
      //treat as empty string (user did not enter text in searchbar)
      return true;
    }
    const searchValue = searchText.toLowerCase();
    const searchValueAsNumber = parseFloat(searchText);

    //initialize flag for matchFound
    let matchFound = false; // if match not found, return false

    //iterate over keys in childRow
    for (const key in childRow) {
      if(childRow.hasOwnProperty(key)) {
        const value = childRow[key]; //current value for a given key

        //check if the key is 'assessed', 'submitted', 'accepted' or 'rejected' columns
        if (averageColumns.includes(key)) {
          //if so, format the value properly in search bar
          const formattedValue = (value * 100).toFixed(2);
          if (formattedValue.startsWith(searchValue) || value.toString().includes(searchValueAsNumber.toString())) {
              matchFound = true;
              break; //exit loop if a match is found
          }
        } else {
          //standared string comparison 
          if (typeof value === 'string' && value.toLowerCase().includes(searchValue)) {
            matchFound = true;
            break;
          }
        }
      }
    }
    return matchFound;
  }, [ averageColumns]);


  //code responsible for creating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText) => {
    //filter child rows based on text in searchbar in expanded Section
    const childRowsFilteredByTextInput = parentRow['childRows'].filter((childRow) => {
      //go through all the columns in firstLevelChildRows and checks if they contain searchText
      return checkForMatchFromSearchBar(childRow, searchText);
    });  

    //sets updated number of childRows based on updated searchText
    setFilteredChildRowsCount(childRowsFilteredByTextInput.length);
    
    //sorts childRows
    const sortedChildRows = sortChildRows(childRowsFilteredByTextInput);

    if (sortedChildRows.length === 0) {
      return null;
    }

    //sort the filtered rows
    const displayedRows = sortedChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
   
    return (
      <StyledChildTableContainer sx={{ margin: 1 }}>
        <StyledTable size="small" aria-label="child table">
          <ExpandedTableHead sx={{ border: 'none'}}>
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
              <SecondLevelChildRenderer
                key={index} 
                firstLevelChildRows={firstLevelChildRows}
                secondLevelChildRowHeaders ={secondLevelChildRowHeaders}
                secondLevelChildRows={secondLevelChildRows}
                childRow={childRow}  
              />
            ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const mainColumnHeader = [
    { id: [parentRowColumn], label: 'Packages' }
  ];

  return (
    <TwoLevelTableRenderer 
      rows={parentRows} 
      columns={mainColumnHeader} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      childRowCount = {filteredChildRowsCount}
      filterProperty={parentRowColumn}
    />
  );
}
export default MultiLevelTableDataFormatter;

