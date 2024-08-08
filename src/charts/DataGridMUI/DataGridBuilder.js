import React, {useState, useMemo} from 'react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import { Box, styled } from "@mui/system";
import { useFilter } from '../../FilterContext';
import { getGridNumericOperators } from '@mui/x-data-grid';
import DropdownInputValue from './DropdownInputValue';

// // Define custom dropdown filter operators
// const dropdownFilterOperator = {
//   dropdown: {
//     value: 'dropdown',
//     getApplyFilterFn: (filterItem) => {
//       if (!filterItem.value) return null;
//       return ({ value }) => value === filterItem.value;
//     },
//     InputComponent: DropdownInputValue,
//     getValueAsString: (value) => value || '',
//   },
// };

const BoldHeader = styled('div')(({ theme }) => ({
  // fontSize: '18px', 
  fontFamily: 'Segoe UI',
  fontWeight: '700',
  textWrap: 'wrap',
  textAlign: 'center',
  overflowX: 'visible',
  fontSize: 'calc(11px + 0.2vw)', // Responsive font size
  whiteSpace: 'normal', // Allow text wrapping
  wordBreak: 'break-word', // Break long words
  width: '100%',
  display: 'flex',
}));


//created styled data grid:
const StyledDataGrid = styled(DataGrid) (({theme}) => ({
  "& .MuiDataGrid-root": {
    display: 'flex',
    border: 'none',
    
  },
  "& .MuiDataGrid-scrollbarFiller--header": {
    backgroundColor: theme.palette.secondary.light

  }, 
  //Text in table cells
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    whiteSpace: 'normal', // Allow text wrapping
    wordBreak: 'break-word',
    alignItems: 'center',
    justifyContent: 'center',
    alignText: 'center',
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.secondary.light,
    // borderBottom: 'none',
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.secondary.light,
  },

  // "& .MuiDataGrid-virtualScroller": {
  //   backgroundColor: theme.palette.background.paper,
  // },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    backgroundColor: theme.palette.secondary.light,
  },
  "& .MuiCheckbox-root": {
    color: `${theme.palette.secondary.main} !important`,
  },
  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: `${theme.palette.text.primary} !important`,
  },

  "& .MuiDataGrid-columnHeaderTitleContainer" : {
    display: 'flex',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }, 

  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    // backgroundColor: '#C70039',
    display: 'flex',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  "& .css-152u2bk": {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'visible',

  }
  
}));


function DataGridBuilder({ data, columns, onRowClick, filterModel,onFilterModelChange, onRowSelectionModelChange, rowSelectionModel}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {updateFilter} = useFilter();
  // const [filterModel, setFilterModel] = useState({ items: [] });
  
  //handlers to change page and rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Configure columns with custom dropdown filter
  const updatedColumns = useMemo(
    () =>
      columns.map((column) => {
        if (['avgAssessed', 'avgSubmitted', 'avgAccepted', 'avgRejected'].includes(column.field)) {
          return {
            ...column,
            filterOperators: getGridNumericOperators()
              .filter((operator) => operator.value !== 'isAnyOf')
              .map((operator) => ({
                ...operator,
                InputComponent: DropdownInputValue,
              })),
          };
        }
        return column;
      }),
    [columns]
  );

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      height: '100%',
      // maxHeight: '100%', // Ensure it doesn't grow beyond this height
      overflowY: 'hidden',
      margin: "0 auto",
      flexDirection: 'column',
    }}>
      
      <StyledDataGrid
        rows={data}
        columns={updatedColumns.map((column) => ({
          ...column,
          headerAlign: 'center',
          align: 'center',
          flex: 1, // Flex property for responsive resizing
          minWidth: 100,
          renderHeader: (params) => (
            <BoldHeader>{params.colDef.headerName}</BoldHeader>
          ),
        }))}
        pageSize={rowsPerPage}
        onPageChange={handleChangePage}
        paginationMode="server"
        page={page}
        pagination
        rowCount={data.length}
        rowsPerPageOptions={[5, 10]}
        onPageSizeChange={handleChangeRowsPerPage}
        // checkboxSelection
        disableSelectionOnClick
        onRowClick={onRowClick}
        hideFooter
        // filterModel={filterModel}
        // onFilterModelChange={onFilterModelChange }
        components={{Toolbar: GridToolbar,}}
        // rowSelectionModel={rowSelectionModel}
      />
    </Box>
  );
}

export default DataGridBuilder;


// import React, {useState, useMemo} from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Box, styled } from "@mui/system";
// import TableCell from '@mui/material/TableCell';
// import { useFilter } from '../../FilterContext';


// const BoldHeader = styled('div')(({ theme }) => ({
//   fontSize: '18px', 
//   fontFamily: 'Segoe UI',
//   fontWeight: '700',
//   textWrap: 'wrap',
//   textAlign: 'center',
//   [theme.breakpoints.down('lg')]: {
//     fontSize: '14px', // Font size for large screens and down
//   },
//   [theme.breakpoints.down('md')]: {
//     fontSize: '12px', // Font size for medium screens and down
//   },
//   [theme.breakpoints.down('sm')]: {
//     fontSize: '10px', // Font size for small screens and down
//   },
// }));

// const CenterAlignedCell = styled(TableCell)({
//   textAlign: 'center',
// });

// //created styled data grid:
// const StyledDataGrid = styled(DataGrid) (({theme}) => ({
//   "& .MuiDataGrid-root": {
//     display: 'flex',
//     // flex: '1',
//     // width: "100%",
//     // height: "100%",
//    // border: "1px solid #e0e0e0",
//     // marginTop: 0,
//     // marginBottom: 0,
    
//   },
//   "& .MuiDataGrid-cell": {
//     borderBottom: "none",
//     // color: "#00b4d8"
//   },
//   "& .name-column--cell": {
//     color: theme.palette.primary.main,
//   },

//   "& .MuiDataGrid-columnHeader": {
//     backgroundColor: theme.palette.secondary.light,
//     // borderBottom: 'none',
    
//   },
//   "& .MuiDataGrid-virtualScroller": {
//     backgroundColor: theme.palette.background.paper,
//   },
//   "& .MuiDataGrid-footerContainer": {
//     borderTop: "none",
//     backgroundColor: theme.palette.secondary.light,
//   },
//   "& .MuiCheckbox-root": {
//     color: `${theme.palette.secondary.main} !important`,
//   },
//   "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//     color: `${theme.palette.text.primary} !important`,
//   },
// }));


// function DataGridBuilder({ data, columns, onRowClick, onRowSelectionModelChange, rowSelectionModel}) {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   //handlers to change page and rows per page
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box sx={{
//       width: '100%',
//       display: 'flex',
//       maxHeight: '100%', // Ensure it doesn't grow beyond this height
//       overflowY: 'auto', // Enable vertical scrolling
//       margin: "0 auto",
//       overflowX: "hidden",
//       flex: '1',
//     }}>
      
//       <StyledDataGrid
//         rows={data}
//         columns={columns.map((column) => ({
//           ...column,
//           headerAlign: 'center',
//           align: 'center',
//           renderHeader: (params) => (
//             <BoldHeader>{params.colDef.headerName}</BoldHeader>
//           ),
//         }))}
//         pageSize={rowsPerPage}
//         onPageChange={handleChangePage}
//         paginationMode="server"
//         page={page}
//         pagination
//         rowCount={data.length}
//         rowsPerPageOptions={[5, 10]}
//         onPageSizeChange={handleChangeRowsPerPage}
        
//         // checkboxSelection
//         disableSelectionOnClick
//         onRowClick={onRowClick}
//         // rowSelectionModel={rowSelectionModel}
//       />
//    </Box>
//   );
// }

// export default DataGridBuilder;





