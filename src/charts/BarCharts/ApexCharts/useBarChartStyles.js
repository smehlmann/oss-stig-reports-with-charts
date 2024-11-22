//BarChartStyles.js
import { useMemo, useCallback } from "react";
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";
import { useTheme } from "../../../theme.js"

export const useBarChartStyles = (dataLabelsOnBarArePercentages, tooltipLabelPrefix, isStackedOrGroupedChart) => {
  const theme = useTheme();

  //axes titles
  const axisTitleStyle = useMemo(() => ({
    fontSize: '14px',
    fontFamily: 'Segoe UI',
    fontWeight: '500',
    marginBottom: '8px',
    // margin: '0',
    textAlign: 'center',
  }), []);
  
  //determines whether to format the value if it should be a percentage
  const dataLabelPercentageFormatter  = useMemo(() => (value) => {
    if (dataLabelsOnBarArePercentages) {
      //format the value using the percentage formatter
      return getPercentageFormatterObject().formatter(value);
    } 
    //dataValues are not percentages, return raw value
    return value;

  }, [dataLabelsOnBarArePercentages]);


  //dataLabelsOnBar styling
  const dataLabelsOnBarText = useMemo(() => ({
    fontFamily: 'Segoe UI',
    colors: ['#283249'], // text color 
  }), []);
  const dataLabelsOnBarBackground = useMemo(() => ({
    enabled: true,
    foreColor: '#ffffff',
    padding: 1,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#283249',
    opacity: 0.9,
  }), []);
  const dataLabelsOnBarDropShadow = useMemo(() => ({
    enabled: true,
    top: 1,
    left: 1,
    blur: 1,
    opacity: 0.7,
  }), []);

  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case 'Assessed':
        case 'Average Assessed':
          return theme.palette.assessed;
        case 'Submitted':
        case 'Average Submitted':
          return theme.palette.submitted;
        case 'Accepted':
        case 'Average Accepted':
          return theme.palette.accepted;
        case 'Rejected':
        case 'Average Rejected':
          return theme.palette.rejected;
        default:
          return theme.palette.primary.main;
      }
    },
    [theme.palette]
  );
  

  const axisLabelsStyles = useMemo(() => ({
    fontSize: '13px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    fontWeight: 400,
  }), []);

  //format header in tooltip
   const tooltipXFormatter = useMemo(() => (val, opts) => {
    const formattedVal = opts.w.globals.initialConfig.xaxis.categories[opts.dataPointIndex] || val;
    return `<span style="font-weight: 900; font-size: 15px; color: black;">${formattedVal}</span>`;
  }, []);
  // format y value in tooltip
  const tooltipYFormatter = useMemo(() => (value) => {
    //perform percentage formatter if needed
    const formattedValue = dataLabelPercentageFormatter(value);
    return `<span style="font-weight: 900; font-size: 16px; color: black;">  ${formattedValue}</span>`;
  }, [dataLabelPercentageFormatter]);

  //format title for label prefix in tooltip
  const tooltipYTitleFormatter = useMemo(() => (seriesName) => {
    if (isStackedOrGroupedChart) {
      return `
        <span style="font-family: Merriweather;  color: #6A6A6A; font-weight: 900; font-size: 15px;">${tooltipLabelPrefix}</span>
        <span style="font-weight: 700; font-size: 14px;">${seriesName}  </span>
      `;
    } 
  }, [tooltipLabelPrefix, isStackedOrGroupedChart]); // recalculate when tooltipLabelPrefix changes


  return  {
    axisTitleStyle, dataLabelPercentageFormatter, dataLabelsOnBarText , 
    dataLabelsOnBarBackground, dataLabelsOnBarDropShadow, getColorForLabel,
    axisLabelsStyles, tooltipXFormatter, tooltipYFormatter, tooltipYTitleFormatter
  };
};
