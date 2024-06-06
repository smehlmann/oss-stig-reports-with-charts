import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import useLocalStorageListener from "../useLocalStorageListener";


const formatPercentage = (percentageString) => {
  if (!percentageString) {
    return 0; // Return 0 for null or empty values
  }
  const percentageValue = parseFloat(percentageString.replace('%', ''));
  return percentageValue / 100; // Convert to decimal
};

const objectToString = (object) => {
  if (!object) {
    return ''; // or handle empty values as needed
  }
  //split the value by colon and take second part
  // const sysAdminValue = object.split(':')[1].trim();
  const jsonString = JSON.stringify(object);
  return jsonString
};

const stringToDate = (dateString) => {
  if (!dateString) {
    return null; // Return null for null or empty strings
  }

  // Try parsing the date using the known formats
  let date;
  // Attempt to parse using the format YYYY-MM-DD
  date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date; // Return if successful
  }

  // Attempt to parse using the format M/DD/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
    if (!isNaN(date.getTime())) {
      return date; // Return if successful
    }
  }
  // If parsing fails, return null
  return null;
};

const formatData = (parsedData) => {
  if (!Array.isArray(parsedData)) {
    console.error("parsedData is not an array:", parsedData);
    return [];
  }

  return parsedData.map(entry => {
    // Convert datePulled to a Date object
   // Split datePulled string into parts and construct a Date object
   const [year, month, day] = entry.datePulled.split('-');
   entry.datePulled = new Date(year, month - 1, day);
   entry.datePulled = stringToDate(entry.datePulled);

    // Convert percentage strings to decimals
    entry.assessed = formatPercentage(entry.assessed);
    entry.submitted = formatPercentage(entry.submitted);
    entry.accepted = formatPercentage(entry.accepted);
    entry.rejected = formatPercentage(entry.rejected);

    // Convert objects to strings and remove "_$" from sysAdmin
    entry.sysAdmin = objectToString(entry.sysAdmin).replace(/_\$$/, ''); // Use regex to ensure it only replaces the ending '_$'
    entry.primOwner = objectToString(entry.primOwner);
    entry.deviceType = objectToString(entry.deviceType);

    return entry;
  });
};

const DashboardTab = ({reportData}) => {
  
  //parse data from string to array
  let parsedData = typeof reportData == 'string' ? JSON.parse(reportData): reportData;
  // console.log('reportData: ' + parsedData);

  const formattedData = formatData(parsedData); 

  return <DashboardLayout data={formattedData} />;
};

export default DashboardTab;

/*
const DashboardTab = ({reportData}) => {
  
  //parse data from string to array
  let parsedData = typeof reportData == 'string' ? JSON.parse(reportData): reportData;
  console.log('reportData: ' + parsedData);

  return <DashboardLayout data={parsedData} />;
};

export default DashboardTab;
*/


// import "../../Charts.css";
// import "./DashboardTab.css";
// // import useLocalStorageListener from "../useLocalStorageListener";

// // import { styled } from "@mui/system";
// import { Grid } from "@mui/material";
// import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// // import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
// import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
// import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";
// //apex
// import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
// import ApexVerticalBarChart from "../../charts/BarCharts/ApexCharts/ApexVerticalBarChart";
// import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
// import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";
// import React, { useState } from "react";

// const theme = createTheme({
//   palette: {
//     background: {
//       default: "#f4f6f8",
//     },
//     text: {
//       primary: "#333333",
//     },
//   },
// });

// const Root = styled('div')(({ theme }) => ({
//   padding: theme.spacing(8),
//   // backgroundColor: theme.palette.background.default,
//   color: theme.palette.text.primary
// }));

// const DashboardTab = () => {
//   // const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

//   const [reportData, setReportData] = useState(() => {
//     return localStorage.getItem("ossStigReport") || "";
//   });

//   // useLocalStorageListener((event) => {
//   //   if (event.type === "storage") {
//   //     setReportData(event.newValue);
//   //   }
//   // });

//   return (
//     <ThemeProvider theme={theme}>
//       <Root>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <ApexSimplePieChart
//               targetColumn="shortName"
//               chartTitle="Collections"
//               legendName="Name of collection"
//               data={reportData} // Pass the data to your chart component
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <ApexVerticalBarChart
//               targetColumn="code"
//               chartTitle="Code Frequency"
//               yAxisTitle="Code"
//               xAxisTitle="Frequency"
//               data={reportData} // Pass the data to your chart component
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <ApexDonutCountChart
//               targetColumn="shortName"
//               chartTitle="Collections"
//               legendName="Name of collection"
//               data={reportData} // Pass the data to your chart component
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <DonutAvgChart
//               targetColumns={["assessed", "submitted", "accepted", "rejected"]}
//               chartTitle="Averages"
//               legendName="Amounts"
//               data={reportData} // Pass the data to your chart component
//             />
//           </Grid>
//           {/* Uncomment this section if you want to include the LineChartBuilder */}
//           {/* <Grid item xs={12} md={8} lg={9}>
//             <LineChartBuilder data={reportData} /> 
//           </Grid> */}
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <Report2CollectionsExpanded data={reportData} /> {/* Pass the data to your table component */}
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3}>
//             <Report2AveragesPerCode data={reportData} /> {/* Pass the data to your table component */}
//           </Grid>
//         </Grid>
//       </Root>
//     </ThemeProvider>
//   );
// };

// export default DashboardTab;

/*
import "../../Charts.css";
import "./DashboardTab.css";
//import useLocalStorageListener from "../useLocalStorageListener";

import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";

//apex
import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
import ApexVerticalBarChart from "../../charts/BarCharts/ApexCharts/ApexVerticalBarChart";
import ApexDonutCountChart from "../../charts/DonutCharts/ApexCharts/ApexDonutCountChart";
import DonutAvgChart from "../../charts/DonutCharts/ApexCharts/DonutAvgChart";

import React, { useState } from "react";

const DashboardTab = () => {
  //Switch chart type on page
  const [currentPage, setCurrentPage] = useState("chart");
  // const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const [reportData, setReportData] = useState(() => {
    return localStorage.getItem("ossStigReport") || "";
  });

  // useLocalStorageListener((event) => {
  //   if (event.type === 'storage') {
  //     setReportData(event.newValue);
  //   }
  // });

  return (
    <div className="Charts">
      <button className="apexButton" onClick={() => setCurrentPage("ApexPie")}>Apex Pie</button>
      <button className="apexButton" onClick={() => setCurrentPage("ApexBar")}>Apex Bar</button>
      <button className="apexButton" onClick={() => setCurrentPage("ApexDonutCount")}>Apex Count Donut</button>
      <button className="apexButton" onClick={() => setCurrentPage("DonutAvg")}>Apex Avg Donut</button>
      <button onClick={() => setCurrentPage("Line")}>Line</button>
      <button onClick={() => setCurrentPage("ExpandableTable")}>
        Expandable Table
      </button>
      <button onClick={() => setCurrentPage("DataGrid")}>Data Grid</button>

      <div className="chart-container">
        {currentPage === "ApexPie" && (
          <ApexSimplePieChart
            targetColumn="shortName"
            chartTitle = "Collections"
            legendName = "Name of collection"
          />
        )}
        {currentPage === "ApexBar" && (
          <ApexVerticalBarChart
            targetColumn="code"
            chartTitle="Code Frequency"
            yAxisTitle="Code"
            xAxisTitle="Frequency"
          />
        )}
        {currentPage === "ApexDonutCount" && (
          <ApexDonutCountChart
            targetColumn="shortName"
            chartTitle = "Collections"
            legendName = "Name of collection"
          />
        )}
        {currentPage === "DonutAvg" && (
          <DonutAvgChart
            targetColumns={["assessed", "submitted", "accepted", "rejected"]}
            chartTitle = "Averages"
            legendName = "Amounts"
          />
        )}
        {currentPage === "Line" && <LineChartBuilder />}
        {currentPage === "ExpandableTable" && <Report2CollectionsExpanded />}
        {currentPage === "DataGrid" && <Report2AveragesPerCode />}
      </div>
    </div>
  );
};

export default DashboardTab;
*/