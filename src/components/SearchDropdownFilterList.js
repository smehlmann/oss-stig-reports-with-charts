import React, { useState, useEffect } from 'react';
import { Box, Autocomplete, TextField, Checkbox, ListItemText } from '@mui/material';
import { useFilter } from '../FilterContext';
import { styled, alpha } from "@mui/system";

const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    borderRadius: '10px',
    border: '2px solid #b2bbff',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    height:'45px',
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
}));


const SearchDropdownFilterList = ({targetProperty, label, valueOptions, clearSelections }) => {
  const { updateFilter, removeFilterKey } = useFilter();
  const [selectedOptions, setSelectedOption] = useState([]);

  //reset the selected options when clearSelections prop changes
  useEffect(() => {
    if (clearSelections) {
      setSelectedOption([]); //clear selected options from chips
    }
  }, [clearSelections]);

  //when content in search changes
  const handleSearchChange = (event, newValue) => {
    setSelectedOption(newValue);

    if (newValue.length > 0) {
      //only 1 item selected, add it as a single item to the filter
      if (newValue.length === 1) {
        updateFilter({ [targetProperty]: newValue[0] });
      } else {
        //when mult items selected, keep the array structure
        updateFilter({ [targetProperty]: newValue });
      }
    } else {
      // If no values are selected, remove the property from the filter
      removeFilterKey(targetProperty);
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
        onChange={handleSearchChange}
        options={valueOptions}
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
            placeholder= {label}
            // variant="filled"
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
export default SearchDropdownFilterList;




