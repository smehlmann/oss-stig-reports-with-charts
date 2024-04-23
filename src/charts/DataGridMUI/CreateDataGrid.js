import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';


function CreateDataGrid({ data, columns }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}

export default CreateDataGrid;