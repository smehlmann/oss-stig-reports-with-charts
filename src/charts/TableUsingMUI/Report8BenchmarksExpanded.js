import React, { useState, useEffect } from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import TableBody from '@mui/material/TableBody';
import { useFilter } from '../../FilterContext';

// import { useTheme } from '@mui/material/styles';
import {
  StyledTable,
  StyledTableRow,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedHeaderCell,
  ExpandedTableCell,
} from './StyledTableComponents';


//format sysAdmin and primOwner to remove quotation marks
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

function Report8BenchmarksExpanded({ data }) {
  const { updateFilter, clearFilter} = useFilter();
  const [searchText] = useState("");
  
 // const [filteredChildRows, setFilteredChildRows] = useState({}); // State to hold filtered data

  const [parentRows, setParentRows] = useState([]);

  //checks if data is array of objects. If so, group by 'benchmarkId' property.
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
      const dataGroupedByBenchmarks = data.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.benchmarkId]) {
          accumulator[currentValue.benchmarkId] = [];
        }        
        accumulator[currentValue.benchmarkId].push({
          asset: currentValue.asset,
          sysAdmin: formatString(currentValue.sysAdmin),
          primOwner: formatString(currentValue.primOwner),
          collectionName: formatString(currentValue.collectionName),
          latestRev: formatString(currentValue.latestRev),
          quarterVer: formatString(currentValue.quarterVer),
        });
        return accumulator;
      }, {});

      //parentRows display 'benchmarkId' value, and childRows are content for each 'benchmarkId' value
      const parentRows = Object.entries(dataGroupedByBenchmarks).map(([benchmarkId, childRows]) => ({
        benchmarkId,
        childRows
      }));
      setParentRows(parentRows);
      } else { console.error("Data is not array or empty: ", data)}
    }catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [data]);

  
  // //filter data for visualizations based on searchText
  // useEffect(() => {
  //   // Filter data for other visualizations based on searchText
  //   const filteredData = {}; // Data for other visualizations after filtering
  //   parentRows.forEach((parentRow) => {
  //     // Apply search text filter
  //     const filteredChildRows = parentRow.childRows.filter(
  //       (childRow) =>
  //         childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
  //         childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
  //         childRow.primOwner.toLowerCase().includes(searchText.toLowerCase())
  //     );
  //     // Add filtered data to the result
  //     filteredData[parentRow.shortName] = filteredChildRows;
  //   });

  //   // Update filters for other visualizations
  //   updateFilter({ searchText, childRows: filteredData });

  //   // Set filtered child rows for the expandable table
  //   setFilteredChildRows(filteredData);
  // }, [searchText, parentRows, updateFilter]);
  // const handleSearchChange = (event) => {
  //   setSearchText(event.target.value);
  // };



  
  //code responsible for creating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    //filter child rows based on text in searchbar
    const filteredChildRows = parentRow.childRows.filter((childRow) => {

      return (
      //set to lowercase for searchability 
      childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.collectionName.toString().includes(searchText.toLowerCase()) ||
      childRow.latestRev.toString().includes(searchText.toLowercase()) ||
      childRow.quarterVer.toString().includes(searchText.toLowercase())
      );
    });
    
    if (filteredChildRows.length === 0) {
      return null;
    }

    const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    //update state with filtered dat

    return (
      <StyledChildTableContainer sx={{ margin: 1 }}>
        <StyledTable size="small" aria-label="child table">
          <ExpandedTableHead sx={{ border: 'none'}}>
            <StyledTableRow>
              <ExpandedHeaderCell>Asset</ExpandedHeaderCell>
              <ExpandedHeaderCell >Sys Admin</ExpandedHeaderCell>
              <ExpandedHeaderCell >Primary Owner</ExpandedHeaderCell>
              <ExpandedHeaderCell >Collection</ExpandedHeaderCell>
              <ExpandedHeaderCell >Latest Revision</ExpandedHeaderCell>
              <ExpandedHeaderCell >Current Quarter Stig </ExpandedHeaderCell>
            </StyledTableRow>
          </ExpandedTableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
              <StyledTableRow key={index} className="child-row">
                <ExpandedTableCell>{childRow.asset}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.sysAdmin}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.primOwner}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.collectionName}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.latestRev}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.quarterVer}</ExpandedTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const columnHeaders = [
    { id: 'benchmarkId', label: 'STIG Benchmarks' }
  ];


  return (
    <ExpandableTableBuilder 
      rows={parentRows} 
      columns={columnHeaders} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty="benchmarkId"
      updateFilter={updateFilter}
      clearFilter={clearFilter}
    />
  );
}

export default Report8BenchmarksExpanded;
