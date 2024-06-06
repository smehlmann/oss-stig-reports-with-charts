import React, { useState, useEffect } from "react";
import numeral from 'numeral';
import Typography from '@mui/material/Typography';
import DataGridBuilder from './DataGridBuilder'
import { LinearProgress } from '@mui/material';

const calculateAverage = (values) => {
  const sum = values.reduce((total, value) => total + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};

const renderProgressBarCell = (params) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
  {/* <div style={{width: '80%', alignItems: 'center', paddingTop: '10%' }}> */}
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

  // console.log("Type of data in Data Grid:", typeof data);
  // console.log("Is data an array?", Array.isArray(data));

  useEffect(() => {
    if(Array.isArray(data) && data) {
      // Group data by "code" values
      const dataGroupedByCode = data.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.code]) {
          accumulator[currentValue.code] = [];
        }
        accumulator[currentValue.code].push(currentValue);
        return accumulator;
      }, {});
      
      
      // Calculate averages for each code
      //converts dataGroupedByCode obj into array of key-value pairs (key=code, values=data)
      const codeAverages = Object.entries(dataGroupedByCode).map(([code, data]) => { 
        const assessedValues = data.map((item) => item.assessed); //array of "assessed" values
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
    { field: 'code', headerName: 'Code', width: 200 },
    {
      field: 'avgAssessed',
      headerName: 'Avg of Assessed',
      width: 200,
      // valueFormatter: ({ value }) => numeral(value * 100).format('0.00') + '%',
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgSubmitted',
      headerName: 'Avg of Submitted',
      width: 200,
      // valueFormatter: ({ value }) => numeral(value * 100).format('0.00') + '%',
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgAccepted',
      headerName: 'Avg of Accepted',
      width: 200,
      // valueFormatter: ({ value }) => numeral(value * 100).format('0.00') + '%',
      renderCell: renderProgressBarCell,
    },
    {
      field: 'avgRejected',
      headerName: 'Avg of Rejected',
      width: 200,
      // valueFormatter: ({ value }) => numeral(value * 100).format('0.00') + '%',
      renderCell: renderProgressBarCell,
    },
  ];
  return (
    <DataGridBuilder data={averages} columns={tableColumns} />
  );
}

export default Report2AveragesPerCode;
