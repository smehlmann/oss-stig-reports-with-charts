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
  //create the initial countMap using reduce
  const countMap = data.reduce((countMap, item) => {
    //extract the value of the target property from a given record
    const propertyValue = item[targetProperty];
    //increment the count for the extracted property value
    countMap[propertyValue] = (countMap[propertyValue] || 0) + 1;
    return countMap;
  }, {});


  //if targetProperty is "shortName", replace "NCCM" vals with vals from "nccm" prop
  if (targetProperty === "shortName") {
    //only look at records whose shortName = "NCCM"
    const filteredNccmData = data.filter((entry) => entry.shortName === "NCCM");

    //clear "NCCM" entry in countMap if it exists bc 
    delete countMap["NCCM"];
    //get values of 'nccm' column and their counts
    filteredNccmData.forEach((entry) => {
      //extract nccm property values (e.g., "NCCM-W", "NCCM-S") from row
      const nccmPropValue = entry['nccm'];
      //if ccmPropValue (the key) is null/empty string, the key is changed to "NCCM"
      const nccmKey = (nccmPropValue === null || nccmPropValue === "") ? "NCCM" : nccmPropValue;

      //key-value pairs from 'nccm' column added to countMap, 'nccm' keys override duplicate keys
      countMap[nccmKey] = (countMap[nccmKey] || 0) + 1;
    });
  }

  return countMap;
};

export default ValueCountMap;

/*
//specific check when targetProperty is "shortName"
  if (targetColumn === "shortName") {
    //only look at records whose shortName = NCCM
    const filteredNccmData = data.filter(
      (entry) => entry.shortName === "NCCM",
    );

    //use reduce to get values of 'nccm' column and their counts
    const nccmMap = filteredNccmData.reduce((accumulator, row) => {
      //extract a nccm property values(ie. "NCCM-W", "NCCM-S"...) from row
      const nccmPropValue = row["nccm"];
      //if nccmPropValue (the key) is null, the key is changed to "NCCM"
      const nccmKey = nccmPropValue === null ? "NCCM" : nccmPropValue;
      // Increment the count for the extracted property value
      accumulator[nccmKey] = (accumulator[nccmKey] || 0) + 1;
      return accumulator;
    }, {});

    //key-value pairs from nccmMap added to countMap,nccmMap keys overrides duplicate keys
    Object.keys(nccmMap).forEach((key) => {
      countMap[key] = nccmMap[key];
    });
  }

*/