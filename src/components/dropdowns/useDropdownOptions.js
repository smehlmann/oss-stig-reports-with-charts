import React, { useMemo } from 'react';

/* 
Custom hook gets the unique options based on specified property. These options will be displayed in the dropdown list that hte user will select. 
data: array of objects, wherein each object is an item with different properties
specifiedProperty: string that specifies property name for each object containing unique values. 

The hook maps over each item in 'data' and extracts the value at specified key (specifiedProperty). It then filters out null values and removes duplicates by creating the set. Set is turned into array and the array of unique values are returned.
*/

const useDropdownOptions = (data, specifiedProperty) => {
    return useMemo(() => {
        return [...new Set(data.map((item) => item[specifiedProperty]).filter((value) => value != null))]
    }, [data, specifiedProperty]);
};

export default useDropdownOptions;