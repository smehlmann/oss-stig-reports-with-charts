//accepts an array of objects as data and column names (strings)
const PropertyAvgMap = (data, properties) => {
  console.log('properties: ', properties);
  //initialize an object to store sums and counts for each property
  const sumsAndCounts = properties.reduce((accumulator, property) => {
    //initialize the sum and count for each property
    accumulator[property] = { sum: 0, count: 0 };
    return accumulator;
  }, {});

  //iterate over the data to compute the sums and counts for each property
  data.forEach(row => {
    properties.forEach(property => {
      //if property exists in the current row
      if (row[property] !== undefined) {
        //add the property's value to its sum
        sumsAndCounts[property].sum += row[property];
        //increment the count for the property
        sumsAndCounts[property].count += 1;
      }
    });
  });

  //computes averages for each property using the calculate function
  const averages = {}; // Stores computed averages
  properties.forEach(property => {
    //calculates the average by dividing sum by count
    averages[property] = sumsAndCounts[property].count > 0 
      ? sumsAndCounts[property].sum / sumsAndCounts[property].count 
      : 0;
  });

  return averages;
};

// Returns an object containing averages for the specified properties
export default PropertyAvgMap;