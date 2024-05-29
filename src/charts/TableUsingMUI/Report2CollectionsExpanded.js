//Uses MaterialUI Table 
import React, { useMemo, useState, useEffect } from "react";
import ExpandableTableBuilder from "./ExpandableTableBuilder";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { fetchData } from '../DataExtractor';

function Report2CollectionsExpanded() {
  const [csvData, setData] = useState([]);
  const [parentRows, setParentRows] = useState([]);


  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        //extract data from csv using fetchData() 
        const csvData = await fetchData();
        setData(csvData);

        //group all the data by its corresponding code
        //accumulator: an object with key-value pairs ->'code' quantity: [data corresponding to specified code quantity]
        const dataGroupedByShortName = csvData.reduce((accumulator, currentValue) => {
          //if the currentValue's 'shortName' entry is not a key in accumulator
          if (!accumulator[currentValue.shortName]) {
            //add currentValue's 'shortName' to all keys in accumulator w/ empty array for key's values
            accumulator[currentValue.shortName] = [];
          }
          //when currentValue's 'shortName' entry is key in accumulator, add currentValue (or currentItem) to array of values
          accumulator[currentValue.shortName].push({
            asset: currentValue.asset,
            sysAdmin: currentValue.sysAdmin,
            primOwner: currentValue.primOwner
          });

          //return accumulator when items in csvData have been seen
          return accumulator;
        }, {}); //second argument: initial value which is an empty object (or dictionary)

        // Convert grouped data to an array of objects
        const parentRows = Object.entries(dataGroupedByShortName).map(([shortName, childRows]) => ({
          shortName,
          childRows
        }));
        console.log(parentRows)
        setParentRows(parentRows)
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };
    fetchCsvData();
  }, []); // Fetch data on component mount




  //function to render child rows for each parent row
  const renderChildRow = (parentRow) => {
    // Filter childRows based on your condition
    const filteredChildRows = parentRow.childRows.filter(
      (childRow) => childRow.sysAdmin !== null && childRow.primOwner !== null && childRow.sysAdmin !== "" && childRow.primOwner !== ""
    );

    // Check if there are any filtered childRows to render
    if (filteredChildRows.length === 0) {
      return null; // Don't render anything if no childRows match the condition
    }

    return (
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="child table">
          <TableHead>
            <TableRow>
              <TableCell className="subsection-header">Asset</TableCell>
              <TableCell className="subsection-header">Sys Admin</TableCell>
              <TableCell className="subsection-header">Primary Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChildRows.map((childRow, index) => (
              <TableRow key={childRow.index} className="child-row">
                <TableCell >{childRow.asset}</TableCell>
                <TableCell >{childRow.sysAdmin}</TableCell>
                <TableCell >{childRow.primOwner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };



  console.log(renderChildRow);

  // Define column headers
  const columnHeaders = [
    { id: 'shortName', label: 'Short Name' }
  ];
  return (
    <div className="table-container">
      <ExpandableTableBuilder rows={parentRows} columns={columnHeaders} renderChildRow={renderChildRow} />
    </div>
  );
}

export default Report2CollectionsExpanded;
