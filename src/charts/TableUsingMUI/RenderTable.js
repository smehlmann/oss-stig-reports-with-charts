import React from "react";
import ExpandableTableExample from "./ExpandableTableExample";
import BasicTableExample from "./BasicTableExample";
// import TableEx from "./BasicTableExample";

function RenderTable({ currentPage }) {
  return (
    <div className="table-container">
      {currentPage === "ExpandableTable" && <ExpandableTableExample />}
      {/* {currentPage === "BasicTable" && <CreateBasicTable />} */}
      {currentPage === "BasicTableExample" && <BasicTableExample />}
    </div>
  );
}

export default RenderTable;
