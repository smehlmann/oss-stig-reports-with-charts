import React, { useState, useEffect, useMemo } from "react";
import MultiLevelTableBuilder from "./MultiLevelTableBuilder.js";
import TableBody from '@mui/material/TableBody';
import { useFilter } from '../../FilterContext.js';
import {getPercentageFormatterObject} from "../../components/getPercentageFormatterObject.js";
import TablePagination from '@mui/material/TablePagination';
import {useTheme} from "../../theme.js"
// import { useTheme } from '@mui/material/styles';
import {
  StyledTable,
  StyledTableRow,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedHeaderCell,
  ExpandedTableCell,
  ExpandedContentCell,
  ExpandedFirstLevelHeaderCell,
  Expanded2ndLevelHeaderCell,
  // ExpandedFirstLevelCell,
  // ExpandedFirstLevelRow
} from './StyledTableComponents.js';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

//format sysAdmin and primOwner to remove quotation marks
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

//handles rendering for 2nd-level child row
function NestedSecondLevelChildRow({ childRow }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);
  
  //handles pagination and page switching
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleToggleOpen = () => {
    setOpen(!open);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBenchmarks = childRow.benchmarks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <StyledTableRow className="first-level-child-row">
        <ExpandedTableCell>
          <IconButton onClick={handleToggleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {childRow.asset}
        </ExpandedTableCell>
        <ExpandedTableCell>{childRow.sysAdmin}</ExpandedTableCell>
        <ExpandedTableCell>{childRow.primOwner}</ExpandedTableCell>
        <ExpandedTableCell>
          {percentageFormatterObject.formatter(childRow.accepted)}
        </ExpandedTableCell>
      </StyledTableRow>

      {open && childRow.benchmarks && (
        <StyledTableRow className='second-level-child-row'>
          <ExpandedContentCell colSpan={4} sx={{ backgroundColor: '#EAEAEA' }}> 
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0.5 }}>
                <StyledChildTableContainer>
                  <StyledTable size="small" aria-label="benchmarks table">
                    <ExpandedTableHead sx={{ backgroundColor: theme.palette.secondary.dark}}>
                      <StyledTableRow>
                        <Expanded2ndLevelHeaderCell>Benchmarks</Expanded2ndLevelHeaderCell>
                      </StyledTableRow>
                    </ExpandedTableHead>
                    <TableBody>
                      {filteredBenchmarks.map((benchmark, index) => (
                        <StyledTableRow key={index}>
                          <ExpandedTableCell>{benchmark}</ExpandedTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={childRow.benchmarks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </StyledChildTableContainer>
              </Box>
            </Collapse>
          </ExpandedContentCell>
        </StyledTableRow>
      )}
    </>
  );
}

function Report5WithMultiLevelBenchmarks({ data }) {
  const theme = useTheme();
  const { updateFilter, clearFilter} = useFilter();
  const [searchText, setSearchText] = useState("");
  // const [filteredChildRows, setFilteredChildRows] = useState({}); // State to hold filtered data

  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);

  const [parentRows, setParentRows] = useState([]); //parentRows = actual variable that holds state, and setParentRows=updates state variable based on action.

  //checks if data is array of objects. If so, group by 'shortName' property.
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
      const dataGroupedByShortName = data.reduce((accumulator, currentValue) => {
        //the accumulator is an object whose properties (or keys) the values for shorName
        if (!accumulator[currentValue.shortName]) {
          accumulator[currentValue.shortName] = [];  //each property is assigned empty array  
        }  //ie. accumulator = {'B3COI': [], 'NCCM':[]...}
        //populates the empty array associated with a given key
        accumulator[currentValue.shortName].push({
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

    //update state with filtered data

    return (
      <StyledChildTableContainer sx={{ margin: 1 }}>
        <StyledTable size="small" aria-label="child table">
          <ExpandedTableHead sx={{ border: 'none', backgroundColor: theme.palette.secondary.main}}>
             
            <ExpandedFirstLevelHeaderCell>Asset</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Sys Admin</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Primary Owner</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Accepted %</ExpandedFirstLevelHeaderCell>
          </ExpandedTableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
                <NestedSecondLevelChildRow key={index} childRow={childRow} />
              ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const columnHeaders = [
    { id: 'shortName', label: 'Packages' }
  ];



  return (
    <MultiLevelTableBuilder 
      rows={parentRows} 
      columns={columnHeaders} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty="shortName"
      onSearchChange={handleSearchChange}
      updateFilter={updateFilter}
      clearFilter={clearFilter}
    />
  );
}

export default Report5WithMultiLevelBenchmarks;


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
//             <ExpandedHeaderCell>Asset</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Sys Admin</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Primary Owner</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Accepted %</ExpandedHeaderCell>
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