import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Switch,
  Typography,
  Menu,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useFilter } from '../FilterContext'; // Adjust the import path as needed
import { useTheme } from "../theme";


/**
IN UI: When the button labeled 'FIlter' is selected, menu below will appear with filter options


 */

const FilterMenu = () => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter } = useFilter();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  return (
    <>
      {/* Button to open menu*/}
      <Box display='flex' justifyContent='flex-end'> 
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={handleClick}
          // sx={{ position: 'relative', top: 8, marginLeft:'auto'}} 
        >
          Filter
        </Button>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              padding: 1.5,
            },
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box  sx={theme.typography.h3}>Filters</Box>
          <IconButton size="small" onClick={handleCloseMenu}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Applied Filter Chips */}
        <Box sx={theme.typography.h5}>Applied Filters</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
          {Object.keys(filter).length > 0 ? (
            Object.keys(filter).map((key) => (
              <Chip
                key={key}
                label={key}
                onDelete={() => removeFilterKey(key)}
              />
            ))
          ) : (
            <Typography variant="body2">No filters applied</Typography>
          )}
        </Box>

        {/* Toggle Web/DB Assets */}
        <Box display="flex" justifyContent="space-between" sx={{mt: 2, alignItems:'center'}}>
          <Box sx={theme.typography.h5}>Include DB/Web</Box>
          <Switch
            checked={isWebOrDBIncluded}
            onChange = {(event) => toggleWebOrDBFilter(event.target.checked)}
            sx={{marginLeft: 'auto'}}
            color="primary"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={clearFilter}
        >
          Clear All
        </Button>
      </Menu>
    </>
  );
};

export default FilterMenu;
