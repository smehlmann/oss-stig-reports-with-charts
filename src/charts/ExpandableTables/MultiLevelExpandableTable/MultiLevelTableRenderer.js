import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import ParentRowRenderer from '../RenderingLogic/ParentRowRenderer';
import {
  StyledTableContainer,
  StyledTableHead,
  StyledHeaderCell,
  StyledTable,
} from '../RenderingLogic/StyledTableComponents';
import useSortableData from "../hooks/useSortableData";

export const MultiLevelTableRenderer = ({ rows, columns, renderChildRow, childRowCount}) => {
  const {sortField, sortDirection, handleSort, sortData} = useSortableData();
  
  //function to sort childRows 
  const sortChildRows = rows => sortData(rows);
  //childRows based on sort direction and field   
  const sortedChildRows = sortChildRows(rows);
  return (
    <StyledTableContainer>
      <StyledTable aria-label="collapsible table">
        <StyledTableHead>
          <TableRow sx={{ '& th': { border: 'none' } }}>
            {columns.map((header, index) => (
              <React.Fragment key={header.id}>
                {index === 0 && (
                  <StyledHeaderCell
                    onClick={() => handleSort(header.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {header.label}
                    {/* add icon to indicate sort direction */}
                    {sortField === header.id && (
                     sortDirection === 'asc' ? ' ▲' : ' ▼'
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
              childRowCount={childRowCount}
            />
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
export default MultiLevelTableRenderer;

