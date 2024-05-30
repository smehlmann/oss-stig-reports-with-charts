import "../../Charts.css";
import "./DashboardTab.css";
//import useLocalStorageListener from "../useLocalStorageListener";

import Report2CodeBreakdown from '../../charts/BarCharts/Report2CodeBreakdown';
import PieChartBuilder from "../../charts/PieChartBuilder";
import LineChartBuilder from "../../charts/LineChartBuilder";
import DonutChartBuilder from "../../charts/DonutChartBuilder";
import Report2CollectionsExpanded from "../../charts/TableUsingMUI/Report2CollectionsExpanded";
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";

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
      <button onClick={() => setCurrentPage("Bar")}>Code Bar</button>
      <button onClick={() => setCurrentPage("Pie")}>Code Pie</button>
      <button onClick={() => setCurrentPage("Line")}>Line</button>
      <button onClick={() => setCurrentPage("Donut")}>Donut</button>
      <button onClick={() => setCurrentPage("ExpandableTable")}>
        Expandable Table
      </button>
      <button onClick={() => setCurrentPage("DataGrid")}>Data Grid</button>

      <div className="chart-container">
        {currentPage === "Bar" && <Report2CodeBreakdown />}
        {currentPage === "Pie" && <PieChartBuilder />}
        {currentPage === "Line" && <LineChartBuilder />}
        {currentPage === "Donut" && <DonutChartBuilder />}
        {currentPage === "ExpandableTable" && <Report2CollectionsExpanded />}
        {currentPage === "DataGrid" && <Report2AveragesPerCode />}
      </div>
    </div>
  );
};

export default DashboardTab;
