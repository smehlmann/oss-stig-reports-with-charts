import React, { useState, useEffect, useMemo } from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import TableBody from '@mui/material/TableBody';
import { useFilter } from '../../FilterContext';
import {getPercentageFormatterObject} from "../../components/getPercentageFormatterObject.js";

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
  const { filter, updateFilter, clearFilter} = useFilter();
  const [searchText, setSearchText] = useState("");
  const [filteredChildRows, setFilteredChildRows] = useState({}); // State to hold filtered data

  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);


  const [parentRows, setParentRows] = useState([]);
  //checks if data is array of objects. If so, groyup by 'benchmarks' property.
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
      const dataGroupedByBenchmarks = data.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.benchmarks]) {
          accumulator[currentValue.benchmarks] = [];
        }        
        accumulator[currentValue.benchmarks].push({
          asset: currentValue.asset,
          sysAdmin: formatString(currentValue.sysAdmin),
          primOwner: formatString(currentValue.primOwner),
          accepted: currentValue.accepted,
        });
        return accumulator;
      }, {});

      //parentRows display 'shortName' value, and childRows are content for each 'shortName' value
      const parentRows = Object.entries(dataGroupedByBenchmarks).map(([benchmarks, childRows]) => ({
        benchmarks,
        childRows
      }));
      setParentRows(parentRows);
      } else { console.error("Data is not array or empty: ", data)}
    }catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [data]);


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  //code responsible for creating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    const filteredChildRows = parentRow.childRows.filter(
      (childRow) => 

      //set to lowercase for searchability 
      (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.accepted.toString().includes(searchText)
      )
    );

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
              <ExpandedHeaderCell >Accepted %</ExpandedHeaderCell>
            </StyledTableRow>
          </ExpandedTableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
              <StyledTableRow key={index} className="child-row">
                <ExpandedTableCell>{childRow.asset}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.sysAdmin}</ExpandedTableCell>
                <ExpandedTableCell>{childRow.primOwner}</ExpandedTableCell>
                <ExpandedTableCell>
                  {percentageFormatterObject.formatter(childRow.accepted)}
                </ExpandedTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const columnHeaders = [
    { id: 'benchmarks', label: 'STIG Benchmarks' }
  ];


  return (
    <ExpandableTableBuilder 
      rows={parentRows} 
      columns={columnHeaders} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty="benchmarks"
      onSearchChange={handleSearchChange}
      updateFilter={updateFilter}
      clearFilter={clearFilter}
    />
  );
}

export default Report8BenchmarksExpanded;
