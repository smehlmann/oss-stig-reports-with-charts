import React, { useState, useMemo } from "react";
import {useTheme} from "../../../theme.js"
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';

import {
  StyledTable,
  StyledTableRow,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedTableCell,
  ExpandedContentCell,
  Expanded2ndLevelHeaderCell,
} from '../RenderingLogic/StyledTableComponents.js';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';


//handles rendering for 2nd-level child row (row containing Benchmarks)
function SecondLevelChildRenderer({ childRow, key, firstLevelChildRows, secondLevelChildRows, secondLevelChildRowHeaders}) {
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

//second-level-child-row
  const filteredBenchmarks = childRow[secondLevelChildRows].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
      <StyledTableRow key={key}>
          {firstLevelChildRows.map((key, keyInObjIndex) => (
        <ExpandedTableCell key={keyInObjIndex}>
         {/* render IconButton for first column */}
         {keyInObjIndex === 0 && (
          <IconButton onClick={handleToggleOpen}>
            {open 
              ? <KeyboardArrowUpIcon /> 
              : <KeyboardArrowDownIcon />
            }
          </IconButton>
         )}
          {percentageFormatterObject.formatter(childRow[key])} 
        </ExpandedTableCell>
      ))}
      </StyledTableRow>


      {/* display second-level child (third level down)*/}
      {open && childRow[secondLevelChildRows] && (
        <StyledTableRow>
          <ExpandedContentCell colSpan={6} sx={{ backgroundColor: '#EAEAEA' }}> {/* area around table */}
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0.5 }}>
                <StyledChildTableContainer>
                  <StyledTable size="small" aria-label="benchmarks table">
                    <ExpandedTableHead sx={{ backgroundColor: theme.palette.secondary.dark}}>
                        {secondLevelChildRowHeaders.map((headerName, index ) => (
                        <Expanded2ndLevelHeaderCell key={index}> 
                            {headerName}
                        </Expanded2ndLevelHeaderCell>
                      ))} 
                    </ExpandedTableHead>
                    <TableBody>
                      {filteredBenchmarks.map((benchmark, index) => (
                        <StyledTableRow key={index} className="second-level-child-row">
                          {secondLevelChildRows.map((key, keyInObjIndex) => (
                            <ExpandedTableCell key={keyInObjIndex}> 
                              {benchmark} 
                            </ExpandedTableCell>
                          ))}
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
};
export default SecondLevelChildRenderer;