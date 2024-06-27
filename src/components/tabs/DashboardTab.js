import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayouts/DashboardSelectedReport5";
import useLocalStorageListener from "../useLocalStorageListener";
import DashboardSelectedReport5 from "./DashboardLayouts/DashboardSelectedReport5";
import DashboardSelectedReport7 from "./DashboardLayouts/DashboardSelectedReport7";

/* Include statement to handle how data is parsed based on the report selected*/

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
    if (entry.datePulled !== undefined) {
      const [year, month, day] = entry.datePulled.split("-");
      entry.datePulled = new Date(year, month - 1, day);
      entry.datePulled = stringToDate(entry.datePulled);
    }

    // Convert percentage strings to decimals
    if (entry.assessed !== undefined) {
      entry.assessed = formatPercentage(entry.assessed);
    }
    if (entry.submitted !== undefined) {
      entry.submitted = formatPercentage(entry.submitted);
    }
    if (entry.accepted !== undefined) {
      entry.accepted = formatPercentage(entry.accepted);
    }
    if (entry.rejected !== undefined) {
      entry.rejected = formatPercentage(entry.rejected);
    }

    // Convert objects to strings and remove "_$" from sysAdmin
    if (entry.sysAdmin !== undefined) {
      entry.sysAdmin = objectToString(entry.sysAdmin).replace("_$", "");
    } 
    if (entry.primOwner !== undefined) {
      entry.primOwner = objectToString(entry.primOwner);
    }
    if (entry.deviceType !== undefined) {
      entry.deviceType = objectToString(entry.deviceType);
    }

    return entry;
  });
};

const DashboardTab = ({reportData, selectedReportNum}) => {
  //parse data from string to array
  let parsedData = typeof reportData == 'string' ? JSON.parse(reportData): reportData;
  
  const formattedData = formatData(parsedData); 
  
  
  //keeps track of the selectedReport state
  const [selectedReport, setSelectedReport] = useState(null);
 
  console.log("formattedData: ", formattedData);

  const handleClick = (reportNum) => 
    {
      setSelectedReport(reportNum);
    }

 // decide which grid layout to display based on report
  switch (selectedReportNum) {
    case '5':
      return <DashboardSelectedReport5 data={formattedData} handleClick={handleClick} />
    case '7':
      return <DashboardSelectedReport7 data={formattedData} handleClick={handleClick} />
  
    default:
      return null
  }    

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