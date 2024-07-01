
/*Takes an array of numbers and gets average of them */
const CalculateArrayAvg = (values) => {
  const sum = values.reduce((total, value) => total + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};

export default CalculateArrayAvg;