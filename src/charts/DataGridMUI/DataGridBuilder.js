import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, styled } from "@mui/system";
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles';
import numeral from "numeral";

const BoldHeader = styled('div')(({ theme }) => ({
  // fontSize: '18px', // Default font size
  fontFamily: 'Segoe UI',
  fontWeight: '700',
  textWrap: 'wrap',
  textAlign: 'center',
  [theme.breakpoints.down('lg')]: {
    fontSize: '16px', // Font size for large screens and down
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px', // Font size for medium screens and down
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px', // Font size for small screens and down
  },
}));

const CenterAlignedCell = styled(TableCell)({
  textAlign: 'center',
});

function DataGridBuilder({ data, columns, onRowClick}) {
  const theme = useTheme();

  return (
    <Box sx={{
      // height: '100%',
      width: '100%',
      "& .MuiDataGrid-root": {
        // width: "100%",
        // height: "100%",
        // flex: '1',
        // border: "1px solid #e0e0e0",
        // margin: "0 auto",
        overflowX: "auto",
      },
      "& .MuiDataGrid-cell": {
        borderBottom: "none",
      },
      "& .name-column--cell": {
        color: theme.palette.primary.main,
        backgroundColor: '#c678f3',
      },
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#f4f6f8",
        borderBottom: "none",
        // fontSize: '12px',
        // fontFamily: 'Segoe UI',
        // fontWeight: '900',
      },
      "& .MuiDataGrid-virtualScroller": {
        backgroundColor: theme.palette.background.paper,
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: '#bcbbf4',
      },
      "& .MuiCheckbox-root": {
        color: `${theme.palette.secondary.main} !important`,
      },
      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
        color: `${theme.palette.text.primary} !important`,
      },

      //for the box
      // height: '400px', // Set a fixed height for the container
      maxHeight: '100%', // Ensure it doesn't grow beyond this height
      overflowY: 'auto', // Enable vertical scrolling
    }}>
      {/* <DataGrid
        rows={data}
        columns={columns.map((column) => ({
          ...column,
          
          headerAlign: 'center',
          align: 'center',
          renderHeader: (params) => (
            <BoldHeader>{params.colDef.headerName}</BoldHeader>
          ),
        }))}
        pageSize={5}  // Set the page size to 5
        components={{
          Cell: CenterAlignedCell,
        }}
        slots={{
          Toolbar: GridToolbar,  // Include the toolbar component
        }}
        rowsPerPageOptions={[5, 10,]}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={onRowClick}  
      /> */}


      <DataGrid
        rows={data}
        columns={columns.map((column) => ({
          ...column,
          headerAlign: 'center',
          align: 'center',
          renderHeader: (params) => (
            <BoldHeader>{params.colDef.headerName}</BoldHeader>
          ),
        }))}
        pageSize={5}
        components={{
          Cell: CenterAlignedCell,
        }}
        slots={{
          Toolbar: GridToolbar,
        }}
        rowsPerPageOptions={[5, 10]}
        // checkboxSelection
        disableSelectionOnClick
        onRowClick = {onRowClick}
      />
    </Box>
  );
}

export default DataGridBuilder;



// import React from 'react';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Box, styled  } from "@mui/material";

// import TableCell from '@mui/material/TableCell';
// import Table from '@mui/material/Table';
// // import {theme} from "../../theme";
// import { useTheme } from '@mui/material/styles';

// function DataGridBuilder({ data, columns }) {
//   const theme = useTheme();

//   return (
//     <Box sx={{
//       "& .MuiDataGrid-root": {
//         width: "100%",
//         height: "100%",
//         flex: '1',
//         // maxWidth: "100%",
//         border: "1px solid #e0e0e0",
//         margin: "0 auto",
//         overflowX: "inherit",
//         borderRadius: '8px',
//       },
//       "& .MuiDataGrid-cell": {
//         borderBottom: "none",
//       },
//       "& .name-column--cell": {
//         color: theme.palette.primary.main,
//         backgroundColor: '#c678f3',
//       },
//       "& .MuiDataGrid-columnHeaders": {
//         backgroundColor: "#f4f6f8",
//         borderBottom: "none",
//         fontSize: '18px',
//         fontFamily: 'Segoe UI',
//         fontWeight: '900',
//       },
//       "& .MuiDataGrid-virtualScroller": {
//         backgroundColor: theme.palette.background.paper,
//       },
//       "& .MuiDataGrid-footerContainer": {
//         borderTop: "none",
//         backgroundColor: theme.palette.primary.light,
//       },
//       "& .MuiCheckbox-root": {
//         color: `${theme.palette.secondary.main} !important`,
//       },
//       "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//         color: `${theme.palette.text.primary} !important`,
//       },
//     }}>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         pageSize={5}  // Set the page size to 5
//         rowsPerPageOptions={[5, 10, 20]}  // Options for rows per page
//         slots={{
//           Toolbar: GridToolbar,  // Include the toolbar component
//         }}
//         checkboxSelection
//         disableSelectionOnClick
//       />
//     </Box>
//   );
// }

// export default DataGridBuilder;


// import TableCell from '@mui/material/TableCell';
// import Table from '@mui/material/Table';
// function DataGridBuilder({ data, columns }) {

//   const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
//     fontSize: '24px',
//     fontWeight: 'bold',
//   }));
  
//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     padding: '8px',
//     textAlign: 'left',
//     border: `1px solid ${theme.palette.divider}`,
//     overflow: 'auto',
//     whiteSpace: 'normal',
//     maxWidth: '33%',
//     wordBreak: 'break-all',
//     flex: '1',
//   }));
  
//   const StyledTable = styled(Table)(({ theme }) => ({
//     width: "100%",
//     "& .MuiDataGrid-colCell, & .MuiDataGrid-cell": {
//       borderBottom: "none",
//     },
//     border: 'none',
//   }));

//   return (
//     <StyledTable>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         pageSize={5}  // Set the page size to 5
//         rowsPerPageOptions={[5, 10, 20]}  // Options for rows per page
//         slots={{
//           Toolbar: GridToolbar,  // Include the toolbar component
//         }}
//         checkboxSelection
//         disableSelectionOnClick
//         components={{
//           HeaderCell: StyledHeaderCell,
//           Cell: StyledTableCell,
//         }}
//       />
//     </StyledTable>
//   );
// }

// export default DataGridBuilder;


// import React from 'react';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Box } from "@mui/material";
// import { useTheme } from '@mui/material/styles';