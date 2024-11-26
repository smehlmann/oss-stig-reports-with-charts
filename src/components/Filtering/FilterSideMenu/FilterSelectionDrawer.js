import React, { useState, useCallback} from 'react';
import { Box, Button, IconButton, Divider, Typography, Chip, Drawer } from '@mui/material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { useFilter } from '../../../FilterContext';
import { useTheme } from '@mui/system';
import SelectionDropdownList from '../../dropdowns/SelectionDropdownList';
import { FilterSwitch } from './FilterSwitch';
// import { data } from 'jquery';
import useDropdownOptions from '../../dropdowns/useDropdownOptions';
import {SectionTitle, ToggleSectionContainer, DropdownSectionContainer, ButtonContainer, ApplyButton, ClearAllButton} from './FilterUIComponents';

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
    datePulled: [],
    benchmarkId: [], 
    department:[],
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
      datePulled:[],
      benchmarkId: [],
      department: [], 
      benchmark: [],
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
    const filterKeys = ["sysAdmin", "primOwner", "emass", "code", "datePulled", "benchmarkId", "benchmark", "department"];
    filterKeys.forEach(key => {
      if (tempFilter[key] &&  tempFilter[key].length > 0) {
        if( key === 'datePulled') {
          const dateValue = tempFilter[key].map(item => item.raw); //extract value from raw property
          console.log('date to be filtered by: ', typeof dateValue);
          updateFilter({ [key]: dateValue}); 
        } else {
          console.log('non-date: ', tempFilter[key]);
          updateFilter({ [key]: tempFilter[key] });
        }
      } else {
        removeFilterKey(key);
      }
    });

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
        case 'department':
          return 'Department';
        case 'datePulled':
          return 'Date';
        default:
          return '';
      }
    },
    []
  );

 //gets list of options in dropdowns
  const sysAdminOptions = useDropdownOptions(data, 'sysAdmin');
  const primOwnerOptions = useDropdownOptions(data, 'primOwner');
  const emassOptions = useDropdownOptions(data, 'emass');  
  const codeOptions = useDropdownOptions(data, 'code');
  const benchmarkIdOptions = useDropdownOptions(data, 'benchmarkId');
  const departmentOptions = useDropdownOptions(data, 'department');
  const dateOptions = useDropdownOptions(data, 'datePulled');
  const benchmarkOptions = useDropdownOptions(data, 'benchmark');

  const renderSideBar = () => {
    return (
      <>
        {/* button to open Drawer */}
        <Box display='flex' justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            startIcon={<FilterAlt />}
            onClick={handleOpenDrawer}
            sx={theme.typography.button &&{ boxShadow: theme.shadows[3] }}
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
              width: 375, // the width of the drawer
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
          <ToggleSectionContainer>
            <SectionTitle>Include DB/Web</SectionTitle>
            <FilterSwitch
              checked={isWebOrDBIncluded}
              onChange={(event) => toggleWebOrDBFilter(event.target.checked)}
              sx={{ marginLeft: 'auto' }}
              color='primary'
            />
          </ToggleSectionContainer>
  
          <Divider/>
  
          {/* toggle isDelinquent Assets */}
          <ToggleSectionContainer>
            <SectionTitle>Show Only Delinquents</SectionTitle>
            <FilterSwitch
              checked={tempFilter.isDelinquent}
              onChange={(event) =>  handleTempFilterChange(event.target.checked, 'isDelinquent')}
              sx={{ marginLeft: 'auto' }}
              color='primary'
            />
          </ToggleSectionContainer>
  
          <Divider/>
  
          {/* chips to show when filter is applied */}
          <Box sx={{ mt: 1, mb: 1 }}>
            <SectionTitle>Applied Filters</SectionTitle>
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
          <DropdownSectionContainer>
            <SectionTitle>System Admin</SectionTitle>
            <SelectionDropdownList
              targetProperty='sysAdmin'
              valueOptions={sysAdminOptions}
              selectedOptions={tempFilter.sysAdmin}
              onChange={handleTempFilterChange}
              selectAllOptionsFlag={true}
              limitNumOfTags={true}
              multiSelect 
              source='filterDrawer'
            />
          </DropdownSectionContainer>
  
          <Divider sx={{ my: 1, mb: 0 }} />
  
          {/* filter by primOwner */}
          <DropdownSectionContainer>
            <SectionTitle>Primary Owner</SectionTitle>
            <SelectionDropdownList
              targetProperty='primOwner'
              valueOptions={primOwnerOptions}
              selectedOptions={tempFilter.primOwner}
              onChange={handleTempFilterChange}
              selectAllOptionsFlag={true}
              multiSelect 
              source='filterDrawer'
            />
          </DropdownSectionContainer>
          
          {/*report 8 */}
          {source === "report8" && (
            <> {/*allows both elements to be grouped together under conditional rendering */}
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  STIG Benchmarks
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="benchmarkId"
                  valueOptions={benchmarkIdOptions}
                  selectedOptions={tempFilter.benchmarkId}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )}
          
          {/*code and date pulled */}
          {source==="report14" && (
            <> 
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  Code
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="code"
                  valueOptions={codeOptions}
                  selectedOptions={tempFilter.code}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
              <Divider sx={{ my: 1, mb: 0 }} />
              
              <DropdownSectionContainer>
                <SectionTitle> 
                  Date Pulled
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="datePulled"
                  valueOptions={dateOptions}
                  selectedOptions={tempFilter.datePulled}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )}   
          {source === "report9" && (
            <> {/*allows both elements to be grouped together under conditional rendering */}
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  Code
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="code"
                  valueOptions={codeOptions}
                  selectedOptions={tempFilter.code}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>

              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  STIG Benchmarks
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="benchmark"
                  valueOptions={benchmarkOptions}
                  selectedOptions={tempFilter.benchmark}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )}

          {/*department */}
          {source === "report15" && (
            <> {/*allows both elements to be grouped together under conditional rendering */}
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  Departments
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="department"
                  valueOptions={departmentOptions}
                  selectedOptions={tempFilter.department}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )}

          {/* report5 */}
          {(source==="report5")
            && (
            <> 
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  Code
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="code"
                  valueOptions={codeOptions}
                  selectedOptions={tempFilter.code}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )} 

          {/*emass numbers */}    
          {(source==="report5" || source==="report7" || source==="report14")
            && (
            <> 
              <Divider sx={{ my: 1, mb: 0 }} />
              <DropdownSectionContainer>
                <SectionTitle> 
                  eMASS Number
                </SectionTitle>
                <SelectionDropdownList
                  targetProperty="emass"
                  valueOptions={emassOptions}
                  selectedOptions={tempFilter.emass}
                  onChange={handleTempFilterChange}
                  selectAllOptionsFlag={true}
                  multiSelect 
                  source='filterDrawer'
                />
              </DropdownSectionContainer>
            </>
          )} 
             

          <Divider sx={{ my: 1, mb: 2 }} />
  
          {/* clears all filters*/}
          <ButtonContainer>
            <ClearAllButton variant='outlined' onClick={handleClearAll}>
              Clear All
            </ClearAllButton>
            <ApplyButton onClick={handleApplyFilters}>
              Apply
            </ApplyButton>
          </ButtonContainer>
        </Drawer>
      </>
    );
  };



  return <>{renderSideBar()}</>;


};

export default FilterSelectionDrawer;


