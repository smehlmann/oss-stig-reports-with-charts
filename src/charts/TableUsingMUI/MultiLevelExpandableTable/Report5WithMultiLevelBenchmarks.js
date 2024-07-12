import React, { useState, useEffect } from "react";
import MultiLevelTableBuilder from "./MultiLevelTableBuilder.js";
import TableBody from '@mui/material/TableBody';
import { useFilter } from '../../../FilterContext.js';
import {useTheme} from "../../../theme.js"
// import { useTheme } from '@mui/material/styles';
import {
  StyledTable,
  StyledChildTableContainer,
  ExpandedTableHead,
  ExpandedFirstLevelHeaderCell,
} from '../StyledTableComponents.js';
import NestedSecondLevelChildRow from "./NestedSecondLevelChildRow.js"

//remove quotation marks around strings
const formatString = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
  }
  return value;
};

function Report5WithMultiLevelBenchmarks({ data }) {
  const theme = useTheme();
  const { updateFilter, clearFilter} = useFilter();
  const [searchText, setSearchText] = useState("");
  // const percentageFormatterObject = useMemo(() => getPercentageFormatterObject(), []);
  const [parentRows, setParentRows] = useState([]); //parentRows = actual variable that holds state, and setParentRows=updates state variable based on action.


  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      //iterate over each entry in data (accumulator is obj holding key: [val1, val2..,])
      const dataGroupedByShortName = data.reduce((accumulator, currentValue) => {
  
        //if "shortname" == "NCCM", uses "nccm" prop value instead
        const shortName = currentValue.shortName === "NCCM" ? currentValue.nccm || "NCCM" : currentValue.shortName;
  
        //if "shortName" in accumulator does not already have values yet, create array to contain vals.
        if (!accumulator[shortName]) {
          accumulator[shortName] = [];
        }
  
        //push obj into array with associated 'shortName' and its associated properties.(ie. {NCCM-W: [asset, sysAdmin,primOwner, accepted, benchmarks]} )
        accumulator[shortName].push({
          asset: currentValue.asset,
          sysAdmin: formatString(currentValue.sysAdmin),
          primOwner: formatString(currentValue.primOwner),
          accepted: currentValue.accepted,
          benchmarks: currentValue.benchmarks
        });
        
        console.log("accumulator before parentRows: ", accumulator);
        return accumulator;
      }, {});
  
      // Transform the grouped data into parentRows
      const parentRows = Object.entries(dataGroupedByShortName).map(([shortName, records]) => {
        return {
          shortName,
          childRows: records.map(record => ({
            asset: record.asset,
            sysAdmin: formatString(record.sysAdmin),
            primOwner: formatString(record.primOwner),
            accepted: record.accepted,
            benchmarks: record.benchmarks
          }))
        };
      });
  
      console.log(parentRows);
      setParentRows(parentRows);
    } else {
      console.error("Data is not an array or is empty: ", data);
    }
  }, [data]);
 
 
  /*
  //checks if data is array of objects. If so, group by 'shortName' property.
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
      const dataGroupedByShortName = data.reduce((accumulator, currentValue) => {
        //the accumulator is an object whose properties (or keys) the values for shortName
        if (!accumulator[currentValue.shortName]) {
          accumulator[currentValue.shortName] = [];  //each property is assigned empty array  
        }  //ie. accumulator = {'B3COI': [], 'NCCM':[]...}
        //populates the empty array associated with a given key
        accumulator[currentValue.shortName].push({
          asset: currentValue.asset,
          sysAdmin: formatString(currentValue.sysAdmin),
          primOwner: formatString(currentValue.primOwner),
          accepted: currentValue.accepted,
          benchmarks: currentValue.benchmarks
        });
        //ie. accumulator:{"B3COI": [{asset: val1, sysAdmin: val2, primOwner: val3, accepted: val4}, {..}], 'NCCM'...}
        return accumulator;
      }, {});

      //parentRows is an array of objects where each object has 2 properties (or keys): shortName and childRows. shortName is what everything is grouped by, and the childRows are an array of objects {asset:__, sysAdmin:__, primOwner:__, accepted:__} associated with the shortName value. 
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
*/

  //code responsible for creating childRows in expanded section
  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
    //filter child rows based on text in searchbar
    const filteredChildRows = parentRow.childRows.filter((childRow) => 
      //set to lowercase for searchability 
      (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
      childRow.accepted.toString().includes(searchText)
      )
    );

    if (filteredChildRows.length === 0) {
      return null;
    }

    const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <StyledChildTableContainer sx={{ margin: 1 }}>
        <StyledTable size="small" aria-label="child table">
          <ExpandedTableHead sx={{ border: 'none', backgroundColor: theme.palette.secondary.main}}>
             
            <ExpandedFirstLevelHeaderCell>Asset</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Sys Admin</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Primary Owner</ExpandedFirstLevelHeaderCell>
            <ExpandedFirstLevelHeaderCell >Accepted %</ExpandedFirstLevelHeaderCell>
          </ExpandedTableHead>
          <TableBody>
            {displayedRows.map((childRow, index) => (
                <NestedSecondLevelChildRow key={index} childRow={childRow} />
              ))}
          </TableBody>
        </StyledTable>
      </StyledChildTableContainer>
    );
  };

  const mainColumnHeader = [
    { id: 'shortName', label: 'Packages' }
  ];

  return (
    <MultiLevelTableBuilder 
      rows={parentRows} 
      columns={mainColumnHeader} 
      renderChildRow={renderChildRow} 
      searchText={searchText}
      filterProperty="shortName"
      updateFilter={updateFilter}
      clearFilter={clearFilter}
    />
  );
}

export default Report5WithMultiLevelBenchmarks;


//  //code responsible for creating childRows in expanded section
//  const renderChildRow = (parentRow, page, rowsPerPage, searchText ) => {
//   const filteredChildRows = parentRow.childRows.filter(
//     (childRow) => 

//     //set to lowercase for searchability 
//     (childRow.asset.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.sysAdmin.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.primOwner.toLowerCase().includes(searchText.toLowerCase()) ||
//     childRow.accepted.toString().includes(searchText)
//     )
//   );

//   if (filteredChildRows.length === 0) {
//     return null;
//   }

//   const displayedRows = filteredChildRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   //update state with filtered dat

//   return (
//     <StyledChildTableContainer sx={{ margin: 1 }}>
//       <StyledTable size="small" aria-label="child table">
//         <ExpandedTableHead sx={{ border: 'none'}}>
//           <StyledTableRow>
//             <ExpandedHeaderCell>Asset</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Sys Admin</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Primary Owner</ExpandedHeaderCell>
//             <ExpandedHeaderCell >Accepted %</ExpandedHeaderCell>
//           </StyledTableRow>
//         </ExpandedTableHead>
//         {/* <TableBody>
//           {displayedRows.map((childRow, index) => (
//             <StyledTableRow key={index} className="child-row">
//               <ExpandedTableCell>{childRow.asset}</ExpandedTableCell>
//               <ExpandedTableCell>{childRow.sysAdmin}</ExpandedTableCell>
//               <ExpandedTableCell>{childRow.primOwner}</ExpandedTableCell>
//               <ExpandedTableCell>
//                 {percentageFormatterObject.formatter(childRow.accepted)}
//               </ExpandedTableCell>
//             </StyledTableRow>
//           ))}
//         </TableBody> */}
//         <TableBody>
//           {displayedRows.map((childRow, index) => (
//               <NestedChildRow key={index} childRow={childRow} />
//             ))}
//         </TableBody>
//       </StyledTable>
//     </StyledChildTableContainer>
//   );
// };