//is utility

import numeral from "numeral";

//contains formatter function that will be applied to labels 
//ensures that the labels are properly formatted with 2 decimal places and %
export const getPercentageFormatterObject = () => ({
  formatter: function (value) {
    if (value <= 1) {
      return numeral(value * 100).format('0.00') + '%';
    }
    return value;
  }
});


  // const PercentageFormatterObject = useMemo(() => ({
//     formatter: function (value) {
//       if (value <= 1) {
//         return numeral(value * 100).format('0.00') + '%';
//       }
//       return value;
//     }
//   }), []);

//   export default PercentageFormatterObject;