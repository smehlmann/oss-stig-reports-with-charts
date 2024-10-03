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


    const displayedChildRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    //update state with filtered dat

    return (
      <>
        <StyledChildTableContainer sx={{ margin: 1 }}>
          <StyledTable size="small" aria-label="child table">
            <ExpandedTableHead sx={{ border: 'none'}}>
              {expandedSectionHeaders.map((headerName, index ) => (
                <ExpandedFirstLevelHeaderCell key={index}> {headerName} </ExpandedFirstLevelHeaderCell>
              ))} 
            </ExpandedTableHead>
            <TableBody>
              {displayedChildRows.map((childRow, objInArrayIndex) => (
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
