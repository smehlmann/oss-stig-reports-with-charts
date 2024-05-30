/*
This function is used to count the number of times a value appears in the data
*/
const ValueCountMap = (data) => {
  return data.reduce((countMap, row) => {
    //Every time code# appears, increment count
    countMap[row.code] = (countMap[row.code] || 0) + 1;
    return countMap;
  }, {});
};
export default ValueCountMap;