import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useFilter } from '../../../FilterContext';

import {
  StyledTableContainer,
  StyledTableRow,
  StyledTableHead,
  StyledHeaderCell,
  StyledTableCell,
  StyledTable,
  ExpandedContentCell,
  SearchBarContainer,
  SearchTextField,
} from '../StyledTableComponents';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// renders a row in the table; manages expanded (open) and non-expanded state,
function Row({ parentRow, columns, renderChildRow}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const { filter, updateFilter, removeFilterKey } = useFilter();


  // const listItems = columns.map((item) => (
  //   <li key={item.id}> </li>
  // ));
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0); // Reset page to 0 on search
  };

  const handleToggleOpen = () => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen; //set state of open to opposite of previous state
  
      //when opnening row
      if (newOpen) {
        //checks if parentRow is valid
        if (parentRow && Object.keys(parentRow).length > 0) {
          const key = Object.keys(parentRow)[0];
          const value = parentRow[key];
          //extracts first key-value pair from parentRow and updates the filter with key-value pair,specifying source
          updateFilter({ [key]: value }, 'expandableTable');
        } else {
          console.error('Invalid parentRow:', parentRow);
        }
      } 
      //table row is collapsed, remove it from filter.
      else {
        if (Object.keys(filter).length > 0) {
          const key = Object.keys(parentRow)[0];
          removeFilterKey(key);
        } 
      }
      return newOpen;
    });
  };


  return (
    //renders parent row
    <React.Fragment>
       {/*parent row contains button and its name*/}
      <StyledTableRow>
        <StyledTableCell>
          <IconButton onClick={handleToggleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {parentRow[columns[0].id]}
        </StyledTableCell>
        {columns.slice(1).map((column) => (
          <StyledTableCell key={column.id} align={column.align}>
            {parentRow[column.id]}
          </StyledTableCell>
        ))}
      </StyledTableRow>

      {/* EXPANDED ROW OPEN*/}
      {open && (
        <StyledTableRow>
          {/* Contains first-level expanded content*/}
          <ExpandedContentCell  
            style={{ paddingBottom: 0, paddingTop: 0, }}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ display: 'flex', flexDirection: 'column', margin: 1,  marginLeft: 0,  overflow: "hidden" }}>
                  <SearchBarContainer>
                    <SearchTextField
                      placeholder='Search...'
                      inputProps={{ 'aria-label': 'search' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" >
                            <SearchIcon sx={{color:'#000'}}/>
                          </InputAdornment>
                        ),
                      }}
                      id = "search-bar"
                      type="search"
                      // variant="outlined"
                      value={searchText}
                      onChange={handleSearchChange}
                    >
                    </SearchTextField>
                  </SearchBarContainer>

                  {/* RENDERS THE mini-table within expanded row if not null*/}
                  {renderChildRow ? (
                    // This part calls the renderChildRow function and passes parentRow, page, rowsPerPage, and searchText as arguments. This function should return the JSX for the mini-table.
                    <>
                      {renderChildRow(parentRow, page, rowsPerPage, searchText)}
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"

                        count={parentRow.childRows.filter(childRow => {
                          const searchValue = searchText.toLowerCase();
                          const searchValueAsNumber = parseFloat(searchValue);
  
                          const formattedAccepted = (childRow.accepted * 100).toFixed(2);
                          const acceptedMatches = formattedAccepted.startsWith(searchValue) || childRow.accepted.toString().includes(searchValueAsNumber.toString());
  
                          return (
                            childRow.asset.toLowerCase().includes(searchValue) ||
                            childRow.sysAdmin.toLowerCase().includes(searchValue) ||
                            childRow.primOwner.toLowerCase().includes(searchValue) ||
                            acceptedMatches
                          );
                        }).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </>
                  ) : (
                    <Typography variant="h6" gutterBottom component="div">
                      No child row renderer provided
                    </Typography>
                  )}  
              </Box>
            </Collapse>
          </ExpandedContentCell>
        </StyledTableRow>
      )}
    </React.Fragment>
  );
}

export const MultiLevelTableBuilder = ({ rows, columns, renderChildRow, filterProperty, updateFilter, clearFilter, }) => {

  return (
    <StyledTableContainer>
      <StyledTable aria-label="collapsible table">
        <StyledTableHead>
          <TableRow sx={{ "& th": { border: 'none'} }}>
            {columns.map((header, index) => (
              <React.Fragment key={header.id}>
                {index === 0 && <StyledHeaderCell>{header.label}</StyledHeaderCell>}
                {index !== 0 && (
                  <StyledHeaderCell key={header.id} align={header.align}>
                    {header.label}
                  </StyledHeaderCell>
                )}
              </React.Fragment>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.id}
              parentRow={row}
              columns={columns}
              renderChildRow={renderChildRow}
            />
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
export default MultiLevelTableBuilder;

//  responsible for filtering other visualizations when row expanded
  // const handleToggleOpen = () => {
  //   setOpen((prevOpen) => {
  //     const newOpen = !prevOpen;
  //     if (newOpen && !filter) {
  //       // Update filter based on the parent row
  //       console.log('Table opened and filter is empty');
  //       console.log('Parent row:', parentRow);
  //       updateFilter({ [filterProperty]: parentRow[filterProperty] });
  //     } else if (newOpen && filter) {

  //       console.log('Table opened and filter is not empty');
  //       console.log('Parent row:', parentRow);
  //        // Add to the filter object and open the row
  //     updateFilter(prevFilter => ({
  //       ...prevFilter,
  //       [filterProperty]: parentRow[filterProperty],
  //     }));
  //     }
  //     else {
  //       // Clear filter if collapsing the row
  //       clearFilter();
  //     }
  //     return newOpen;
  //   });
  // };