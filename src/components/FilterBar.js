import React from 'react';
import { useFilter } from '../FilterContext';
import { Box, Chip, Button, Switch, FormControlLabel } from '@mui/material';
import { useTheme } from "../theme";
import SearchDropdownFilterList from './SearchDropdownFilterList';

const FilterBar = ({data}) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter  } = useFilter();
  const theme = useTheme();

  const handleRemoveFilter = (key) => {
    removeFilterKey(key);
  };


  
  // if (Object.keys(filter).length === 0) {
  //   return null;
  // }

  const uniqueSysAdmins = [...new Set(data.map(item => item.sysAdmin).filter(sysAdmin => sysAdmin != null))];;

  // const uniqueSysAdmins = data.map(item => item.sysAdmin);
  // console.log(uniqueSysAdmins);

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      // alignItems="stretch"  // Ensure children take full height
      sx={{gap: 2, backgroundColor: '#a931a3' }}
    >
      {/* Container for filter chips and clear button */}
      <Box component='span' 
        display="flex" 
        alignItems="center"
        sx={{padding: '10px'  }}
      >
        <Box component="span" marginRight="8px" sx={theme.typography.h5}>
          Filters:
        </Box>
        {Object.keys(filter).map((key) => (
          <Chip
            key={key}
            label={key}
            onDelete={() => handleRemoveFilter(key)}
            style={{ marginRight: '12px' }}
          />
        ))}
        <Button 
          color="primary" 
          variant="contained" 
          onClick={clearFilter}
          sx={{ 
            height: '100%',  // Make the button take full height
            display: 'flex',
            position: 'relative',
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Dropdown for SysAdmins */}
      <Box sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='sysAdmin' valueOptions={uniqueSysAdmins} />
      </Box>


      {/* Switch for DB/Web inclusion */}
      
      <FormControlLabel
        control={
          <Switch 
            color="primary" 
            checked = {isWebOrDBIncluded}
            onChange = {(event) => toggleWebOrDBFilter(event.target.checked)}
          />
        }
        label="Include DB/Web"
        labelPlacement="start"
        sx={{
          marginLeft: 'auto',
          fontSize: 'theme.typography.h3.fontSize' 
        }}
      />

    </Box>
  );
};

export default FilterBar;