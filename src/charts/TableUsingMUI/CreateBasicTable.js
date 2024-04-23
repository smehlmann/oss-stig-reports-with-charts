import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


/* This component is a function that accepts the all the extracted data and the specified columns to display in table. A table will then be built based on the specified columns, and the table will then be returned.*/

export default function CreateBasicTable({ data, columns }) {
  console.log("Received data:", data);
  console.log("Received columns:", columns);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label=" basic table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.accessor}>{column.Header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                 <TableCell key={`${index}-${column.accessor}`} align="left">
                 {column.Cell ? column.Cell({ value: row[column.accessor] }) : row[column.accessor]}
               </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

