/* 
This function works by looking at the contents in the array in the filterContext (basically our filter), and only displays the data that matches the contents in the filter.
*/
function GetFilteredData(data, filter) {
  if (Object.keys(filter).length > 0) {
    return data.filter(item => 
      Object.keys(filter).every(key => item[key] === filter[key])
    );
  }
  return data;
}
export default GetFilteredData;