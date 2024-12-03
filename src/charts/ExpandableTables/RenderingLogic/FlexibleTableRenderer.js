import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
// import { styled } from '@mui/material/styles';
import useSortableData from "../hooks/useSortableData";
import Paper from '@mui/material/Paper';

import {
  StyledTableContainer,
  StyledTableHead,
  StyledHeaderCell,
  StyledTable,
} from './StyledTableComponents';
import ParentRowRenderer from './ParentRowRenderer';


const FlexibleTableRenderer = ({ rows, columns, renderChildRow, childRowCount, filterProperty }) => {
  const {sortField, sortDirection, handleSort, sortData} = useSortableData();

  //function to sort childRows
  const sortChildRows = rows => sortData(rows);
  
  //childRows based on sortDirection and sortField
  const sortedChildRows = sortChildRows(rows);

  return (
    <StyledTableContainer >
      <StyledTable aria-label="collapsible table">
        <StyledTableHead>
          <TableRow sx={{ width: '100%'}}>
            {columns.map((header, index) => (
              <React.Fragment key={header.id}>
                {index === 0 && (
                  <StyledHeaderCell
                    key={header.id}
                    align={header.align}
                    onClick={() => handleSort(header.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {header.label}
                    { sortField === header.id && (
                      sortDirection === 'asc' 
                    )}
                  </StyledHeaderCell>
                )}
              </React.Fragment>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedChildRows.map((row) => (
            <ParentRowRenderer
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
export default FlexibleTableRenderer;

