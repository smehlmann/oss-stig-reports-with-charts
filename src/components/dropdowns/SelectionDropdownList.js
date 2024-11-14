import React from 'react';
import { Box, Autocomplete, TextField, Checkbox, ListItemText } from '@mui/material';
import { styled, alpha } from "@mui/system";


/*
Creates a multi-select dropdown menu. 
Includes:
source: determines if it should be styled to appear in the filter sidebar (filterDrawer) otherwise it will go with the default styling
target property: the property and values you search through
valueOptions: all the values for our given property
selectedOptions: the selection options user can choose from
onChange: function that determines the behavior based on the selection
selectAllOptionsFlag: determines if we include the "select all" option to selection options
limitNumOfTags: true/false determines if we limit the number of tags for selected options
*/

//styling for how it will appear
const MainAutoComplete = styled(Autocomplete)(({ theme }) => ({
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
    maxHeight: '300px', // adjust this value as needed
    overflowY: 'auto',
  },
  //adjust spacing between dropdown items
  '& .MuiAutocomplete-listbox': {
    padding: 0, //remove padding between list items
    
  },
  '& .MuiAutocomplete-option': {
    padding: '2px 4px', //adjust padding to make the items closer
    minHeight: 'auto', //can also reduce the height
    backgroundColor:'#8855ff',
  },
}));

const FilterDrawerAutoComplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    borderRadius: '10px',
    border: '2px solid #b2bbff',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: '2px 8px',
    boxShadow: 'none', // Initial state without shadow
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary,
      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`, // shadow on hover
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`, // shadow on focus
    },
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: theme.palette.primary.main,
  },
  '& .MuiAutocomplete-paper': { 
    maxHeight: '300px', // adjust this value as needed
    overflowY: 'auto',
  },
  //adjust spacing between dropdown items
  '& .MuiAutocomplete-listbox': {
    padding: 0, //remove padding between list items
    
  },
  '& .MuiAutocomplete-option': {
    padding: '2px 4px', //adjust padding to make the items closer
    minHeight: 'auto', //can also reduce the height
    backgroundColor:'#8855ff',
  },
}));


const SelectionDropdownList = ({source='', targetProperty, selectedOptions, valueOptions, onChange, selectAllOptionsFlag, limitNumOfTags}) => {

  // add "Select All" option based on selectAllOptionsFlag
  const optionsWithSelectAll = selectAllOptionsFlag 
    ? ['Select All', ...valueOptions] 
    : valueOptions;
  //when the selected options changes (ie new value is added or removed)
  const handleOptionSelected = (event, newValue) => {
    //select everything
   if (newValue.includes('Select All')) {
   onChange(valueOptions, targetProperty); //select all the values
   }
   else {
    onChange(newValue, targetProperty); //new set of selected value(s) after user selects or de-selects option
   }
  };

  const renderAutocompleteFromSource = () => 
  {
    if(source === 'filterDrawer') {
      return (
        <FilterDrawerAutoComplete
          multiple
          limitTags={limitNumOfTags ? 3 : undefined} //don't limit number of tags if false
          value={selectedOptions}
          onChange={handleOptionSelected}
          options={optionsWithSelectAll}
          disableCloseOnSelect
          getOptionLabel={(option) => option || ''}
          //render list of values to choose from
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                checked={selected}
                style={{ marginRight: 4 }}
              />
              <ListItemText primary={option} />
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                style: { 
                  color: selectedOptions ? 'black' : 'grey' },
              }}
              sx={{
                borderRadius: '10px',
                display: 'contents',
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          noOptionsText="No options"
        />
      );
    } else {
      return (
        <MainAutoComplete
          multiple
          limitTags={limitNumOfTags ? 3 : undefined} //don't limit number of tags if false
          value={selectedOptions}
          onChange={handleOptionSelected}
          options={optionsWithSelectAll}
          disableCloseOnSelect
          getOptionLabel={(option) => option || ''}
          //render list of values to choose from
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                checked={selected}
                style={{ marginRight: 4 }}
              />
              <ListItemText primary={option} />
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                style: { 
                  color: selectedOptions ? 'black' : 'grey' },
              }}
              sx={{
                borderRadius: '10px',
                display: 'contents',
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          noOptionsText="No options"
        />        
      );
    }
  };
  

  return (
    <Box display="inline-block" 
      minWidth='200px' 
      maxWidth='100%' 
      width='100%'
    >
      {renderAutocompleteFromSource()}
      
    
    </Box>
  );
};
export default SelectionDropdownList;




