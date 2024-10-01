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

function GetFilteredData(data, filter) {
  //check if filter object has any keys
  if (Object.keys(filter).length > 0) {
    //filter the data based on the keys in the filter 
    return data.filter(item => 
      Object.keys(filter).every(key => {
        const filterValue = filter[key]; //value associated with current filter key

        //check if filterValue is an object with with 'operator' and 'value' (for data)
        if (typeof filterValue === 'object' && filterValue !== null) {
          const operator = filterValue.operator; //extract operator
          const value = filterValue.value; //extract value to compare

          //get item value for comparison based on current key
          const itemValue = item[key];

          //handle different operators
          switch (operator) {
            case '=':
              return itemValue === value;
            case '!=':
              return itemValue !== value;
            case '>':
              return itemValue > value;
            case '>=':
              return itemValue >= value;
            case '<':
              return itemValue < value;
            case '<=':
              return itemValue <= value;
            case 'is empty':
              return itemValue === null || itemValue === '';
            case 'is not empty':
              return itemValue !== null && itemValue !== '';
            default:
              return true; // If the operator is not recognized, include the item
          }
        } else if (Array.isArray(filterValue)) {
          //if filterValue is array, check if itemValue is included in that array
          const itemValue = item[key]; //get item value for current key
          return filterValue.includes(itemValue); //return true if itemValue exists
        } else {
          //otherwise, compare itemValue directly with filterValue
          const itemValue = item[key]; //get item value for current key
          return itemValue === filterValue; //return true if itemValue equals filterValue
        }
      })
    );
  }
  return data; // Return original data if no filters are applied
}

export default GetFilteredData;
