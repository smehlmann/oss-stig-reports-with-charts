import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';

function Row({ parentRow, columns, renderChildRow }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7); // Default to 7 rows per page
  const [searchText, setSearchText] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset'} }}>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {parentRow[columns[0].id]}
        </TableCell>
        {columns.slice(1).map((column) => (
          <TableCell key={column.id} align={column.align}>
            {parentRow[column.id]}
          </TableCell>
        ))}
      </TableRow>
      {open && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  sx={{ marginBottom: '20px', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} // Increase border radius
                />
                {renderChildRow ? (
                  <>
                    {renderChildRow(parentRow, page, rowsPerPage, searchText)}
                    <TablePagination
                      rowsPerPageOptions={[7, 14, 28]}
                      component="div"
                      count={parentRow.childRows.length}
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
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

// Function to create the table with collapsible rows
export const ExpandableTableBuilder = ({ rows, columns, renderChildRow }) => (
  <TableContainer component={Paper}>
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow sx={{ '& th': { border: 0 } }}> 
          {columns.map((header, index) => (
            <React.Fragment key={header.id}>
              {index === 0 && (
                <TableCell className="main-header">
                  {header.label}
                </TableCell>
              )}
              {index !== 0 && (
                <TableCell key={header.id} align={header.align} className="main-header">
                  {header.label}
                </TableCell>
              )}
            </React.Fragment>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.id} parentRow={row} columns={columns} renderChildRow={renderChildRow} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ExpandableTableBuilder;



/* import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%', // Ensure it does not overflow
  margin: '0 auto', // Center the container
  overflowX: 'auto', // Allow horizontal scrolling if necessary
  boxShadow: 'none', // Remove box shadow to fit within the card
}));

const StyledTable = styled(Table)(({ theme }) => ({
  width: '100%',
}));

function Row({ parentRow, columns, renderChildRow }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7); // Default to 7 rows per page
  const [searchText, setSearchText] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset'} }}>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {parentRow[columns[0].id]}
        </TableCell>
        {columns.slice(1).map((column) => (
          <TableCell key={column.id} align={column.align}>
            {parentRow[column.id]}
          </TableCell>
        ))}
      </TableRow>
      {open && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  sx={{ marginBottom: '20px', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} // Increase border radius
                />
                {renderChildRow ? (
                  <>
                    {renderChildRow(parentRow, page, rowsPerPage, searchText)}
                    <TablePagination
                      rowsPerPageOptions={[7, 14, 28]}
                      component="div"
                      count={parentRow.childRows.length}
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
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

// Function to create the table with collapsible rows
export const ExpandableTableBuilder = ({ rows, columns, renderChildRow }) => (
  <StyledTableContainer>
    <StyledTable aria-label="collapsible table">
      <TableHead>
        <TableRow sx={{ '& th': { border: 0 } }}> 
          {columns.map((header, index) => (
            <React.Fragment key={header.id}>
              {index === 0 && (
                <TableCell className="main-header">
                  {header.label}
                </TableCell>
              )}
              {index !== 0 && (
                <TableCell key={header.id} align={header.align} className="main-header">
                  {header.label}
                </TableCell>
              )}
            </React.Fragment>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.id} parentRow={row} columns={columns} renderChildRow={renderChildRow} />
        ))}
      </TableBody>
    </StyledTable>
  </StyledTableContainer>
);

export default ExpandableTableBuilder;
 */