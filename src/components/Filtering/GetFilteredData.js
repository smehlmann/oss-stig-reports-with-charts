/* 
This function works by looking at the contents in the array in the filterContext (basically our filter), and only displays the data that matches the contents in the filter.
*/
// function GetFilteredData(data, filter) {
//   if (Object.keys(filter).length > 0) {
//     return data.filter(item => 
//       Object.keys(filter).every(key => item[key] === filter[key])
//     );
//   }
//   return data;
// }
// export default GetFilteredData;

function GetFilteredData(data, filter, source = '') {
//check if data is valid (not null, undefined, or not an array)
if (!data || !Array.isArray(data)) {
  return []; // Return an empty array if data is invalid
}

//check if filter is valid and has keys to filter by
if (filter && filter !== null && Object.keys(filter).length > 0) {
  //filter the data based on the keys in the filter
  const filteredData = data.filter(item => 
    Object.keys(filter).every(key => {
      const filterValue = filter[key]; // Value associated with current filter's key (property)

      //check if filterValue is an object (containing 'operator' and 'value')
      if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
        const operator = filterValue.operator;
        const valueToFilterBy = filterValue.value;
        const itemValue = item[key]; //item value for comparison based on current key

        // Handle different operators
        switch (operator) {
          case '=':
            return itemValue === valueToFilterBy;
          case '!=':
            return itemValue !== valueToFilterBy;
          case '>':
            return itemValue > valueToFilterBy;
          case '>=':
            return itemValue >= valueToFilterBy;
          case '<':
            return itemValue < valueToFilterBy;
          case '<=':
            return itemValue <= valueToFilterBy;
          case 'is empty':
            return itemValue === null || itemValue === '';
          case 'is not empty':
            return itemValue !== null && itemValue !== '';
          default:
            return true; // If the operator is not recognized, include the item
        }

      } else if (Array.isArray(filterValue)) {
        //when filterValue is an array (e.g., from a dropdown with multiple selections)
        const itemValue = item[key]; // Get item value for the current key
        
        //if item's value exists as an array (multi-select scenario)
        if (Array.isArray(itemValue)) {
          //at least one value in filterValue matches itemValue (intersection)
          return itemValue.some(val => filterValue.includes(val));
        } else {
          //check if itemValue is in filterValue
          return filterValue.includes(itemValue);
        }
      } else {
        //compare itemValue directly with filterValue (single-value filter)
        const itemValue = item[key];
        return itemValue === filterValue;
      }
      
    })
  );

  //return the filtered data or an empty array if no matches were found
  return filteredData.length > 0 ? filteredData : []; 
}

//return original data if no filters are applied
return data;
}

export default GetFilteredData;



/*
        // //check if filterValue is an object with with 'operator' and 'value' (for data)
        // if (typeof filterValue === 'object' && filterValue !== null) {
          
        //   const operator = filterValue.operator; //extract operator
        //   const value = filterValue.value; //extract value to compare
        //   //get item value for comparison based on current key
        //   const itemValue = item[key];

        //   //handle different operators
        //   switch (operator) {
        //     case '=':
        //       return itemValue === value;
        //     case '!=':
        //       return itemValue !== value;
        //     case '>':
        //       return itemValue > value;
        //     case '>=':
        //       return itemValue >= value;
        //     case '<':
        //       return itemValue < value;
        //     case '<=':
        //       return itemValue <= value;
        //     case 'is empty':
        //       return itemValue === null || itemValue === '';
        //     case 'is not empty':
        //       return itemValue !== null && itemValue !== '';
        //     default:
        //       return true; // If the operator is not recognized, include the item
        //   }
        // } else if (Array.isArray(filterValue)) {
        //   //if filterValue is array, check if itemValue is included in that array
        //   const itemValue = item[key]; //get item value for current key
        //   return filterValue.includes(itemValue); //return true if itemValue exists
        // } else {
        //   //otherwise, compare itemValue directly with filterValue
        //   const itemValue = item[key]; //get item value for current key
        //   return itemValue === filterValue; //return true if itemValue equals filterValue
        // }
*/