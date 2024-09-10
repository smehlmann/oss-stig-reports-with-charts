import React from 'react';
import { Box, Autocomplete, TextField, Checkbox, ListItemText } from '@mui/material';
import { styled, alpha } from "@mui/system";

//styling for how it will appear
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    borderRadius: '10px',
    border: '2px solid #b2bbff',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // height:'45px',
    padding: '2px 8px',
    boxShadow: 'none', // Initial state without shadow
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary,
      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`, // Shadow on hover
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`, // Shadow on focus
    },
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: theme.palette.primary.main,
  },
  '& .MuiAutocomplete-paper': {
    maxHeight: '300px', // Adjust this value as needed
    overflowY: 'auto',
  },
}));


const SelectionDropdownList = ({targetProperty, selectedOptions, valueOptions, clearSelections, onChange }) => {

  // Add "Select All" option to valueOptions
  const optionsWithSelectAll = ['Select All', ...valueOptions];

  //reset the selected options when clearSelections prop changes
  React.useEffect(() => {
  if (clearSelections) {
    onChange([], targetProperty); // Clear selected options
  }
}, [clearSelections, onChange, targetProperty]);


  //when the selected options changes (ie new value is added or removed)
  const handleOptionSelected = (event, newValue) => {
    //select everything
   if (newValue.includes('Select All')) {
   onChange(valueOptions, targetProperty);
   }
   else {
    onChange(newValue, targetProperty);
   }
  };

  return (
    <Box display="inline-block" 
      minWidth='200px' 
      maxWidth='100%' 
      width='100%'
    >
      <CustomAutocomplete
        multiple
        value={selectedOptions}
        onChange={handleOptionSelected}
        options={optionsWithSelectAll}
        disableCloseOnSelect
        getOptionLabel={(option) => option || ''}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              checked={selected}
              style={{ marginRight: 8 }}
            />
            <ListItemText primary={option} />
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              style: { 
                color: selectedOptions ? 'black' : 'grey' }, // Change the color based on selection
            }}
            sx={{
              borderRadius: '10px',
              display: 'block',
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option === value}
        noOptionsText="No options"
      />
    </Box>
  );
};
export default SelectionDropdownList;




