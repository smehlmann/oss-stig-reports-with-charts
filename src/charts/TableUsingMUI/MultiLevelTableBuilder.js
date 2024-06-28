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
import TextField from '@mui/material/TextField';
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
} from './StyledTableComponents';
 

//renders a row in the table; manages expanded (open) and non-expanded state,
function Row({ parentRow, columns, renderChildRow, filterProperty }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  // State for benchmarks expansion
  const [benchmarksOpen, setBenchmarksOpen] = useState(false); 

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

  const handleToggleBenchmarks = () => {
    setBenchmarksOpen((prevOpen) => !prevOpen);
  };

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

  const renderBenchmarks = () => {
    if (!benchmarksOpen) return null;
    return (
      // Render your benchmarks table or content here
      <div>
        {parentRow.childRows.map((childRow) => (
          <div key={childRow.asset}>
            <h3>{childRow.asset} Benchmarks:</h3>
            <ul>
              {childRow.benchmarks.map((benchmark, index) => (
                <li key={index}>{benchmark}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
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
          {/* Contains Expanded content*/}
          <ExpandedContentCell  
            style={{ paddingBottom: 0, paddingTop: 0, }}  // colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1,  marginLeft: 0,  overflow: "hidden" }}>
                <Box sx={{display: 'flex', flexDirection: 'column',
                  }}
                >
                  <TextField
                    id = "search-bar"
                    label="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={{
                      marginTop: "8px",
                      marginBottom: "8px",
                      marginLeft: 1,
                      marginRight: 1,
                      padding: 'auto',
                     "& .MuiOutlinedInput-root": {
                        borderRadius: "15px",
                        height: "5%",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px",
                      },
                      "& .MuiInputLabel-outlined": {
                        transform: "translate(14px, 14px) scale(1)",
                      },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  />
                  {/* RENDERS THE mini-table within expanded row if not null*/}
                  {renderChildRow ? (
                    // This part calls the renderChildRow function and passes parentRow, page, rowsPerPage, and searchText as arguments. This function should return the JSX for the mini-table.
                    <>
                      {renderChildRow(parentRow, page, rowsPerPage, searchText)}
                      <TablePagination
                        rowsPerPageOptions={[7, 14, 21]}
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

export const ThreeLevelTableBuilder = ({ rows, columns, renderChildRow, filterProperty }) => (
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
export default ThreeLevelTableBuilder;
