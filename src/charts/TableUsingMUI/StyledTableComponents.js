//StyledTableComponents.js

import { styled, alpha } from "@mui/system";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TextField from '@mui/material/TextField';


///SearchbarContainer
export const SearchBarContainer = styled('div')(({theme}) => ({
  position: 'relative',
  
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover':{
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  borderRadius: '25px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export const SearchBar = styled(TextField)({
  marginTop: "8px",
  marginBottom: "8px",
  marginLeft: 1,
  marginRight: 1,
  padding: 'auto',
  "& .MuiOutlinedInput-root": {
    borderRadius: "25px",
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
});


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
//actual cells in the header row (text)
export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  // fontSize: '24px',
  fontSize: theme.typography.h3.fontSize,
  fontWeight: 'bold',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.text.primary,
  },
  "&:first-of-type": {
    border: 'none', 
  },
  "&.first-level-child-row": {
    border: 'none', 
  },
  "&.second-level-child-row": {
    border: 'none', 

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
//expanded section 
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
  backgroundColor: theme.palette.secondary.light,
  border: 'none',
  alignItems: 'center',
  whiteSpace: 'normal',
}));

//header cells in expanded section (NOT FOR MULTILEVEL)
export const ExpandedHeaderCell = styled(TableCell)(({ theme }) => ({
  // fontSize: '18px',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  fontSize: theme.typography.h2,
  fontWeight: 'bold',
  alignItems: 'center',
  "&:hover": {
    backgroundColor:  theme.palette.secondary.light,
  },
}));


export const ExpandedTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2,
  overflow: 'auto',
  whiteSpace: 'normal',
  // maxWidth: '33%',
  wordBreak: 'break-all',
  flex: '1',

  "&.first-level-cell": {
    border: 'none', 
    backgroundColor: '#FF5733',
  },
}));


//in MULTILEVEL: header for first table in expanded section
export const ExpandedFirstLevelHeaderCell = styled(TableCell)(({ theme }) => ({
  color: '#F5F4F4', //font color
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  fontSize: theme.typography.h5.fontSize,
  fontWeight: 'bold',
  alignItems: 'center',
  "&:hover": {
    backgroundColor:  theme.palette.secondary.light,
    color: theme.palette.text.primary,
  },
  
}));


//in MULTILEVEL: header for second table in expanded section
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



export const ExpandedFirstLevelRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "&:first-of-type": {
    border: 'none', 
  },
  "&.first-level-child-row": {
    border: 'none', 
  },
  "&.second-level-child-row": {
    border: 'none', 

  }
  
}));


//In expanded section, row of first level 
export const ExpandedFirstLevelCell = styled(TableRow)(({ theme }) => ({
  // "&:hover": {
  //   backgroundColor: theme.palette.action.selected,
  // },
  backgroundColor: '#6230EC',
  // padding: '8px',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: theme.typography.body2,
  overflow: 'auto',
  whiteSpace: 'normal',
  wordBreak: 'break-all',
  flex: '1'
  
  
}));