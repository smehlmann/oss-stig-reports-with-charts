import React, {useState, useMemo, useEffect} from 'react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import { Box, maxHeight, styled } from "@mui/system";
import { useFilter } from '../../FilterContext';
import { getGridNumericOperators } from '@mui/x-data-grid';
import DropdownInputValue from './DropdownInputValue';

const BoldHeader = styled('div')(({ theme }) => ({
  // fontSize: '18px', 
  fontFamily: 'Segoe UI',
  fontWeight: '700',
  textAlign: 'center',
  fontSize: 'calc(11px + 0.2vw)', // Responsive font size
  whiteSpace: 'normal', 
  wordBreak: 'break-word', // Break long words
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.down('sm')]: {
    fontSize: 'calc(9px + 0.5vw)', // Adjust font size for small screens
  },
}));


//created styled data grid:
const StyledDataGrid = styled(DataGrid) (({theme}) => ({
  "& .MuiDataGrid-root": {
    display: 'flex',
    border: 'none',
  },
  //Text in table cells
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    whiteSpace: 'normal', // Allow text wrapping
    wordBreak: 'break-word',
    fontSize: '14px',
    
  },
  "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
    borderBottom: "none", // Remove the bottom border on the last row
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    borderBottom: 'none',
  },

  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: `${theme.palette.text.primary} !important`,
  },
  //fills in space above scrollvar
  "& .MuiDataGrid-scrollbarFiller--header": {
    backgroundColor: "#f1f0fd",
  }, 

  "& .MuiDataGrid-columnHeaders": { //targets entire header row
    backgroundColor: "#f1f0fd",
  },

  //targets each header cell (where names and sorting appear)
  "& .MuiDataGrid-columnHeader": {  
    backgroundColor: "#f1f0fd",
    border: 'none',
    position: 'relative',
    lineHeight: 'normal',
    height: 45,
    padding: 0,
  },
  //holds text
  "& .MuiDataGrid-columnHeaderTitleContainer" : {
    // backgroundColor: '#900C3F',
    display: 'flex',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: 'visible',
    padding: 0,
  }, 
  //text in columnHeaderTitleContent
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    display: 'flex',
    flex: 1,
    width: '100%',
    overflow: 'visible',
    textOverflow: 'ellipsis',
    textWrap: 'wrap',
    // backgroundColor: '#ff5733',
  },

  "& .MuiDataGrid-columnHeaderIcon": {
    // Ensure the sorting and more options icons are positioned correctly
    position: 'relative',
    // top: '50%',
    margin:0,
    padding:0,
    transform: 'translateY(-50%)',
    fontSize: '0.5rem',
  },

  // "& .css-152u2bk": {
  //   textAlign: 'center',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   overflowX: 'visible',
  // }
}));


function DataGridBuilder({ data, columns, onRowClick}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {filter, updateFilter } = useFilter();
  const [filterModel, setFilterModel] = useState({ items: [] });


  //handlers to change page and rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // sync DataGrid filter model with global filters
  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {  // ensure filters is not null or undefined
      const dataGridFilterContents = Object.keys(filter)
        .filter((key) => ['assessed', 'submitted', 'accepted', 'rejected'].includes(key)) // filter for specific keys
        .map((key) => ({
            field: `avg${key.charAt(0).toUpperCase() + key.slice(1)}`, // E.g., 'accepted' -> 'avgAccepted'
            operator: filter[key].operator || '', // adjust operator if needed
            // value: String(filter[key]), // convert value to string
            value: parseFloat(filter[key]) 
      }));
      
      //apply the contents of global filter to data grid filter
      setFilterModel({ items: dataGridFilterContents });

    } else {
      //if global filter is undefined or empty, clear the items in the filter model
      setFilterModel({items: [] });
    }
  }, [filter]);

  
  // handle change of DataGrid filters so it syncs with the global filter context
  const handleFilterModelChange = (newFilterModel) => {

    // sync datagrid filter with the global filter if any new filters are added to global
    newFilterModel.items.forEach((item) => {
      const transformedField = item.field.slice(3); // 'avgAccepted' -> 'accepted'
      const modifiedField = transformedField.charAt(0).toLowerCase() + transformedField.slice(1);

      if (item.value !== undefined) {
        updateFilter({ [modifiedField]: item.value }, 'dataGrid', item.operator);
      }
    });
    setFilterModel(newFilterModel); //update DataGrid's local filter state
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
      overflowY: 'hidden',
      flexDirection: 'column',
    }}>
      
      <StyledDataGrid
        rows={data}
        columnHeaderHeight={43}
        columns={updatedColumns.map((column) => ({
          ...column,
          headerAlign: 'center',
          align: 'center',
          // flex: 1, // flex property for responsive resizing
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
        disableSelectionOnClick
        onRowClick={onRowClick}
        hideFooter
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange }
        components={{Toolbar: GridToolbar,}}
        // rowSelectionModel={rowSelectionModel}
        rowHeight={43}
        sx={{borderRadius: 0}}
      />
    </Box>
  );
}

/*
Option 1: Header added to top of data grid with title and maybe button to collapse. 
const BoldHeader = styled('div')(({ theme }) => ({
  // fontSize: '18px', 
  fontFamily: 'Segoe UI',
  fontWeight: '500',
  textAlign: 'center',
  fontSize: 'calc(11px + 0.2vw)', // Responsive font size
  whiteSpace: 'normal', 
  letterSpacing: '0.0075em',
  // wordBreak: 'break-word', // Break long words
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.down('sm')]: {
    fontSize: 'calc(9px + 0.2vw)', // Adjust font size for small screens
  },
}));


//created styled data grid:
const StyledDataGrid = styled(DataGrid) (({theme}) => ({
  "& .MuiDataGrid-root": {
    display: 'flex',
    border: 'none',
  },
  //Text in table cells
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    whiteSpace: 'normal', // Allow text wrapping
    wordBreak: 'break-word',
    fontSize: '14px',
  },
  "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
    borderBottom: "none", // Remove the bottom border on the last row
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    borderBottom: 'none',
    backgroundColor: theme.palette.secondary.light,
  },
  "& .MuiCheckbox-root": {
    color: `${theme.palette.secondary.main} !important`,
  },
  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: `${theme.palette.text.primary} !important`,
  },
  //fills in space above scrollvar
  "& .MuiDataGrid-scrollbarFiller--header": {
    backgroundColor:'#f1f0fd',
  }, 

  "& .MuiDataGrid-columnHeaders": { //targets entire header row
    backgroundColor: '#f1f0fd',
  },
  //targets each header cell (where names and sorting appear)
  "& .MuiDataGrid-columnHeader": {  
    backgroundColor: '#f1f0fd',
    border: 'none',
    position: 'relative',
  },
  //holds text
  "& .MuiDataGrid-columnHeaderTitleContainer" : {
    // backgroundColor: '#900C3F',
    display: 'flex',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: 'visible',
    padding: 0,
  }, 
  //text in columnHeaderTitleContent
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    display: 'flex',
    flex: 1,
    width: '100%',
    overflow: 'visible',
    textOverflow: 'ellipsis',
    textWrap: 'wrap',
    // backgroundColor: '#ff5733',
  },

  "& .MuiDataGrid-columnHeaderIcon": {
    // Ensure the sorting and more options icons are positioned correctly
    position: 'relative',
    // top: '50%',
    margin:0,
    padding:0,
    transform: 'translateY(-50%)',
    fontSize: '0.5rem',
  },

  // "& .css-152u2bk": {
  //   textAlign: 'center',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   overflowX: 'visible',
  // }
}));


function DataGridBuilder({ data, columns, onRowClick}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {filter, updateFilter } = useFilter();
  const [filterModel, setFilterModel] = useState({ items: [] });


  //handlers to change page and rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // sync DataGrid filter model with global filters
  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {  // ensure filters is not null or undefined
      const dataGridFilterContents = Object.keys(filter)
        .filter((key) => ['assessed', 'submitted', 'accepted', 'rejected'].includes(key)) // filter for specific keys
        .map((key) => ({
            field: `avg${key.charAt(0).toUpperCase() + key.slice(1)}`, // E.g., 'accepted' -> 'avgAccepted'
            operator: filter[key].operator || '', // adjust operator if needed
            // value: String(filter[key]), // convert value to string
            value: parseFloat(filter[key]) 
      }));
      
      //apply the contents of global filter to data grid filter
      setFilterModel({ items: dataGridFilterContents });

    } else {
      //if global filter is undefined or empty, clear the items in the filter model
      setFilterModel({items: [] });
    }
  }, [filter]);

  
  // handle change of DataGrid filters so it syncs with the global filter context
  const handleFilterModelChange = (newFilterModel) => {

    // sync datagrid filter with the global filter if any new filters are added to global
    newFilterModel.items.forEach((item) => {
      const transformedField = item.field.slice(3); // 'avgAccepted' -> 'accepted'
      const modifiedField = transformedField.charAt(0).toLowerCase() + transformedField.slice(1);

      if (item.value !== undefined) {
        updateFilter({ [modifiedField]: item.value }, 'dataGrid', item.operator);
      }
    });
    setFilterModel(newFilterModel); //update DataGrid's local filter state
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
      overflowY: 'hidden',
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
          rowHeight: 15,
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
        disableSelectionOnClick
        onRowClick={onRowClick}
        hideFooter
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange }
        components={{Toolbar: GridToolbar,}}
        // rowSelectionModel={rowSelectionModel}
        // sx={{borderRadius: 3}}
        headerHeight={15}
        rowHeight={43}
        sx={{borderRadius: 0}}
      />
    </Box>
  );
}
*/

export default DataGridBuilder;

