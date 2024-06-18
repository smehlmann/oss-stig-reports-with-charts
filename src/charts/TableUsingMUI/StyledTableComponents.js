//StyledTableComponents.js

import { styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";

//standard table components
export const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  flex: '1',
  maxWidth: "100%",
  border: "1px solid #e0e0e0",
  margin: "0 auto",
  overflowX: "inherit",
  borderRadius: '8px',
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  flex: '1',
  border: 'none',
  margin: 0,
  overflowX: "inherit",
}));

//first row of cells containing name of columns
export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  display: 'flex',
  height: "55px",
  alignItems: 'center',
}));
//actual cells in the header row
export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "&:first-of-type": {
    border: 'none', 
  },
  "&.child-row": {
    border: 'none', 
  }
}));

//normal table cell
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2,
  overflow: 'auto',
  whiteSpace: 'normal',
  maxWidth: '33%',
  wordBreak: 'break-all',
  flex: '1'
}));

/* EXPANDED TABLE COMPONENTS */
//expanded section 
export const ExpandedContentCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  whiteSpace: 'normal',
  backgroundColor: theme.palette.action.hoverExpandedSection,
  // maxWidth: '33%',
  flex: '1',
}));

//container holding child table
export const StyledChildTableContainer = styled(Paper)(({ theme }) => ({
  // border: "1px solid #f4f6f8",
  margin: "0 auto",
  overflow: 'hidden',
  borderRadius: "10px",
  boxShadow: theme.shadows[1],
}));

//Header in expanded section
export  const ExpandedTableHead= styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  border: 'none',
  alignItems: 'center',
  whiteSpace: 'normal',
}));

//cells in header in expanded section
export const ExpandedHeaderCell = styled(TableCell)(({ theme }) => ({
  // fontSize: '18px',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  fontSize: theme.typography.h2,
  fontWeight: 'bold',
  alignItems: 'center',
}));

export const ExpandedTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2,
  overflow: 'auto',
  whiteSpace: 'normal',
  maxWidth: '33%',
  wordBreak: 'break-all',
  flex: '1'
}));
