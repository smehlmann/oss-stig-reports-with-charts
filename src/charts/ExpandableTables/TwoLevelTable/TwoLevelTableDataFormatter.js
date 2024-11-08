import React, { useState, useEffect, useMemo} from "react";
import TwoLevelTableRenderer from "./TwoLevelTableRenderer";
import TableBody from '@mui/material/TableBody';
import useSortableData from "../hooks/useSortableData";
import { useFilter } from '../../../FilterContext';
import {
  StyledTable,
  StyledTableRow,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedFirstLevelHeaderCell,
  ExpandedTableCell,
  StyledTableSortLabel
} from '../RenderingLogic/StyledTableComponents';
import GetFilteredData from "../../../components/Filtering/GetFilteredData";



function TwoLevelTableDataFormatter({ parentRowColumn, childRows, expandedSectionHeaders, data }) {
  const [searchText] = useState("");
  const [parentRows, setParentRows] = useState([]);
  const {filter} =  useFilter();
  
  const {sortField, sortDirection, handleSort, sortData} = useSortableData(); 

  //sort childRows
  const sortChildRows = rows => sortData(rows);
  
  // gets the data when filter has been applied
  const filteredData = useMemo(() => GetFilteredData(data, filter), [filter, data]);
  //checks if data is array of objects. If so, group by 'parentRow' property dynamically
  useEffect(() => {
    try {
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        //group all of the data by the value in the 'parentRow' variable 
        const aggregatedData = filteredData.reduce((accumulator, currentValue) => {
          if (!accumulator[currentValue[parentRowColumn]]) {
            accumulator[currentValue[parentRowColumn]] = [];
          }        
          
          //object to hold the formatted values for each child row
          const formattedChildRow = {}; 
          childRows.forEach(child => {
            //for every item in childRows, will extract the corresponding values for every object in formatted form (ie. {asset:'...', latestRev:'...', status:'...'})
            formattedChildRow[child] = currentValue[child];
          })
          //pushes formattedChildRow object into the array for a given parent row ([RHEL_7_STIG:{asset:'..', 'latestRev:'',..}, ])
          
          accumulator[currentValue[parentRowColumn]].push(formattedChildRow);
          return accumulator;
        }, {});

        //parentRows display 'benchmark' value, and childRows are content for each 'benchmarkId' value
        const parentRows = Object.entries(aggregatedData).map(([row, childRows]) => ({
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
    
    //sort the filtered rows
    const sortedChildRows = sortChildRows(filteredChildRows);
    const displayedChildRows = sortedChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
    <TwoLevelTableRenderer 
      rows={parentRows} 
      columns={columnHeaders} 
      renderChildRow={renderChildRow} 
      filterProperty={parentRowColumn}
      childRowCount={filteredChildRowsCount}
    />
  );
}

export default TwoLevelTableDataFormatter;
