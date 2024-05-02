import '../../Charts.css';
import './DashboardTab.css';
import BarChartBuilder from '../../charts/BarChartBuilder';
import PieChartBuilder from '../../charts/PieChartBuilder';
import LineChartBuilder from '../../charts/LineChartBuilder';
import DonutChartBuilder from '../../charts/DonutChartBuilder';
import ExpandableTableExample from '../../charts/TableUsingMUI/ExpandableTableExample'
import BasicTableExample from '../../charts/TableUsingMUI/BasicTableExample';
import DataGridExample from '../../charts/DataGridMUI/DataGridExample';

import React, { useState } from "react";


const DashboardTab = () => {

  //Switch chart type on page
  const [currentPage, setCurrentPage] = useState('chart');
  // const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="Charts">
      <button onClick={() => setCurrentPage('Bar')}>Code Bar</button>
      <button onClick={() => setCurrentPage('Pie')}>Code Pie</button>
      <button onClick={() => setCurrentPage('Line')}>Line</button>
      <button onClick={() => setCurrentPage('Donut')}>Donut</button>
      <button onClick={() => setCurrentPage('ExpandableTable')}>Expandable Table</button>
      <button onClick={() => setCurrentPage('BasicTableExample')}>Basic Table</button>
      <button onClick={() => setCurrentPage('DataGrid')}>Data Grid</button>


      {/* <button onClick={() => setCurrentPage('RenderTable')}>RenderTable</button> */}
      <div className="chart-container">
        {currentPage === 'Bar' && <BarChartBuilder />}
        {currentPage === 'Pie' && <PieChartBuilder />}
        {currentPage === 'Line' && <LineChartBuilder />}
        {currentPage === 'Donut' && <DonutChartBuilder />}
        {currentPage === 'ExpandableTable' && <ExpandableTableExample />}
        {currentPage === 'BasicTableExample' && <BasicTableExample />}
        {currentPage === 'DataGrid' && <DataGridExample />}

        {/* {currentPage === 'RenderTable' && <RenderTable />} */}
        {/* {(currentPage === 'ExpandableTable' || currentPage === 'BasicTableExample') && <RenderTable currentPage={currentPage} />}  */}
      </div>

    </div>
  );
}

export default DashboardTab;
