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
  SearchBarContainer,
  SearchTextField,
} from './StyledTableComponents';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

//renders a row in the table; manages expanded (open) and non-expanded state,
function Row({ parentRow, columns, renderChildRow, childRowCount, filterProperty }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchText, setSearchText] = useState("");
  const { filter, updateFilter, removeFilterKey } = useFilter();

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

  const handleToggleOpen = (key) => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen; //set state of open to opposite of previous state

      //when opnening row
      if (newOpen) {
        //checks if parentRow is valid
        if (parentRow && Object.keys(parentRow).length > 0) {
          // const key = Object.keys(parentRow)[0];
          // const value = parentRow[key];
          const key = filterProperty;
          const value = parentRow.row;

          //extracts first key-value pair from parentRow and updates the filter with key-value pair,specifying source
          updateFilter({ [key]: value }, 'expandableTable');
        } else {
          console.error('Invalid parentRow:', parentRow);
        }
      } 
      //table row is collapsed, remove it from filter.
      else {
        if (Object.keys(filter).length > 0) {
          removeFilterKey(filterProperty);
        } 
        // When collapsing row
        // if (filter[filterProperty]) {
        //   removeFilterKey(filterProperty);
        // }
      }
      return newOpen;
    });
  };
  // useEffect(() => {
  //   // Update filter based on the search text in the expanded section's table
  //   if (open && searchText.trim() !== "") {
  //     const filteredChildRows = parentRow.childRows.filter(
  //       (childRow) =>
  //         childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
  //         childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
  //         childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
  //         childRow.accepted.toString().includes(searchText)
  //     );

  //     //merge new criteria to filter with old
  //     if (filteredChildRows.length > 0) {
  //       updateFilter((prevFilter) => ({
  //         ...prevFilter,
  //         childRows: filteredChildRows
  //       }));
  //     } 
  //   }
  // }, [open, searchText, parentRow, updateFilter, removeFilterKey]);

  
  return (
    //renders parent row
    <React.Fragment>
       {/*parent row contains button and its name*/}
      <StyledTableRow>
        <StyledTableCell>
          <IconButton onClick={handleToggleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {/* {parentRow[columns[0].id]}     */}
          {parentRow.row} 
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
              <Box sx={{ display: 'flex', flexDirection: 'column', margin: 1,  marginLeft: 0,  overflow: "hidden" }}>
                <SearchBarContainer>
                  <SearchTextField
                    placeholder = 'Search...'
                    inputProps={{ 'aria-label': 'search' }}
                    InputProps = {{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{color: '#000'}}/>
                        </InputAdornment>
                      ),
                    }}
                    id = "search-bar"
                    type = "search"
                    // variant = "outlined"
                    value = {searchText}
                    onChange = {handleSearchChange}
                  >
                  </SearchTextField>
                </SearchBarContainer>
                {/* RENDERS THE mini-table within expanded row if not null*/}
                {renderChildRow ? (
                  // This part calls the renderChildRow function and passes parentRow, page, rowsPerPage, and searchText as arguments. This function should return the JSX for the mini-table.
                  <>
                    {renderChildRow(parentRow, page, rowsPerPage, searchText)}
                    <TablePagination
                      rowsPerPageOptions={[7, 14, 21]}
                      component="div"
                      count={childRowCount}
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

export const ExpandableTableBuilder = ({ rows, columns, renderChildRow, childRowCount, filterProperty }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  //sorting logic
  const sortedRows = React.useMemo(() => {
    if (sortConfig.key) {
      return [...rows].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [rows, sortConfig]);

  const handleSortRequest = (columnId) => {
    setSortConfig((prevSortConfig) => {
      //toggle between descending or ascending values
      const newDirection =
        prevSortConfig.key === columnId && prevSortConfig.direction === 'asc'
          ? 'desc'
          : 'asc';
      return { key: columnId, direction: newDirection };
    });
  };
  return (
    <StyledTableContainer>
      <StyledTable aria-label="collapsible table">
        <StyledTableHead>
          <TableRow sx={{ "& th": { border: 'none'} }}>
            {columns.map((header, index) => (
              <React.Fragment key={header.id}>
                {index === 0 && (
                  <StyledHeaderCell
                    key={header.id}
                    align={header.align}
                    onClick={() => handleSortRequest(header.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {header.label}
                    {sortConfig.key === header.id && (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    )}
                  </StyledHeaderCell>
                )}
              </React.Fragment>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <Row
              key={row.id}
              parentRow={row}
              columns={columns}
              renderChildRow={renderChildRow}
              filterProperty={filterProperty}
              childRowCount={childRowCount}            
            />
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
export default ExpandableTableBuilder;



// //renders a row in the table; manages expanded (open) and non-expanded state,
// function Row({ parentRow, columns, renderChildRow, filterProperty}) {
//   const [open, setOpen] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(7);
//   const [searchText, setSearchText] = useState("");
//   const { updateFilter, clearFilter } = useFilter();

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearchChange = (event) => {
//     setSearchText(event.target.value);
//     setPage(0); // Reset page to 0 on search
//   };


//   const handleToggleOpen = () => {
//     setOpen((prevOpen) => {
//       const newOpen = !prevOpen;
//       if (newOpen) {
//         updateFilter({ [filterProperty]: parentRow[filterProperty] });
//       } else {
//         clearFilter();
//       }
//       return newOpen;
//     });
//   };

//   return (
//     //renders parent row
//     <React.Fragment>
//        {/*parent row contains button and its name*/}
//       <StyledTableRow>
//         <StyledTableCell>
//           <IconButton onClick={handleToggleOpen}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//           {parentRow[columns[0].id]}
//         </StyledTableCell>
//         {columns.slice(1).map((column) => (
//           <StyledTableCell key={column.id} align={column.align}>
//             {parentRow[column.id]}
//           </StyledTableCell>
//         ))}
//       </StyledTableRow>

//       {/* EXPANDED ROW OPEN*/}
//       {open && (
//         <StyledTableRow>
//           {/* Contains Expanded content*/}
//           <ExpandedContentCell  
//             style={{ paddingBottom: 0, paddingTop: 0, }}  // colSpan={columns.length + 1}
//           >
//             <Collapse in={open} timeout="auto" unmountOnExit>
//               <Box sx={{ margin: 1,  marginLeft: 0,  overflow: "hidden" }}>
//                 <Box sx={{display: 'flex', flexDirection: 'column',
//                   }}
//                 >
//                   <TextField
//                     id = "search-bar"
//                     label="Search"
//                     variant="outlined"
//                     value={searchText}
//                     onChange={handleSearchChange}
//                     sx={{
//                       marginTop: "8px",
//                       marginBottom: "8px",
//                       marginLeft: 1,
//                       marginRight: 1,
//                       padding: 'auto',
//                      "& .MuiOutlinedInput-root": {
//                         borderRadius: "15px",
//                         height: "5%",
//                       },
//                       "& .MuiOutlinedInput-input": {
//                         padding: "12px",
//                       },
//                       "& .MuInputLabel-outlined": {
//                         transform: "translate(14px, 14px) scale(1)",
//                       },
//                       "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       },
//                     }}
//                   />
//                   {/* RENDERS THE mini-table within expanded row if not null*/}
//                   {renderChildRow ? (
//                     // This part calls the renderChildRow function and passes parentRow, page, rowsPerPage, and searchText as arguments. This function should return the JSX for the mini-table.
//                     <>
//                       {renderChildRow(parentRow, page, rowsPerPage, searchText)}
//                       <TablePagination
//                         rowsPerPageOptions={[7, 14, 21]}
//                         component="div"
//                         count={parentRow.childRows.filter(childRow => (
//                           childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
//                           childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
//                           childRow.primOwner.toLowerCase().includes(searchText.toLowerCase())
//                         )).length}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                       />
//                     </>
//                   ) : (
//                     <Typography variant="h6" gutterBottom component="div">
//                       No child row renderer provided
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             </Collapse>
//           </ExpandedContentCell>
//         </StyledTableRow>
//       )}
//     </React.Fragment>
//   );
// }

// export const ExpandableTableBuilder = ({ rows, columns, renderChildRow, filterProperty }) => (
//   <StyledTableContainer>
//     <StyledTable aria-label="collapsible table">
//       <StyledTableHead>
//         <TableRow sx={{ "& th": { border: 'none'} }}>
//           {columns.map((header, index) => (
//             <React.Fragment key={header.id}>
//               {index === 0 && <StyledHeaderCell>{header.label}</StyledHeaderCell>}
//               {index !== 0 && (
//                 <StyledHeaderCell key={header.id} align={header.align}>
//                   {header.label}
//                 </StyledHeaderCell>
//               )}
//             </React.Fragment>
//           ))}
//         </TableRow>
//       </StyledTableHead>
//       <TableBody>
//         {rows.map((row) => (
//           <Row
//             key={row.id}
//             parentRow={row}
//             columns={columns}
//             renderChildRow={renderChildRow}
//             filterProperty={filterProperty}
//           />
//         ))}
//       </TableBody>
//     </StyledTable>
//   </StyledTableContainer>
// );
// export default ExpandableTableBuilder;



