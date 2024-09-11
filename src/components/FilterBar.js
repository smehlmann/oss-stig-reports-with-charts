import React, {useCallback} from 'react';
import { useFilter } from '../FilterContext';
import { Box, Chip, IconButton} from '@mui/material';
// import { useTheme } from "../theme";
import FilterAltOff from '@mui/icons-material/FilterAltOff';

// import SearchDropdownFilterList from './SearchDropdownFilterList';

const FilterBar = ({data = []}) => {
  const { filter, clearFilter, removeFilterKey } = useFilter();
  // const theme = useTheme();

  const handleRemoveFilter = (key) => {
    removeFilterKey(key);
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
        case 'acronym':
          return 'eMASS Acronym';
        default: 
          return '';
      }
    },
    ([]),
  );

  // const sysAdminsList = [...new Set(data.map(item => item.sysAdmin).filter(sysAdmin => sysAdmin != null))];
  // const primOwnersList = [...new Set(data.map(item => item.primOwner).filter(primOwner => primOwner != null))];

  return (
    <Box 
      display="flex" 
      // justifyContent='flex-end'
      justifyContent='flex-end'
      height= '150'
      // alignItems="stretch"  // Ensure children take full height
      sx={{gap: 1, marginBottom: 0 }}
    >
      {/* Container for filter chips and clear button */}
      <Box component='span' 
        display="flex" 
        alignItems="center"

        sx={{padding: '0 10px'  }}
      >
        <IconButton 
          color="primary" 
          variant="contained" 
          onClick={clearFilter}
          sx={{ 
           height: '100%',  
            display: 'flex',
            position: 'relative',
            // boxShadow: theme.shadows[3]
          }}
        >
          <FilterAltOff />
        </IconButton>
        {/* <Box component="span" marginRight="8px" sx={theme.typography.h5}>
          Filters applied:
        </Box> */}
        {Object.keys(filter).map((key) => (
          <Chip
            key={key}
            // color= '#6476FF'  //primary.light
            variant='outlined'
            color='primary'
            label={getChipLabel(key)}
            onDelete={() => handleRemoveFilter(key)}
            style={{ marginRight: '5px' }}
          />
        ))}
        
      </Box>

      {/* Dropdown filter lists */}
      {/* <Box sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='sysAdmin' label='System Admin' valueOptions={sysAdminsList} />
      </Box>
      <Box display='flex' sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='primOwner' label='Primary Owner' valueOptions={primOwnersList} />
      </Box> */}

      {/* Switch for DB/Web inclusion */}
      {/* <FormControlLabel
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
      /> */}

    </Box>
  );
};

export default FilterBar;