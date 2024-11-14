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


const FilterSelectionDrawer = ({ data = [], source='' }) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter, updateFilter, isDelinquent } = useFilter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //clears content in temporary filter and global filter when "clear all" button press
  const [clearDropdownSelectionsTrigger, setClearSelectionsTrigger] = useState(false);
  const theme = useTheme();
  
  // local state to temporarily hold the selected filters before selecting "Apply"
  const [tempFilter, setTempFilter] = useState({
    sysAdmin: [],
    primOwner: [],
    emass: [],
    code: [],
    benchmarkId: [], 
    isWebOrDBIncluded: isWebOrDBIncluded,
    isDelinquent: isDelinquent
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
    setTempFilter({ 
      sysAdmin: [], 
      primOwner: [],
      emass: [],
      code: [],
      benchmarkId: [],
      isWebOrDBIncluded: true, 
      isDelinquent: false 
    });
    clearFilter();
  };

  // update temporary filter state when a dropdown is changed
  const handleTempFilterChange = (newValue, key) => {
    setTempFilter((prev) => ({ ...prev, [key]: newValue })); 
  };


  //when the apply button is clicked, apply the temp filters to the global filter
  const handleApplyFilters = () => {
    //add filters ONLY if they have non-empty values in dropdowns
    if(tempFilter.sysAdmin.length > 0) {
      updateFilter({sysAdmin: tempFilter.sysAdmin});
    }
    if(tempFilter.primOwner.length> 0) {
      updateFilter({primOwner: tempFilter.primOwner});
    }
    if(tempFilter.emass.length> 0) {
      updateFilter({emass: tempFilter.emass});
    }
    if(tempFilter.code.length> 0) {
      updateFilter({code: tempFilter.code});
    }
    if(tempFilter.benchmarkId.length> 0) {
      updateFilter({benchmarkId: tempFilter.benchmarkId});
    }
    //handle web/db assets 
    if(!tempFilter.isWebOrDBIncluded) {
      updateFilter({ cklWebOrDatabase: true })
    } else {
      removeFilterKey('cklWebOrDatabase');
    }

    //handle delinquent filtering 
    if (tempFilter.isDelinquent) {
      updateFilter({ delinquent: 'Yes' }); //only show delinquent entries
    } else {
      removeFilterKey('delinquent'); //show all entries (no delinquent filter)
    }
    setIsDrawerOpen(false); // close the drawer after applying
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
        case 'cklWebOrDatabase':
          return 'Web/Database';
        case 'benchmark':
          return 'STIG Benchmark';
        case 'delinquent':
          return 'Only Delinquents';
        default:
          return '';
      }
    },
    []
  );


 //gets list of options in dropdowns
  const sysAdminsList = [...new Set(data.map((item) => item.sysAdmin).filter((sysAdmin) => sysAdmin != null))];
  const primOwnersList = [...new Set(data.map((item) => item.primOwner).filter((primOwner) => primOwner != null))];
  const emassNumsList = [...new Set(
    data
    .map((item) => (item.emass !== undefined ? item.emass : null))
    .filter((emass) => emass != null)
  )];

  const codeList = [...new Set(
    data
    .map((item) => (item.code !== undefined ? item.code : null))
    .filter((code) => code != null)
  )];
  const benchmarkIdList = [... new Set(
    data
    .map((item) => (item.benchmarkId !== undefined ? item.benchmarkId : null))
    .filter((benchmarkId) => benchmarkId != null)
  )]



  const renderSideBar = () => {
    //if the source = 'report5' or 'report2'
    return (
      <>
        {/* button to open Drawer */}
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
  
        {/* drawer itself */}
        <Drawer
          anchor='right'
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: 350, // the width of the drawer
              padding: 2,
              overflow: 'scroll'
            },
          }}
        >
          {/* header */}
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box sx={theme.typography.h3}>Filters</Box>
            <IconButton size='small' onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
  
          <Divider  sx={{ my: 2, mb: 0 }} />
  
          {/* toggle Web/DB Assets */}
          <Box display='flex' justifyContent='space-between' sx={{ mt:1, mb: 1, alignItems: 'center' }}>
            <Box sx={theme.typography.h5}>Include DB/Web</Box>
            <FilterSwitch
              checked={isWebOrDBIncluded}
              onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
              sx={{ marginLeft: 'auto' }}
              color='primary'
            />
          </Box>
  
          <Divider />
  
          {/* toggle isDelinquent Assets */}
          <Box display='flex' justifyContent='space-between' sx={{ mt: 1, mb: 1, alignItems: 'center' }}>
            <Box sx={theme.typography.h5}>Show Only Delinquents</Box>
            <FilterSwitch
              checked={tempFilter.isDelinquent}
              onChange={(event) =>  handleTempFilterChange(event.target.checked, 'isDelinquent')}
              sx={{ marginLeft: 'auto' }}
              color='primary'
            />
          </Box>
  
          <Divider />
  
          {/* chips to show when filter is applied */}
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={theme.typography.h5}>Applied Filters</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, mb:0.5}}>
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
  
          <Divider />
  
          {/* filter by sysAdmin */}
          <Box
            display='flex'
            sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
          >
            <Box sx={theme.typography.h5}>System Admin</Box>
            <SelectionDropdownList
              targetProperty='sysAdmin'
              valueOptions={sysAdminsList}
              selectedOptions={tempFilter.sysAdmin}
              onChange={handleTempFilterChange}
              selectAllOptionsFlag={true}
              limitNumOfTags={true}
              multiSelect 
              source='filterDrawer'
            />
          </Box>
  
          <Divider sx={{ my: 1, mb: 0 }} />
  
          {/* filter by primOwner */}
          <Box
            display='flex'
            sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
          >
            <Box sx={theme.typography.h5}>Primary Owner</Box>
            <SelectionDropdownList
              targetProperty='primOwner'
              valueOptions={primOwnersList}
              selectedOptions={tempFilter.primOwner}
              onChange={handleTempFilterChange}
              selectAllOptionsFlag={true}
              multiSelect 
              source='filterDrawer'
            />
          </Box>

          <Divider sx={{ my: 1, mb: 0 }} />
          
          {/*emass numbers */}
          <Box
            display='flex'
            sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
          >
            <Box sx={theme.typography.h5}> 
              eMASS Number
            </Box>
            <SelectionDropdownList
              targetProperty="emass"
              valueOptions={emassNumsList}
              selectedOptions={tempFilter.emass}
              onChange={handleTempFilterChange}
              selectAllOptionsFlag={true}
              multiSelect 
              source='filterDrawer'
            />
          </Box>
   
          {source === "report4" && (
            <> {/*allows both elements to be grouped together under conditional rendering */}
              <Divider sx={{ my: 1, mb: 0 }} />
              <Box
                display='flex'
                sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
              >
                <Box sx={theme.typography.h5}> 
                  Benchmarks
                </Box>
                <SelectionDropdownList
                  targetProperty="benchmarkId"
                  valueOptions={benchmarkIdList}
                  selectedOptions={tempFilter.benchmarkId}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </Box>
            </>
          )}
  
          <Divider sx={{ my: 1, mb: 2 }} />
  
          {/* clears all filters*/}
          <Box display="flex" justifyContent="space-between" sx={{ mb: 2}}>
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



  return <>{renderSideBar()}</>;


 // // display an array of items
  
  // const ArrayPrinter = (items) => {
  //   return (
  //     <div>
  //       {items.map((item, index) => (
  //         <p key={index}> {item} </p>
  //       ))}
  //     </div>  
  //   )
  // };

  // return (
  //   <div> 
  //     <p>emass {ArrayPrinter(emassNumsList)} </p> <br />
  //     <p>code: {ArrayPrinter(codeList)} </p> <br />
  //     <p>benchmarks: {ArrayPrinter(benchmarkIdList)}</p>
    
  //   </div>
  // );


};

export default FilterSelectionDrawer;



  // const renderSideBar = () => {
  //   //if the source = 'report5' or 'report2'
  //   if(source === 'report5' || source === 'report14') {
  //     return (
  //       <>
  //         {/* button to open Drawer */}
  //         <Box display='flex' justifyContent='flex-end' sx={theme.typography.button}>
  //           <Button
  //             variant='contained'
  //             color='primary'
  //             startIcon={<FilterAlt />}
  //             onClick={handleOpenDrawer}
  //             sx={{ boxShadow: theme.shadows[3] }}
  //           >
  //             <Typography variant='h5'>Filter</Typography>
  //           </Button>
  //         </Box>
    
  //         {/* drawer itself */}
  //         <Drawer
  //           anchor='right'
  //           open={isDrawerOpen}
  //           onClose={handleCloseDrawer}
  //           PaperProps={{
  //             sx: {
  //               width: 350, // the width of the drawer
  //               padding: 2,
  //             },
  //           }}
  //         >
  //           {/* header */}
  //           <Box display='flex' justifyContent='space-between' alignItems='center'>
  //             <Box sx={theme.typography.h3}>Filters</Box>
  //             <IconButton size='small' onClick={handleCloseDrawer}>
  //               <CloseIcon />
  //             </IconButton>
  //           </Box>
    
  //           <Divider  sx={{ my: 2, mb: 0 }} />
    
  //           {/* toggle Web/DB Assets */}
  //           <Box display='flex' justifyContent='space-between' sx={{ mt:1, mb: 1, alignItems: 'center' }}>
  //             <Box sx={theme.typography.h5}>Include DB/Web</Box>
  //             <FilterSwitch
  //               checked={isWebOrDBIncluded}
  //               onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
  //               sx={{ marginLeft: 'auto' }}
  //               color='primary'
  //             />
  //           </Box>
    
  //           <Divider />

  //           {/* toggle isDelinquent Assets */}
  //           <Box display='flex' justifyContent='space-between' sx={{ mt: 1, mb: 1, alignItems: 'center' }}>
  //             <Box sx={theme.typography.h5}>Show Only Delinquents</Box>
  //             <FilterSwitch
  //               checked={tempFilter.isDelinquent}
  //               onChange={(event) =>  handleTempFilterChange(event.target.checked, 'isDelinquent')}
  //               sx={{ marginLeft: 'auto' }}
  //               color='primary'
  //             />
  //           </Box>

  //           <Divider />
    
  //           {/* chips to show when filter is applied */}
  //           <Box sx={{ mt: 1, mb: 1 }}>
  //             <Box sx={theme.typography.h5}>Applied Filters</Box>
  //             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, mb:0.5}}>
  //               {Object.keys(filter).length > 0 ? (
  //                 Object.keys(filter).map((key) => (
  //                   <Chip
  //                     key={key}
  //                     color='primary'
  //                     label={getChipLabel(key)}
  //                     onDelete={() => removeFilterKey(key)}
  //                   />
  //                 ))
  //               ) : (
  //                 <Typography variant='body2'>No filters applied</Typography>
  //               )}
  //             </Box>
  //           </Box>
    
  //           <Divider />
    
  //           {/* filter by sysAdmin */}
  //           <Box
  //             display='flex'
  //             sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
  //           >
  //             <Box sx={theme.typography.h5}>System Admin</Box>
  //             <SelectionDropdownList
  //               targetProperty='sysAdmin'
  //               valueOptions={sysAdminsList}
  //               selectedOptions={tempFilter.sysAdmin}
  //               onChange={handleTempFilterChange}
  //               selectAllOptionsFlag={true}
  //               limitNumOfTags={true}
  //               multiSelect // Enabling multi-select
  //             />
  //           </Box>
    
  //           <Divider sx={{ my: 1, mb: 0 }} />
    
  //           {/* filter by primOwner */}
  //           <Box
  //             display='flex'
  //             sx={{ flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}
  //           >
  //             <Box sx={theme.typography.h5}>Primary Owner</Box>
  //             <SelectionDropdownList
  //               targetProperty='primOwner'
  //               valueOptions={primOwnersList}
  //               selectedOptions={tempFilter.primOwner}
  //               onChange={handleTempFilterChange}
  //               selectAllOptionsFlag={true}
  //               multiSelect // Enabling multi-select
  //             />
  //           </Box>
    
  //           <Divider sx={{ my: 1, mb: 2 }} />
    
  //           {/* clears all filters*/}
  //           <Box display="flex" justifyContent="space-between">
  //             <Button variant='outlined' onClick={handleClearAll}>
  //               Clear All
  //             </Button>
  //             <Button variant="contained" onClick={handleApplyFilters} sx={{ backgroundColor: theme.palette.primary.dark}}>
  //               Apply
  //             </Button>
  //           </Box>
  //         </Drawer>
  //       </>
  //     );
  //   }
  //   else {
  //     return (
  //       <>
  //         {/* button to open Drawer */}
  //         <Box display='flex' justifyContent='flex-end' sx={theme.typography.button}>
  //           <Button
  //             variant='contained'
  //             color='primary'
  //             startIcon={<FilterAlt />}
  //             onClick={handleOpenDrawer}
  //             sx={{ boxShadow: theme.shadows[3] }}
  //           >
  //             <Typography variant='h5'>Filter</Typography>
  //           </Button>
  //         </Box>
    
  //         {/* drawer itself */}
  //         <Drawer
  //           anchor='right'
  //           open={isDrawerOpen}
  //           onClose={handleCloseDrawer}
  //           PaperProps={{
  //             sx: {
  //               width: 350, // the width of the drawer
  //               padding: 2,
  //             },
  //           }}
  //         >
  //           {/* header */}
  //           <Box display='flex' justifyContent='space-between' alignItems='center'>
  //             <Box sx={theme.typography.h3}>Filters</Box>
  //             <IconButton size='small' onClick={handleCloseDrawer}>
  //               <CloseIcon />
  //             </IconButton>
  //           </Box>
    
  //           <Divider sx={{ my: 2 }} />
    
  //           {/* toggle Web/DB Assets */}
  //           <Box display='flex' justifyContent='space-between' sx={{ mt: 1, mb: 2, alignItems: 'center' }}>
  //             <Box sx={theme.typography.h5}>Include DB/Web</Box>
  //             <FilterSwitch
  //               checked={isWebOrDBIncluded}
  //               onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
  //               sx={{ marginLeft: 'auto' }}
  //               color='primary'
  //             />
  //           </Box>
    
  //           <Divider sx={{ my: 1 }} />
    
  //           {/* chips to show filters applied */}
  //           <Box sx={{ mt: 2, mb: 2 }}>
  //             <Box sx={theme.typography.h5}>Applied Filters</Box>
  //             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
  //               {Object.keys(filter).length > 0 ? (
  //                 Object.keys(filter).map((key) => (
  //                   <Chip
  //                     key={key}
  //                     color='primary'
  //                     label={getChipLabel(key)}
  //                     onDelete={() => removeFilterKey(key)}
  //                   />
  //                 ))
  //               ) : (
  //                 <Typography variant='body2'>No filters applied</Typography>
  //               )}
  //             </Box>
  //           </Box>
    
  //           <Divider sx={{ my: 1 }} />
    
  //           {/* filter by sysAdmin */}
  //           <Box
  //             display='flex'
  //             sx={{ flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}
  //           >
  //             <Box sx={theme.typography.h5}>System Admin</Box>
  //             <SelectionDropdownList
  //               targetProperty='sysAdmin'
  //               valueOptions={sysAdminsList}
  //               selectedOptions={tempFilter.sysAdmin}
  //               onChange={handleTempFilterChange}
  //               selectAllOptionsFlag={true}
  //               limitNumOfTags={true}
  //               multiSelect // Enabling multi-select
  //             />
  //           </Box>
    
  //           <Divider sx={{ my: 1 }} />
    
  //           {/* filter by primOwner */}
  //           <Box
  //             display='flex'
  //             sx={{ flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}
  //           >
  //             <Box sx={theme.typography.h5}>Primary Owner</Box>
  //             <SelectionDropdownList
  //               targetProperty='primOwner'
  //               valueOptions={primOwnersList}
  //               selectedOptions={tempFilter.primOwner}
  //               onChange={handleTempFilterChange}
  //               selectAllOptionsFlag={true}
  //               multiSelect // Enabling multi-select
  //             />
  //           </Box>
    
  //           <Divider sx={{ my: 2 }} />
    
  //           {/* clear all filters*/}
  //           <Box display="flex" justifyContent="space-between">
  //             <Button variant='outlined' onClick={handleClearAll}>
  //               Clear All
  //             </Button>
  //             <Button variant="contained" onClick={handleApplyFilters} sx={{ backgroundColor: theme.palette.primary.dark}}>
  //               Apply
  //             </Button>
  //           </Box>
  //         </Drawer>
  //       </>
  //     );
  //   }
  // };
