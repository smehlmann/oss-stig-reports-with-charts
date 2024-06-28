import React, {useState, useMemo} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from "@mui/system";
import TableCell from '@mui/material/TableCell';
import { useFilter } from '../../FilterContext';


const BoldHeader = styled('div')(({ theme }) => ({
  // fontSize: '18px', 
  fontFamily: 'Segoe UI',
  fontWeight: '700',
  textWrap: 'wrap',
  textAlign: 'center',
  overflowX: 'visible',
  /*
  [theme.breakpoints.down('lg')]: {
   fontSize: 'calc(10px + 1vmin)', // Font size for large screens and down
  },
  [theme.breakpoints.down('extendedLg')]: { //1381px
    fontSize: 'calc(9.5px + 1vmin)', 
  },
  [theme.breakpoints.down('extendedMd')]: { //1047.2px
    fontSize: 'calc(10px + 1vmin)'
  },

  [theme.breakpoints.down('md')]: {
    fontSize: 'calc(11px + 1vmin)'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 'calc(13px + 1vmin)' // Font size for small screens and down
  },
  */
}));

const CenterAlignedCell = styled(TableCell)({
  textAlign: 'center',
});

//created styled data grid:
const StyledDataGrid = styled(DataGrid) (({theme}) => ({
  "& .MuiDataGrid-root": {
    display: 'flex',
    
  },
  //Text in table cells
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    whiteSpace: 'normal', // Allow text wrapping
    wordBreak: 'break-word',
  },
  "& .name-column--cell": {
    color: theme.palette.primary.main,
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.secondary.light,
    // borderBottom: 'none',
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
  // Custom scrollbar styles
  // "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
  //   width: '10px',
  // },
  // "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
  //   background: 'transparent', // Make the scrollbar track transparent
  // },
  // "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
  //   backgroundColor: '#888',
  //   borderRadius: '10px',
  //   border: '3px solid transparent',
  // },
  // "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
  //   backgroundColor: '#555',
  // },
  // // Firefox scrollbar styles
  // "& .MuiDataGrid-virtualScroller": {
  //   scrollbarWidth: 'thin',
  //   scrollbarColor: '#888 transparent',
  // },

  
}));


function DataGridBuilder({ data, columns, onRowClick, onRowSelectionModelChange, rowSelectionModel}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //handlers to change page and rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      height: '100%',
      // maxHeight: '100%', // Ensure it doesn't grow beyond this height
      overflowY: 'auto', // Enable vertical scrolling
      margin: "0 auto",
      flexDirection: 'column',
    }}>
      
      <StyledDataGrid
        rows={data}
        columns={columns.map((column) => ({
          ...column,
          headerAlign: 'center',
          align: 'center',
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





