//is utility

import numeral from "numeral";

//contains formatter function that will be applied to labels 
//ensures that the labels are properly formatted with 2 decimal places and %
export const getPercentageFormatterObject = () => ({
  formatter: function (value) {
    if (value <= 1) {
      return numeral(value * 100).format('0.00') + '%';
    }
    return value;  //return numeral(value).format('0,0.00'); //formats larger numbers with comma
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