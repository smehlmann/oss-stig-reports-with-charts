import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import useLocalStorageListener from "../useLocalStorageListener";

const DashboardTab = () => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const data = localStorage.getItem("ossStigReport");
      if (data) {
        try {
          setReportData(JSON.parse(data));
        } catch (error) {
          console.error("Failed to parse data from localStorage:", error);
          setReportData(null);
        }
      } else {
        setReportData(null);
      }
    };

    fetchData();

    //This run this after code has been initially been loaded.
    const handleStorageChange = (event) => {
      if (event.key === "ossStigReport") {
        try {
          setReportData(event.newValue ? JSON.parse(event.newValue) : null);
        } catch (error) {
          console.error("Failed to parse data from localStorage:", error);
          setReportData(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // if (!reportData) {
  //   return <div>Loading...</div>; // Handle loading state
  // }

  return <DashboardLayout data={reportData} />;
};

export default DashboardTab;




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