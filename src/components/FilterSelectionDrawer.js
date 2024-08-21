import React, { useState, useCallback} from 'react';
import { Box, Button, IconButton, Divider, Typography, Chip, Switch, Drawer } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useFilter } from '../FilterContext';
import { useTheme } from '@mui/system';
import SearchDropdownFilterList from './SearchDropdownFilterList';

const FilterSelectionDrawer = ({data=[]}) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter } = useFilter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const theme = useTheme();

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getChipLabel = useCallback(
    (label) => {
      switch(label) {
        case 'shortName':
          return 'Package Name';
        case 'code':
          return 'Code';
        case 'sysAdmin':
          return 'System Admin';
        case 'primOwner':
          return 'Primary Owner';
        case 'emass':
          return 'eMASS';
        case 'collectionName':
          return 'Collection';
        
        default: 
          return '';
      }
    },
    ([]),
  );

  const sysAdminsList = [...new Set(data.map(item => item.sysAdmin).filter(sysAdmin => sysAdmin != null))];
 
  const primOwnersList = [...new Set(data.map(item => item.primOwner).filter(primOwner => primOwner != null))];

  return (
    <>
      {/* Button to open Drawer */}
      <Box 
        display='flex' 
        justifyContent='flex-end'
        sx={theme.typography.button}
      > 
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={handleOpenDrawer}
        >
         <Typography variant='h5'>Filter</Typography>
        </Button>
      </Box>
      
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: 300, // Set the width of the drawer
            padding: 2,
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          
          <Box sx={theme.typography.h3}>Filters</Box>
          <IconButton size="small" onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Toggle Web/DB Assets */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 1, mb:2, alignItems: 'center' }}>
          <Box sx={theme.typography.h5}>Include DB/Web</Box>
          <Switch
            checked={isWebOrDBIncluded}
            onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
            sx={{ marginLeft: 'auto' }}
            color="primary"
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Applied Filter Chips */}
        <Box
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          <Box sx={theme.typography.h5}>Applied Filters</Box>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              mt: 0.5 
            }}>
            {Object.keys(filter).length > 0 ? (
              Object.keys(filter).map((key) => (
                <Chip
                  key={key}
                  color='primary'
                  label={getChipLabel(key)}
                  onDelete={() => removeFilterKey(key)}
                />
              ))
            ) : (
              <Typography variant="body2">No filters applied</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />


        {/* Filter by sysAdmin*/}
        <Box display="flex"  
          sx={{ 
            flexWrap: 'wrap', 
            gap: 1, 
            mt: 2,
            mb: 2,
          }}
        >
          <Box sx={theme.typography.h5}>System Admin</Box>
          <SearchDropdownFilterList 
            targetProperty='sysAdmin' 
            label='Select System Admin' 
            valueOptions={sysAdminsList} 
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Filter by primOwner*/}
        <Box display="flex"  
          sx={{ 
            flexWrap: 'wrap', 
            gap: 1,
            mt: 2,
            mb: 2,
          }}
        >
          <Box sx={theme.typography.h5}>Primary Owner</Box>
          <SearchDropdownFilterList 
            targetProperty='primOwner' 
            label='Select Primary Owner' 
            valueOptions={primOwnersList} 
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          onClick={clearFilter}
         
          sx={{backgroundColor: theme.palette.primary.dark,  height: '5%'}}
        >
          Clear All
        </Button>
      </Drawer>
    </>
  );
};

export default FilterSelectionDrawer;
