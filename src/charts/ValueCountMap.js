/*
This function is used to count the number of times a value appears in the data.
*/
const ValueCountMap = (data, targetProperty) => {
  return data.reduce((countMap, row) => {
    // Extract the value of the target property from the row
    const propertyValue = row[targetProperty];
    // Increment the count for the extracted property value
    countMap[propertyValue] = (countMap[propertyValue] || 0) + 1;
    return countMap;
  }, {});
};

export default ValueCountMap;