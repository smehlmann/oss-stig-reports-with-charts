import React, { useState } from 'react';
import { Box, Autocomplete, TextField } from '@mui/material';
import { useFilter } from '../FilterContext';
import { styled, alpha } from "@mui/system";

const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    borderRadius: '10px',
    border: '2px solid #b2bbff',
    backgroundColor: '#ffffff',
    alignItems: 'center',
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


const SearchDropdownFilterList = ({targetProperty, options }) => {
  const {filter, updateFilter, removeFilterKey } = useFilter();
  const [selectedOption, setSelectedOption] = useState(null);

  //when content in search changes
  const handleSearchChange = (event, newValue) => {
    setSelectedOption(newValue);

    if (newValue) {
      //update the filter object with the selected val
      updateFilter({ [targetProperty]: newValue });
    } else {
      // if no val selected, remove from global filter
      removeFilterKey([targetProperty]);
    }
  };

  return (
    <Box display="inline-block" 
      minWidth='200px' 
      maxWidth='100%' 
      width='auto'
    >
      <CustomAutocomplete
        value={selectedOption}
        onChange={handleSearchChange}
        options={options}
        getOptionLabel={(option) => option || ''}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="System Admin"
            placeholder="System Admin"
            // variant="filled"
            InputLabelProps={{
              style: { 
                color: selectedOption ? 'black' : 'grey' }, // Change the color based on selection
            }}
            sx={{
              borderRadius: '10px'}}
          />
        )}
        isOptionEqualToValue={(option, value) => option === value}
        noOptionsText="No options"
      />
    </Box>
  );
};
export default SearchDropdownFilterList;

