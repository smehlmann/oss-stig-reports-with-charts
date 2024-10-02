import React, { useState, useCallback} from 'react';
import { Box, Button, IconButton, Divider, Typography, Chip, Drawer } from '@mui/material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { useFilter } from '../../../FilterContext';
import { useTheme } from '@mui/system';
import SelectionDropdownList from '../../dropdowns/SelectionDropdownList';
import { FilterSwitch } from './FilterSwitch';

/*
The filter drawer that appears to users when "Filter" button is pressed, and allows users to filter visualizations.

This structure contains a switch to toggle on/off the presence Web/DB assets, a list to display what filters are currently applied, a multi-select dropdown list to select sysAdmin, a multi-select dropdown list to select primOwner, a "Clear All" button to clear ALL filters, and an "Apply" button to filter the data based selected.

We have 2 "filter" objects: 
  1. the global filter object that is responsible for syncing the data across all visualizations
  2. the local/temp filter that stores the key-value pairs, where each key is a property, before we select the "Apply" button. This lets the user select more than one option from the dropdown lists so that we can filter for more than one value. If we didn't have this, only 1 filter can be applied.

  When the "Apply" button is selected, all the contents of temp filter will be added to the global filter and applied to the dashboard.
*/


const FilterSelectionDrawer = ({ data = [] }) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter, updateFilter } = useFilter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //clears content in temporary filter and global filter when "clear all" button press
  const [clearDropdownSelectionsTrigger, setClearSelectionsTrigger] = useState(false);
  const theme = useTheme();


  // local state to temporarily hold the selected filters before selecting "Apply"
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
    setClearSelectionsTrigger(!clearDropdownSelectionsTrigger);
    setTempFilter({ sysAdmin: [], primOwner: [], isWebOrDBIncluded: true });
    clearFilter();
  };

  // Update temporary filter state when a dropdown is changed
  const handleTempFilterChange = (newValue, key) => {
    setTempFilter((prev) => ({ ...prev, [key]: newValue })); 
  };


  // When the apply button is clicked, apply the temp filters to the global filter
  const handleApplyFilters = () => {
    //add filters ONLY if they have non-empty values
    if(tempFilter.sysAdmin.length > 0) {
      updateFilter({sysAdmin: tempFilter.sysAdmin});
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
        case 'assessed':
          return 'Assessed Average';
        case 'submitted':
          return 'Submitted Average';
        case 'accepted':
          return 'Accepted Average';
        case 'rejected':
          return 'Rejected Average';
        default:
          return '';
      }
    },
    []
  );

  //checks and handles if data is undefined
  // if (!Array.isArray(data)) {
  //   return (
  //     <Box
  //       display='flex'
  //       justifyContent='center'
  //       alignItems='center'
  //       // height='100vh'
  //     >
  //       <Typography variant='h6' color='error'>
  //         Error: Unable to load filters. Please try again.
  //       </Typography>
  //     </Box>
  //   );
  // }

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

      {/* Drawer itself */}
      <Drawer
        anchor='right'
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: 350, // the width of the drawer
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
            onChange={handleTempFilterChange}
            selectAllOptionsFlag={true}
            limitNumOfTags={true}
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
            selectedOptions={tempFilter.primOwner}
            onChange={handleTempFilterChange}
            selectAllOptionsFlag={true}
            multiSelect // Enabling multi-select
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Clears all filters*/}
        <Box display="flex" justifyContent="space-between">
          <Button variant='outlined' onClick={handleClearAll}>
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
