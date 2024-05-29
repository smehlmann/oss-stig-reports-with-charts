import '../../Charts.css';
import './DashboardTab.css';
import useLocalStorageListener from '../useLocalStorageListener';

import BarChartBuilder from '../../charts/BarCharts/BarChartBuilder';
import Report2ByCode from '../../charts/BarCharts/Report2ByCode';

import PieChartBuilder from '../../charts/PieChartBuilder';
import LineChartBuilder from '../../charts/LineChartBuilder';
import DonutChartBuilder from '../../charts/DonutChartBuilder';
import Report2CollectionsExpanded from '../../charts/TableUsingMUI/Report2CollectionsExpanded'
import Report2AveragesPerCode from "../../charts/DataGridMUI/Report2AveragesPerCode";
import React, { useState } from "react";

function DashboardTab() {

  //Switch chart type on page
  const [currentPage, setCurrentPage] = useState('chart');
  // const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const [reportData, setReportData] = useState(() => {
    return localStorage.getItem('ossStigReport') || '';
  });

  useLocalStorageListener((event) => {
    if (event.key === 'ossStigReport') {
      setReportData(event.newValue);
    }
  });
  
  /*const handlePageChange = (page) => {
    setCurrentPage(page);
  };*/

  return (
    <div className="Charts">
      <button onClick={() => setCurrentPage('Bar')}>Code Bar</button>
      <button onClick={() => setCurrentPage('BarEx')}>Code Bar Ex</button>
      <button onClick={() => setCurrentPage('Pie')}>Code Pie</button>
      <button onClick={() => setCurrentPage('Line')}>Line</button>
      <button onClick={() => setCurrentPage('Donut')}>Donut</button>
      <button onClick={() => setCurrentPage('ExpandableTable')}>Expandable Table</button>
      <button onClick={() => setCurrentPage('DataGrid')}>Data Grid</button>


      {/* <button onClick={() => setCurrentPage('RenderTable')}>RenderTable</button> */}
      <div className="chart-container">
        {currentPage === 'Bar' && <BarChartBuilder />}
        {currentPage === 'BarEx' && <BarChartBuilder />}
        {currentPage === 'Pie' && <PieChartBuilder />}
        {currentPage === 'Line' && <LineChartBuilder />}
        {currentPage === 'Donut' && <DonutChartBuilder />}
        {currentPage === 'ExpandableTable' && <Report2CollectionsExpanded />}
        {currentPage === 'DataGrid' && <Report2AveragesPerCode />}

  
      </div>

    </div>
  );
}

export { DashboardTab };
