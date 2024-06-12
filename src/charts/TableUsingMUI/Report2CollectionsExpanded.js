import React, { useState, useEffect } from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

//format sysAdmin and primOwner to remove quotation marks
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

function Report2CollectionsExpanded({ data }) {
  const [parentRows, setParentRows] = useState([]);
  
  // console.log("Type of data in Expanded Table:", typeof data);
  // console.log("Is data an array?", Array.isArray(data));
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
      const dataGroupedByShortName = data.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.shortName]) {
          accumulator[currentValue.shortName] = [];
        }
        accumulator[currentValue.shortName].push({
          asset: currentValue.asset,
          sysAdmin: formatString(currentValue.sysAdmin),
          primOwner: formatString(currentValue.primOwner)
        });
        return accumulator;
      }, {});

      const parentRows = Object.entries(dataGroupedByShortName).map(([shortName, childRows]) => ({
        shortName,
        childRows
      }));
      setParentRows(parentRows);
      } else { console.error("Data is not array or empty: ", data)}
    }catch (error) {
      console.error("error occurred in Expanded Report: ", error);
    }
  }, [data]);

  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    const filteredChildRows = parentRow.childRows.filter(
      (childRow) => 
        // childRow.sysAdmin !== null && 
        // childRow.primOwner !== null && 
        // childRow.sysAdmin !== "" && 
        // childRow.primOwner !== "" &&
        (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
        childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
        childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()))
    );

    if (filteredChildRows.length === 0) {
      return null;
    }

    const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="child table">
          <TableHead>
            <TableRow sx={{ width: '34%'}}>
              <TableCell >Asset</TableCell>
              <TableCell >Sys Admin</TableCell>
              <TableCell >Primary Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
              <TableRow key={index} className="child-row">
                <TableCell>{childRow.asset}</TableCell>
                <TableCell>{childRow.sysAdmin}</TableCell>
                <TableCell>{childRow.primOwner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };

  const columnHeaders = [
    { id: 'shortName', label: 'Collections' }
  ];

  return (
    <ExpandableTableBuilder rows={parentRows} columns={columnHeaders} renderChildRow={renderChildRow} />
  );
}

export default Report2CollectionsExpanded;


// import React, { useState, useEffect } from "react";
// import ExpandableTableBuilder from "./ExpandableTableBuilder";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Box from '@mui/material/Box';
// import { fetchData } from '../DataExtractor';

// function Report2CollectionsExpanded() {
//   const [csvData, setData] = useState([]);
//   const [parentRows, setParentRows] = useState([]);

//   useEffect(() => {
//     const fetchCsvData = async () => {
//       try {
//         const csvData = await fetchData();
//         setData(csvData);

//         const dataGroupedByShortName = csvData.reduce((accumulator, currentValue) => {
//           if (!accumulator[currentValue.shortName]) {
//             accumulator[currentValue.shortName] = [];
//           }
//           accumulator[currentValue.shortName].push({
//             asset: currentValue.asset,
//             sysAdmin: currentValue.sysAdmin,
//             primOwner: currentValue.primOwner
//           });
//           return accumulator;
//         }, {});

//         const parentRows = Object.entries(dataGroupedByShortName).map(([shortName, childRows]) => ({
//           shortName,
//           childRows
//         }));
//         setParentRows(parentRows);
//       } catch (error) {
//         console.error('Error fetching CSV data:', error);
//       }
//     };
//     fetchCsvData();
//   }, []);

//   const renderChildRow = (parentRow) => {
//     const filteredChildRows = parentRow.childRows.filter(
//       (childRow) => childRow.sysAdmin !== null && childRow.primOwner !== null && childRow.sysAdmin !== "" && childRow.primOwner !== ""
//     );

//     if (filteredChildRows.length === 0) {
//       return null;
//     }

//     return (
//       <Box sx={{ margin: 1 }}>
//         <Table size="small" aria-label="child table">
//           <TableHead>
//             <TableRow>
//               <TableCell className="subsection-header">Asset</TableCell>
//               <TableCell className="subsection-header">Sys Admin</TableCell>
//               <TableCell className="subsection-header">Primary Owner</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredChildRows.map((childRow, index) => (
//               <TableRow key={index} className="child-row">
//                 <TableCell>{childRow.asset}</TableCell>
//                 <TableCell>{childRow.sysAdmin}</TableCell>
//                 <TableCell>{childRow.primOwner}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>
//     );
//   };

//   const columnHeaders = [
//     { id: 'shortName', label: 'Short Name' }
//   ];

//   return (
//     <div className="table-container">
//       <ExpandableTableBuilder rows={parentRows} columns={columnHeaders} renderChildRow={renderChildRow} />
//     </div>
//   );
// }

// export default Report2CollectionsExpanded;
