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

function Row({ parentRow, columns, renderChildRow, getChildRows }) {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            onClick={() => setOpen(!open)}
          >
            {open ? '▾' : '▸'}
          </IconButton>
          {parentRow[columns[0].id]} {/* Render Short Name in the same cell */}
        </TableCell>
        {/* Render other columns */}
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
                {renderChildRow ? renderChildRow(parentRow) : (
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
export const ExpandableTableBuilder = ({ rows, columns, renderChildRow, getChildRows }) => (
  <TableContainer component={Paper}>
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow>
        {columns.map((header, index) => (
            <React.Fragment key={header.id}>
              {index === 0 && (
                <TableCell className = "main-header">
                  {header.label} {/* Render "Short Name" label in the first column */}
                </TableCell>
              )}
              {index !== 0 && (
                <TableCell key={header.id} align={header.align} className = "main-header">
                  {header.label}
                </TableCell>
              )}
            </React.Fragment>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.id} parentRow={row} columns={columns} renderChildRow={renderChildRow} getChildRows={getChildRows} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
export default ExpandableTableBuilder;