
import React, { useState, useMemo,  useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useFilter } from '../../FilterContext';
import DataGridBuilder from './DataGridBuilder';
import {getPercentageFormatterObject} from "../getPercentageFormatterObject.js";


const calculateAverage = (values) => {
  const sum = values.reduce((total, value) => total + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};


const renderProgressBarCell = (params) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
    <LinearProgress variant="determinate" value={params.value * 100} 
     color="primary"
     style={{ height: '10px', borderRadius: '5px' }}
    />
    <Typography variant="body2" align="center">
      {numeral(params.value * 100).format('0.00')}%
    </Typography>
  </div>
);

function AveragesGroupedByColumn({ groupingColumn, data, targetColumns }) {
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  const [averages, setAverages] = useState([]);

  //format the averages
  const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);
  
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    if (Array.isArray(filteredData) && filteredData) {
      const dataGrouped = filteredData.reduce((accumulator, currentValue) => {
        const groupingValue = currentValue[groupingColumn];
        if (!accumulator[groupingValue]) {
          accumulator[groupingValue] = [];
        }
        accumulator[groupingValue].push(currentValue);
        return accumulator;
      }, {});
      
      //calculate averages for each of the rows in the data grid 
      const groupedAverages = Object.entries(dataGrouped).map(([groupingValue, groupData]) => {
        const averages = targetColumns.reduce((acc, columnName) => {
          const values = groupData.map((item) => item[columnName]).filter(val => val !== undefined);
          acc[`avg${columnName.charAt(0).toUpperCase() + columnName.slice(1)}`] = calculateAverage(values);
          return acc;
        }, { id: groupingValue, [groupingColumn]: groupingValue });
        return averages;
      });
      setAverages(groupedAverages);
    }
  }, [targetColumns, filteredData, groupingColumn]);


  const handleRowClick = (params) => {
    const selectedValue = params.row[groupingColumn]; 
    updateFilter({ [groupingColumn]: selectedValue });
  };

  // const handleSelectionModelChange = (newSelection) => {
  //   console.log('Selection model changed:', newSelection);
  //   if (newSelection.length > 0) {
  //     const selectedRows = newSelection.map((id) => averages.find((row) => row.id === id));
  //     if (selectedRows.length > 0) {
  //       const selectedCodes = selectedRows.map(row => row.code);
  //       updateFilter({ code: selectedCodes[0] });
  //     }
  //   }
  // };


  //headers for columns
  const tableColumns = [
    { field: groupingColumn , 
      headerName: groupingColumn , 
      flex: 1 
    },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),

      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      flex: 1,
      type: 'number', // Set the type to 'number' for proper filtering
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
    
      // renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      flex: 1,
      renderCell: (params) => (
        <div>
          {numeral(params.value * 100).format('0.00')}%
        </div>
      ),
      // renderCell: renderProgressBarCell,
      
    },
  ];

  return (
    <DataGridBuilder 
      data={averages} 
      columns={tableColumns}
      onRowClick={handleRowClick}

      
    />
  );
}
export default AveragesGroupedByColumn;



/*
import React, { useState, useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import DataGridBuilder from './DataGridBuilder';
import { LinearProgress } from '@mui/material';

const calculateAverage = (values) => {
  const sum = values.reduce((total, value) => total + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};

const renderProgressBarCell = (params) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
    <LinearProgress variant="determinate" value={params.value * 100} 
     color="primary"
     style={{ height: '10px', borderRadius: '5px' }}
    />
    <Typography variant="body2" align="center">
      {numeral(params.value * 100).format('0.00')}%
    </Typography>
  </div>
);

function Report2AveragesPerCode({ data }) {
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    if (Array.isArray(data) && data) {
      // Group data by "code" values
      const dataGroupedByCode = data.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.code]) {
          accumulator[currentValue.code] = [];
        }
        accumulator[currentValue.code].push(currentValue);
        return accumulator;
      }, {});
      
      // Calculate averages for each code
      const codeAverages = Object.entries(dataGroupedByCode).map(([code, data]) => { 
        const assessedValues = data.map((item) => item.assessed); // array of "assessed" values
        const submittedValues = data.map((item) => item.submitted);
        const acceptedValues = data.map((item) => item.accepted);
        const rejectedValues = data.map((item) => item.rejected);
        return {
          id: code,
          code,
          avgAssessed: calculateAverage(assessedValues),
          avgSubmitted: calculateAverage(submittedValues),
          avgAccepted: calculateAverage(acceptedValues),
          avgRejected: calculateAverage(rejectedValues),
        };
      });
      setAverages(codeAverages);
    }
  }, [data]);

  const tableColumns = [
    { field: 'code', 
      headerName: 'Code', 
      flex: 1 
    },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      wrap: true,
      flex: 1,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      flex: 1,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      flex: 1,
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      flex: 1,
      renderCell: renderProgressBarCell,
    },
  ];

  return (
    <DataGridBuilder data={averages} columns={tableColumns} />
  );
}

export default Report2AveragesPerCode;
*/

