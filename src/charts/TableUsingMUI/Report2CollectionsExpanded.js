import React, { useState, useEffect } from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

//format sysAdmin and primOwner to remove quotation marks
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};


function Report2CollectionsExpanded({ data }) {
  const [parentRows, setParentRows] = useState([]);
  const theme = useTheme();
  //checks if data is array of objects. If so, groyup by 'shortName' property.
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

      //parentRows display 'shortName' value, and childRows are content for each 'shortName' value
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

  //code responsible forcreating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    const filteredChildRows = parentRow.childRows.filter(
      (childRow) => 
        // childRow.sysAdmin !== null && 
        // childRow.primOwner !== null && 
        // childRow.sysAdmin !== "" && 
        // childRow.primOwner !== "" &&
        
        //set to lowercase for searchability 
        (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
        childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
        childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()))
    );

    if (filteredChildRows.length === 0) {
      return null;
    }

    const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    console.log("child rows: ", displayedRows);

    const StyledTableHead = styled(TableHead)(({ theme }) => ({
      // borderLeft: "20px solid #f5f5f5",
      // backgroundColor: '#bcbbf4',
      backgroundColor: theme.palette.secondary.light,
      border: 'none',
      display: 'flex',
      alignItems: 'left',
    }));

    const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
      fontSize: '24px',
      fontWeight: 'bold',
      border: 'none', 
    }));
    
    
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      padding: '8px',
      textAlign: 'left',
      border: `1px solid ${theme.palette.divider}`,
      overflow: 'auto',
      whiteSpace: 'normal',
      maxWidth: '33%',
      wordBreak: 'break-all',
      flex: '1'
    }));
    
    const StyledTableContainer = styled(Paper)(({ theme }) => ({
      width: "100%",
      flex: '1',
      maxWidth: "100%",
      // border: 'none', 
      border: "1px solid #e0e0e0",
      margin: "0 auto",
      overflowX: "inherit",
      borderRadius: '8px',
    }));
    
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
      "&:first-of-type": {
        border: 'none', // Remove border from the first row (header row)
      },
      "&.child-row": {
        border: 'none', // Remove border from the expanded cell row
      }
    }));

    

    return (
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="child table">
          <TableHead sx={{ border: 'none'}}>
            <TableRow sx={{ width: '34%',   backgroundColor: '#bcbbf4',}}>
              <TableCell>Asset</TableCell>
              <TableCell >Sys Admin</TableCell>
              <TableCell >Primary Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
              <StyledTableRow key={index} className="child-row">
                <StyledTableCell>{childRow.asset}</StyledTableCell>
                <StyledTableCell>{childRow.sysAdmin}</StyledTableCell>
                <StyledTableCell>{childRow.primOwner}</StyledTableCell>
              </StyledTableRow>
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
