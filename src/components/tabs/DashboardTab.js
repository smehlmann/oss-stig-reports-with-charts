/* eslint-disable react/jsx-pascal-case */
import "../../Charts.css";
import "./DashboardTab.css";
//import useLocalStorageListener from "../useLocalStorageListener";

import VerticalBarChart from "../../charts/BarCharts/Chartjs/VerticalBarChart";
import SimplePieChart from "../../charts/PieCharts/Chartjs/SimplePieChart";
import LineChartBuilder from "../../charts/LineCharts/Chartjs/LineChartBuilder";
import DonutChartBuilder from "../../charts/DonutCharts/Chartjs/DonutChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";

//apex
import ApexSimplePieChart from "../../charts/PieCharts/ApexCharts/ApexSimplePieChart";
import ApexVerticalBarChart from "../../charts/BarCharts/ApexCharts/ApexVerticalBarChart";
import ApexDonutChart from "../../charts/DonutCharts/ApexCharts/ApexDonutChart";


import React, { useState } from "react";

const DashboardTab = () => {
  //Switch chart type on page
  const [currentPage, setCurrentPage] = useState("chart");
  // const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  const [reportData, setReportData] = useState(() => {
    return localStorage.getItem("ossStigReport") || "";
  });

  /*useLocalStorageListener((event) => {
    if (event.type === 'storage') {
      setReportData(event.newValue);
    }
  });*/

  return (
    <div className="Charts">
      <button onClick={() => setCurrentPage("VertBar")}>Code Vert Bar</button>
      <button onClick={() => setCurrentPage("Pie")}>Simple Pie</button>

      <button className="apexButton" onClick={() => setCurrentPage("ApexPie")}>Apex Pie</button>
      <button className="apexButton" onClick={() => setCurrentPage("ApexBar")}>Apex Bar</button>
      <button className="apexButton" onClick={() => setCurrentPage("ApexDonut")}>Apex Donut</button>

      <button onClick={() => setCurrentPage("Line")}>Line</button>
      <button onClick={() => setCurrentPage("Donut")}>Donut</button>


      <button onClick={() => setCurrentPage("ExpandableTable")}>
        Expandable Table
      </button>
      <button onClick={() => setCurrentPage("DataGrid")}>Data Grid</button>



      <div className="chart-container">
        
        {currentPage === "VertBar" && (
          <VerticalBarChart
            targetColumn="code"
            chartTitle="Code Frequency"
            yAxisTitle="Code"
            xAxisTitle="Frequency"
          />
        )}

        {currentPage === "Pie" && (
          <SimplePieChart
            targetColumn="shortName"
            chartTitle = "Collections"
            legendName = "Name of collection"
          />
        )}
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

      {currentPage === "ApexDonut" && (
        <ApexDonutChart
            targetColumn="shortName"
            chartTitle = "Collections"
            legendName = "Name of collection"
          />
      )}


        {currentPage === "Line" && <LineChartBuilder />}
        {currentPage === "Donut" && <DonutChartBuilder />}
        {currentPage === "ExpandableTable" && <Report2CollectionsExpanded />}

        
        {currentPage === "DataGrid" && <Report2AveragesPerCode />}
      </div>
    </div>
  );
};

export default DashboardTab;
