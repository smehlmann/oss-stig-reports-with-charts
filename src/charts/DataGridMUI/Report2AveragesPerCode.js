import { fetchData } from '../DataExtractor';
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
  // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
  <div style={{width: '80%', alignItems: 'center', paddingTop: '10%' }}>
    <LinearProgress variant="determinate" value={params.value * 100} 
     color="primary"
     style={{ height: '10px', borderRadius: '5px' }}
    />
    <Typography variant="body2" align="center">
      {numeral(params.value * 100).format('0.00')}%
    </Typography>
  </div>
);

function Report2AveragesPerCode() {
  const [averages, setAverages] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const csvData = await fetchData();
        setCsvData(csvData);

        // Group data by code
        const dataGroupedByCode = csvData.reduce((accumulator, currentValue) => {
          if (!accumulator[currentValue.code]) {
            accumulator[currentValue.code] = [];
          }
          accumulator[currentValue.code].push(currentValue);
          return accumulator;
        }, {});

        // Calculate averages for each code
        const codeAverages = Object.entries(dataGroupedByCode).map(([code, data]) => {
          const assessedValues = data.map((item) => item.assessed);
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
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };
    fetchCsvData();
  }, []);

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
