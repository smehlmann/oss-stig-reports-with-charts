import React from 'react';
import { useFilter } from '../FilterContext';
import { Box, Chip, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { useTheme } from "../theme";

const FilterBar = () => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter  } = useFilter();
  const theme = useTheme();

  const handleRemoveFilter = (key) => {
    removeFilterKey(key);
  };


  // if (Object.keys(filter).length === 0) {
  //   return null;
  // }

  /*
  */

  return (
    <Box 
      display="flex" justifyContent="space-between" alignItems="center"
    >
      <Box component="span" marginRight="8px" sx={theme.typography.h5} >
        Filters:
      </Box>
      {Object.keys(filter).map((key) => (
        <Chip
          key={key}
          label={key}
          onDelete={() => handleRemoveFilter(key)}
          style={{ marginRight: '12px',  }}
        />
      ))}
      <Button color="primary" variant="contained" onClick={clearFilter}>
        Clear Filters
      </Button>

      {/* contains switch */}
      <FormControlLabel
        control={
          <Switch 
            color="secondary" 
            checked = {isWebOrDBIncluded}
            onChange = {(event) => toggleWebOrDBFilter(event.target.checked)}
          />
        }
        label="Include DB/Web"
        labelPlacement="start"
        sx={{marginLeft: 'auto'}}
      />
    </Box>
  );
};

export default FilterBar;