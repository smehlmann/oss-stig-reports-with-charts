import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFilter } from '../../FilterContext';



/*
Function to create and style the dropdown filters in the MUI data grid. 

*/
function DropdownInputValue(props) {
  const { item, applyValue, focusElementRef } = props;
  //get the updateFilter function from the FilterContext
  const { updateFilter } = useFilter(); 

  const handleChange = (event) => {
    const filterValue = parseFloat(event.target.value);
    // const filterValue = parseFloat(event.target.value);

    const { field, operator } = item;

    //apply the value to the item (if necessary, depending on how applyValue works)
    applyValue({ ...item, value: filterValue });

    
    //extract lowercased 4th character (ie. avgAccepted ---> accepted)
    const transformedField = field.slice(3); // remove 'avg'
    const modifiedField = transformedField.charAt(0).toLowerCase() + transformedField.slice(1);

    // console.log(`item = ${modifiedField}: {value: ${filterValue}, operator: ${operator}}`);
    //update the filter context with the value being filtered by
    updateFilter({ [modifiedField]: filterValue}, 'dataGrid', operator);
  };



  return (
    <FormControl sx={{ 
      marginTop: 0, 
      marginBottom: 0, 
    }}>
      <InputLabel id="dropdown-input-label">Select Value</InputLabel>
      <Select
        labelId="dropdown-input-label"
        value={item.value || ''}
        onChange={handleChange}
        inputRef={focusElementRef}
        variant="standard" // Use "standard" for underline styling
        sx={{
          display: 'flex',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: '4.5px 0px',
          },
          '& .MuiInputBase-root': {
            padding: '0px 0px', // Adjust padding to align with MUI DataGrid
          },
          '& .MuiFormControl-root': {
            margin: 0,
          },
          '& .MuiInput-underline:before': {
            borderBottom: '1px solid', // Custom underline styling
            
          },
          '& .MuiInput-underline:after': {
            borderBottom: '2px solid', // Custom underline styling when focused
          },
        }}
      >
        <MenuItem value="0.25">25%</MenuItem>
        <MenuItem value="0.50">50%</MenuItem>
        <MenuItem value="0.75">75%</MenuItem>
        <MenuItem value="1">100%</MenuItem>
      </Select>
    </FormControl>
  );
}

export default DropdownInputValue;
