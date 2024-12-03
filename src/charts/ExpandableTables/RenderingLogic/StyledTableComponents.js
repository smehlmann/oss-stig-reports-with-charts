//StyledTableComponents.js

import { styled, alpha } from "@mui/system";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TextField from '@mui/material/TextField';
import { TableSortLabel} from '@mui/material';


///SearchbarContainer
export const SearchBarContainer = styled('div')(({theme}) => ({
  marginTop: '8px',
  marginBottom: '8px',
  position: 'relative',
  width: '100%',
  borderRadius: '25px', 
  backgroundColor: alpha(theme.palette.primary.light, 0.15), //initial bg
  '&:hover':{
    backgroundColor: alpha(theme.palette.primary.light, 0.35)
  },

  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    color: '#000000', // Set the text color here
    borderColor: 'transparent',
    borderRadius: '25px', // Initial border radius
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    '&:focus': {
      borderRadius: '30px', // Border radius when focused
    },
    [theme.breakpoints.up('sm')]: {
      width: '80',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  //initial rendering (before hover or focus)
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent', 
      borderRadius: '25px', 
      // backgroundColor: alpha(theme.palette.primary.light, 0.15),
    },
    // Adjust border color on hover if needed
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.25), 
      // backgroundColor: alpha(theme.palette.primary.light, 0.25),
    },
    //adjustments made when focused
    '&.Mui-focused fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.5), // Adjust border color when focused
      borderWidth: '2px',
      // backgroundColor: alpha(theme.palette.primary.light, 0.35)
    },
  },
}));


//standard table components
export const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  padding: 0,
  display: 'flex',
  // border: "1px solid #e0e0e0",
  margin: "0 auto",
  overflowX: "inherit",
  borderRadius: '8px',
  flexDirection: 'column'
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  flex: '1',
  border: 'none',
  padding: 0,
  margin: 0,
  overflowX: "inherit",
}));

//first row of cells containing name of columns
export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  display: 'flex',
  height: "55px",
  margin: 0, 
  paddingLeft: 10,
  alignItems: 'center',
  border: 'none',
  width: '100%',
}));


//actual cells in the header row (text)
export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  fontWeight: 'bold',
  border: 'none',
}));


export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.text.primary,
  },
  "&:first-of-type": {
    border: 'none', 
  },
  //
  "&.first-level-child-row": {
    border: 'none', 
    backgroundColor: '#ffffff', 
    "&:nth-of-type(even)": {
      backgroundColor: '#eeeffc', // alternating color for each rows
    },
  },
  "&.second-level-child-row": {
    border: 'none', 
    backgroundColor: '#ffffff', 
    "&:nth-of-type(even)": {
      backgroundColor: '#eeeffc', // alternating color
    },
  } 
}));



export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&.first-level-child-sort": {
    "& .MuiTableSortLabel-icon": {
      color: '#e8e8f2', // icon color when sort is active
    },
    color: '#FFF', // default text color
    "&.MuiTableSortLabel-active": {
      color: theme.palette.primary.main, // when sort is active
      
    },
    "&:hover": {
      color: theme.palette.primary, // when hovered over
      "& .MuiTableSortLabel-icon": {
        color: '#FFF', // icon color on hover
      }
    },
  },
  "&.second-level-child-sort": {
    // Add your styles for the second level here
  }
}));

//normal table cell, basically outermost rows (controls text)
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
//expanded section (area around table in expanded section)
export const ExpandedContentCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  whiteSpace: 'normal',
  backgroundColor: theme.palette.action.hoverExpandedSection,
  // flex: '1',
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
  // backgroundColor: theme.palette.secondary.main,
  border: 'none',
  alignItems: 'center',
  whiteSpace: 'normal',
  
}));

//cells in header for first table in expanded section
export const ExpandedFirstLevelHeaderCell = styled(TableCell)(({ theme }) => ({
  color: '#FFF', //font color
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  backgroundColor: theme.palette.secondary.main,
  fontSize: theme.typography.h5.fontSize,
  fontWeight: 'bold',
  alignItems: 'center',
  "&:hover": {
    backgroundColor:  '#423d90',
    color: theme.palette.text.primary,
  },
}));



//in MULTILEVEL: cells in header for second table in expanded section
export const Expanded2ndLevelHeaderCell = styled(TableCell)(({ theme }) => ({
  color: '#FFF', //font color
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 'bold',
  alignItems: 'center',
  "&:hover": {
    backgroundColor:  theme.palette.secondary.light,
    color: theme.palette.text.primary,
  },
}));



export const ExpandedTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2,
  overflow: 'auto',
  whiteSpace: 'break-spaces',
  wordBreak: 'word-break',
  wordWrap: 'break-word',
  flex: '1',

  "&.first-level-cell": {
    
    border: 'none', 
    // backgroundColor: '#FF5733',
  },
}));


