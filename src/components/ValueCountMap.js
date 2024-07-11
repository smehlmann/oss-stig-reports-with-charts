/*
This function is used to count the number of times a value appears in the data.
Input:  an array of objects (data) and a string (targetProperty). 
Output: an object where the keys are the values in the targetProperty, and the values are the counts of how many times each value appears
  ie. countMap = [
    {targetPropertyVal1: count of targetPropVal1},  {targetPropertyVal2: count of targetPropVal2}...]

accumulator = object to build frequency map where each key is unique value of 'nccm' or targetProperty, and value is the counts of these keys
row/ item = object to signify single record/row in dataset
*/
const ValueCountMap = (data, targetProperty) => {
  return data.reduce((countMap, item) => {
    // Extract the value of the target property from a given record
    const propertyValue = item[targetProperty];
    // Increment the count for the extracted property value
    countMap[propertyValue] = (countMap[propertyValue] || 0) + 1;

    
    return countMap;
  }, {});
};

export default ValueCountMap;
