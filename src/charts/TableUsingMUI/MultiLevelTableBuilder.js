import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { styled } from '@mui/material/styles';
import { useFilter } from '../../FilterContext';

import {
  StyledTableContainer,
  StyledTableRow,
  StyledTableHead,
  StyledHeaderCell,
  StyledTableCell,
  StyledTable,
  ExpandedContentCell,
  // SearchBar,
  SearchBarContainer,
  SearchTextField,
} from './StyledTableComponents';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

//renders a row in the table; manages expanded (open) and non-expanded state,
function Row({ parentRow, columns, renderChildRow, filterProperty }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchText, setSearchText] = useState("");
  const { updateFilter, clearFilter } = useFilter();

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
      const newOpen = !prevOpen;
      if (newOpen) {
        // Update filter based on the parent row
        updateFilter({ [filterProperty]: parentRow[filterProperty] });
      } else {
        // Clear filter if collapsing the row
        clearFilter();
      }
      return newOpen;
    });
  };

  //filters expanded sections' tables based on search text
  //hook triggered when 'open', 'searchText', 'parentRow' or 'updateFilter' changes 
  useEffect(() => {
    // Update filter based on the search text in the expanded section's table
    if (open && searchText.trim() !== "") {
      const filteredChildRows = parentRow.childRows.filter(
        (childRow) =>
          childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
          childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
          childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
          childRow.accepted.toString().includes(searchText) 
          
      );
      //merge new criteria to filter with old
      if (filteredChildRows.length > 0) {
        updateFilter((prevFilter) => ({
          ...prevFilter,
          childRows: filteredChildRows
        }));
      }
    }
  }, [open, searchText, parentRow, updateFilter, clearFilter]);


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
          {/* Contains Expanded content*/}
          <ExpandedContentCell  
            style={{ paddingBottom: 0, paddingTop: 0, }}  // colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1,  marginLeft: 0,  overflow: "hidden" }}>
                <Box sx={{display: 'flex', flexDirection: 'column',
                  }}
                >

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
                        count={parentRow.childRows.filter(childRow => (
                          childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
                          childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
                          childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
                          childRow.accepted.toString().includes(searchText)
                        )).length}
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
              </Box>
            </Collapse>
          </ExpandedContentCell>
        </StyledTableRow>
      )}
    </React.Fragment>
  );
}

export const MultiLevelTableBuilder = ({ rows, columns, renderChildRow, filterProperty }) => (
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
            filterProperty={filterProperty}
          />
        ))}
      </TableBody>
    </StyledTable>
  </StyledTableContainer>
);
export default MultiLevelTableBuilder;

