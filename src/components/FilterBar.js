import React, {useCallback, useMemo} from 'react';
import { useFilter } from '../FilterContext';
import { Box, Chip, Button, Switch, FormControlLabel } from '@mui/material';
import { useTheme } from "../theme";
import SearchDropdownFilterList from './SearchDropdownFilterList';

const FilterBar = ({data = []}) => {
  const { filter, clearFilter, removeFilterKey, isWebOrDBIncluded, toggleWebOrDBFilter  } = useFilter();
  const theme = useTheme();

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
        
        default: 
          return '';
      }
    },
    ([]),
  );

  const sysAdminsList = [...new Set(data.map(item => item.sysAdmin).filter(sysAdmin => sysAdmin != null))];

  const primOwnersList = [...new Set(data.map(item => item.primOwner).filter(primOwner => primOwner != null))];

  // const packageShortNamesList = [...new Set(data.map(item => item.shortName).filter(shortName => shortName != null))];
  // const uniqueSysAdmins = data.map(item => item.sysAdmin);
  // console.log(uniqueSysAdmins);

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      height= '150'
      // alignItems="stretch"  // Ensure children take full height
      sx={{gap: 1, marginBottom: 0}}
    >
      {/* Container for filter chips and clear button */}
      <Box component='span' 
        display="flex" 
        alignItems="center"
        sx={{padding: '10px'  }}
      >
        {/* <Box component="span" marginRight="8px" sx={theme.typography.h5}>
          Filters:
        </Box> */}
        {Object.keys(filter).map((key) => (
          <Chip
            key={key}
            // color= '#6476FF'  //primary.light
            variant='outlined'
            color='primary'
            label={getChipLabel(key)}
            onDelete={() => handleRemoveFilter(key)}
            style={{ marginRight: '12px' }}
          />
        ))}
        <Button 
          color="primary" 
          variant="contained" 
          onClick={clearFilter}
          sx={{ 
           height: '100%',  
            display: 'flex',
            position: 'relative',
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Dropdown filter lists */}
      <Box sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='sysAdmin' label='System Admin' valueOptions={sysAdminsList} />
      </Box>
      
      <Box display='flex' sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='primOwner' label='Primary Owner' valueOptions={primOwnersList} />
      </Box>

      {/* <Box sx={{padding:'10px'}}>
        <SearchDropdownFilterList targetProperty='shortName' label='Package Name' valueOptions={packageShortNamesList} />
      </Box> */}


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