import React, {useMemo} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from "@mui/system";
import TableCell from '@mui/material/TableCell';
import { useFilter } from '../../FilterContext';


const BoldHeader = styled('div')(({ theme }) => ({
  fontSize: '18px', // Default font size
  fontFamily: 'Segoe UI',
  fontWeight: '700',
  textWrap: 'wrap',
  textAlign: 'center',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px', // Font size for large screens and down
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

//created styled data grid:
const StyledDataGrid = styled(DataGrid) (({theme}) => ({
  "& .MuiDataGrid-root": {
    // width: "100%",
    // height: "100%",
    // flex: '1',
    // border: "1px solid #e0e0e0",
    // marginTop: 0,
    // marginBottom: 0,
    
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    // color: "#00b4d8"
  },
  "& .name-column--cell": {
    color: theme.palette.primary.main,
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.secondary.light,
    // borderBottom: 'none',
    
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: theme.palette.background.paper,
  },
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
}));

function DataGridBuilder({ data, columns, onRowClick, onRowSelectionModelChange, rowSelectionModel}) {

  const { filter } = useFilter();

  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      return data.filter(item =>
        Object.keys(filter).every(key => item[key] === filter[key])
      );
    }
    return data;
  }, [filter, data]);

  
  return (
    <Box sx={{
      width: '100%',

      //for the box
      maxHeight: '100%', // Ensure it doesn't grow beyond this height
      overflowY: 'auto', // Enable vertical scrolling
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
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        // checkboxSelection
        disableSelectionOnClick
        onRowClick={onRowClick}
        // rowSelectionModel={rowSelectionModel}
        pagination
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





