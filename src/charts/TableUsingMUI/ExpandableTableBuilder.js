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
import { styled } from '@mui/material/styles';
// import theme, {palette} from "../../theme"


const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  flex: '1',
  maxWidth: "100%",
  // border: 'none', 
  border: "1px solid #e0e0e0",
  margin: "0 auto",
  overflowX: "inherit",
  borderRadius: '8px',
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "&:first-of-type": {
    border: 'none', // Remove border from the first row (header row)
  },
  "&.child-row": {
    border: 'none', // Remove border from the expanded cell row
  }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  // borderLeft: "20px solid #f5f5f5",
  backgroundColor: "#f4f6f8",
  // border: 'none',
  display: 'flex',
  height: "55px",
  alignItems: 'center',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'auto',
  whiteSpace: 'normal',
  maxWidth: '33%',
  wordBreak: 'break-all',
  flex: '1'
}));


const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
  // "& .MuiDataGrid-colCell, & .MuiDataGrid-cell": {
  //   borderBottom: "none",
  // },
  border: 'none',
}));



const ExpandedContentCell = styled(TableCell)(({ theme }) => ({
  // padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  whiteSpace: 'normal',
  maxWidth: '33%',
  flex: '1',
  // backgroundColor: '', 
}));


//renders a row in the table; manages expanded (open) and non-expanded state,
function Row({ parentRow, columns, renderChildRow }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
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
    //renders parent row
    <React.Fragment>
       {/*parent row contains button and its name*/}
      <StyledTableRow>
        <StyledTableCell>
          <IconButton onClick={() => setOpen(!open)}>
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
            style={{ paddingBottom: 0, paddingTop: 0 }}
            // colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ marginTop: 1, marginLeft: 0,  overflow: "hidden" }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  sx={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
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
                {/* RENDERS THE mini-table within expanded row if not ull*/}
                {renderChildRow ? (
                  // This part calls the renderChildRow function and passes parentRow, page, rowsPerPage, and searchText as arguments. This function should return the JSX for the mini-table.
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
          </ExpandedContentCell>
        </StyledTableRow>
      )}
    </React.Fragment>
  );
}

export const ExpandableTableBuilder = ({ rows, columns, renderChildRow }) => (
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
export default ExpandableTableBuilder;

/*
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
              <Box sx={{ margin: 1, maxHeight: '300px', overflow: 'hidden'}}>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  sx={{ marginBottom: '10px', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} // Increase border radius
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
  <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
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
*/


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