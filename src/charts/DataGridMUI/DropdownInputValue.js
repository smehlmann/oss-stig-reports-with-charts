import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFilter } from '../../FilterContext';


function DropdownInputValue(props) {
  const { item, applyValue, focusElementRef } = props;
  //get the updateFilter function from the FilterContext
  const { updateFilter } = useFilter(); 

  const handleChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  // const handleChange = (event) => {
  //   const newValue = event.target.value;
  //   applyValue({ ...item, value: event.target.newValue });
  //   //update FilterContext with the new filter value
  //   console.log("newValue: ", newValue);
  //   updateFilter({ [item.field]: newValue });
  // };

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
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="0.25">25</MenuItem>
        <MenuItem value="0.50">50</MenuItem>
        <MenuItem value="0.75">75</MenuItem>
        <MenuItem value="1">100</MenuItem>
      </Select>
    </FormControl>
  );
}

export default DropdownInputValue;


  // const StyledFormControl = styled(FormControl)({
  //   marginTop: 0,
  //   marginBottom: 0,
  //   minWidth: 120,
  //   '& .MuiInputLabel-root': {
  //     fontSize: '0.875rem',
  //     marginTop: '0px', // Ensure label is vertically aligned
  //   },
  //   '& .MuiSelect-root': {
  //     fontSize: '0.875rem',
  //     padding: '8px 12px',
  //   },
  //   '& .MuiInputBase-root': {
  //     padding: '0',
  //     height: 'auto',
  //   },
  //   '& .MuiSelect-select': {
  //     padding: '8px 12px', // Adjust padding to match
  //   },
  //   '& .MuiInput-underline:before': {
  //     borderBottom: '1px solid rgba(0, 0, 0, 0.42)', // Match underline style
  //   },
  //   '& .MuiInput-underline:after': {
  //     borderBottom: '2px solid #1976d2', // Match active underline style
  //   },
  // });