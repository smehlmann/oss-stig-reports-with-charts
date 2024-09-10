import React, { useState, useCallback} from 'react';
import { Box, Button, IconButton, Divider, Typography, Chip, Drawer } from '@mui/material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { useFilter } from '../../FilterContext';
import { useTheme } from '@mui/system';
import SelectionDropdownList from '../SelectionDropdownList';
import { FilterSwitch } from './FilterSwitch';

/*
The filter drawer that appears to users. 


*/


const FilterSelectionDrawer = ({ data = [] }) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter, updateFilter } = useFilter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //clears all selections made in dropdown lists
  const [clearDropdownSelectionsTrigger, setClearSelectionsTrigger] = useState(false);


  const theme = useTheme();


  // Local state to temporarily hold the selected filters before selecting "Apply"
  const [tempFilter, setTempFilter] = useState({
    sysAdmin: [],
    primOwner: [],
    isWebOrDBIncluded: isWebOrDBIncluded
  });


  //drawer or sidemenu is open
  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  //clears all items from filter and all chips from dropdown lists
  const handleClearAll = () => {
    clearFilter();
    setClearSelectionsTrigger(!clearDropdownSelectionsTrigger);
    setTempFilter({ sysAdmin: [], primOwner: [], isWebOrDBIncluded: true });
    handleApplyFilters();
  };

  // Update temporary filter state when a dropdown is changed
  const handleTempFilterChange = (newValue, key) => {
    setTempFilter((prev) => ({ ...prev, [key]: newValue }));
  };


  //when "Applied" button is selected (update global filter with selections)
  // When the apply button is clicked, apply the temp filters to the global filter
  const handleApplyFilters = () => {

    // console.log("Applying Filters:", {
    //   sysAdmin: tempFilter.sysAdmin,
    //   primOwner: tempFilter.primOwner,
    //   isWebOrDBIncluded: tempFilter.isWebOrDBIncluded
    // });
    

    console.log("sysAdmin: ",tempFilter.sysAdmin)

    //add filters ONLY if they have non-empty values
    if(tempFilter.sysAdmin.length > 0) {
      if (Array.isArray(tempFilter.sysAdmin)) {
        updateFilter({sysAdmin: tempFilter.sysAdmin});
      }
      else { updateFilter({sysAdmin: tempFilter.sysAdmin[0]})}
    }
    if(tempFilter.primOwner.length> 0) {
      updateFilter({primOwner: tempFilter.primOwner});

    }


    
    toggleWebOrDBFilter(tempFilter.isWebOrDBIncluded);
    setIsDrawerOpen(false); // Close the drawer after applying
  };

  //formats labels for chips
  const getChipLabel = useCallback(
    (label) => {
      switch (label) {
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
        case 'acronym':
          return 'eMASS Acronym';
        case 'benchmarkId':
          return 'STIG Benchmark';
        case 'latestRev':
          return 'Latest Revision';
        default:
          return '';
      }
    },
    []
  );

  //checks and handles if data is undefined
  if (!Array.isArray(data)) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <Typography variant='h6' color='error'>
          Error: Unable to load filters. Please try again.
        </Typography>
      </Box>
    );
  }

  //gets list of options for sysAdmins and primOwners
  const sysAdminsList = [...new Set(data.map((item) => item.sysAdmin).filter((sysAdmin) => sysAdmin != null))];
  const primOwnersList = [...new Set(data.map((item) => item.primOwner).filter((primOwner) => primOwner != null))];

  return (
    <>
      {/* Button to open Drawer */}
      <Box display='flex' justifyContent='flex-end' sx={theme.typography.button}>
        <Button
          variant='contained'
          color='primary'
          startIcon={<FilterAlt />}
          onClick={handleOpenDrawer}
          sx={{ boxShadow: theme.shadows[3] }}
        >
          <Typography variant='h5'>Filter</Typography>
        </Button>
      </Box>

  
      <Drawer
        anchor='right'
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
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box sx={theme.typography.h3}>Filters</Box>
          <IconButton size='small' onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Toggle Web/DB Assets */}
        <Box display='flex' justifyContent='space-between' sx={{ mt: 1, mb: 2, alignItems: 'center' }}>
          <Box sx={theme.typography.h5}>Include DB/Web</Box>
          <FilterSwitch
            checked={isWebOrDBIncluded}
            onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
            sx={{ marginLeft: 'auto' }}
            color='primary'
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Chips to show when filter is applied */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={theme.typography.h5}>Applied Filters</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
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
              <Typography variant='body2'>No filters applied</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Filter by sysAdmin */}
        <Box
          display='flex'
          sx={{ flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}
        >
          <Box sx={theme.typography.h5}>System Admin</Box>
          <SelectionDropdownList
            targetProperty='sysAdmin'
            valueOptions={sysAdminsList}
            selectedOptions={tempFilter.sysAdmin}
            clearSelections={clearDropdownSelectionsTrigger}
            onChange={handleTempFilterChange}
            multiSelect // Enabling multi-select
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Filter by primOwner */}
        <Box
          display='flex'
          sx={{ flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}
        >
          <Box sx={theme.typography.h5}>Primary Owner</Box>
          <SelectionDropdownList
            targetProperty='primOwner'
            valueOptions={primOwnersList}
            clearSelections={clearDropdownSelectionsTrigger}
            selectedOptions={tempFilter.primOwner}
            onChange={handleTempFilterChange}
            multiSelect // Enabling multi-select
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Clears all filters*/}
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleClearAll} sx={{ backgroundColor: theme.palette.primary.light}}>
            Clear All
          </Button>
          <Button variant="contained" onClick={handleApplyFilters} sx={{ backgroundColor: theme.palette.primary.dark}}>
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default FilterSelectionDrawer;
