import React from 'react';
import { useFilter } from '../FilterContext';
import { Box, Chip, Button, Typography } from '@mui/material';

const FilterBar = () => {
  const { filter, clearFilter, removeFilterKey } = useFilter();

  const handleRemoveFilter = (key) => {
    removeFilterKey(key);
  };

  if (Object.keys(filter).length === 0) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" paddingBottom="8px" borderRadius="4px">
      <Typography variant="h6" component="span" marginRight="8px">
        Filters:
      </Typography>
      {Object.keys(filter).map((key) => (
        <Chip
          key={key}
          label={key}
          onDelete={() => handleRemoveFilter(key)}
          style={{ marginRight: '8px' }}
        />
      ))}
      <Button color="primary" onClick={clearFilter}>
        Clear filters
      </Button>
    </Box>
  );
};

export default FilterBar;