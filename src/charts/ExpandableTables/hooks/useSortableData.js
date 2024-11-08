import {useState, useCallback} from 'react';


/*
custom hook to provide sort columns in expandable tables.

sortField = column table is sorted by
sortDirection = either 'asc' (ascending) or 'desc (descending)

*/

const useSortableData = (initialSortField = '', initialSortDirection = '') => {

  //initialSortDirection and initialSortField parameters set initial state upon mounting 
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const [sortField, setSortField] = useState(initialSortField)


  //event handler to set or update sorting criteria
  const handleSort = useCallback((field) => {
    setSortDirection((prevDirection) => (sortField === field && prevDirection === 'asc' ? 'desc' : 'asc')); //checks prev state to set direction
    setSortField(field); //sets field
  }, [sortField]); //only executes if sortField changes

  //takes array of objects (data) and returns sorted array based on sortField and sortDirection
  const sortData = useCallback(
    (data) => {
      if (!sortField) return data; //no sorting field set
      
      //maps column headers to their actual property names
      const headerToPropertyMap = {
        'Asset': 'asset',
        'Primary Owner': 'primOwner',
        'System Admin' : 'sysAdmin',
        'Assessed %': 'assessed',
        'Submitted %': 'submitted',
        'Accepted %': 'accepted',
        'Benchmarks': 'benchmarks',
        'Collection': 'collection',
        'Latest Revision': 'latestRev',
        'Current Quarter STIG': 'quarterVer',
        'Revision': 'revision',
        'Group ID': 'groupId',
        'Result': 'result',
        'Status': 'status',
        'Modified Date': 'modifiedDate',
        'Modified By': 'modifiedBy'
      };

    //create new array 
    return [...data].sort((a, b) => {
      const mappedField = headerToPropertyMap[sortField];
      //retrieve value from row in row[mappedField]
      const valueA = mappedField ? a[mappedField ] : undefined;
      const valueB = mappedField ? b[mappedField]: undefined;
      
      //handle missing values (place them at end)
      if (valueA === undefined) return 1;  
      if (valueB === undefined) return -1;
      // both values being compared are missing, considered equal
      if (valueA === undefined && valueB === undefined) return 0; 

      //check if values in column are strings
      if(typeof valueA === 'string' && typeof valueB === 'string') {
        //sort alphabetically
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      //if floats/numbers, sort numerically
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      //if values are dates, compare them by date value
      if(valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
      }

      //if values are not comparable, leave as is
      return 0;
    });
  }, [sortDirection, sortField]);

  return {sortField, sortDirection, sortData, handleSort}
  }

export default useSortableData;