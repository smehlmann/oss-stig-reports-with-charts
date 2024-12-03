//BarChartStyles.js
import { useMemo, useCallback } from "react";
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";
import { useTheme } from "../../../theme.js"
import { format } from 'date-fns';
import '../../../Charts.css';

export const useLineChartStyles = (dataLabelsArePercentages, tooltipLabelPrefix, isStackedOrGroupedChart) => {
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
    if (dataLabelsArePercentages) {
      //format the value using the percentage formatter
      return getPercentageFormatterObject().formatter(value);
    } 
    //dataValues are not percentages, return raw value
    return value;

  }, [dataLabelsArePercentages]);


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
        case 'Avg. Assessed':
          return theme.palette.assessed;
        case 'Submitted':
        case 'Average Submitted':
        case 'Avg. Submitted':
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
   const tooltipXFormatter = useMemo(() => (value) => {
    const dateValue = typeof value === 'number' ? new Date(value) : value;
    if (dateValue instanceof Date && !isNaN(dateValue)) {
      const formattedVal = format(dateValue, 'dd MMM yyyy');
      return `<div class="custom-span">${formattedVal}</div>`
    }
    return `<div class="custom-span">${value}</div>`;
  }, []);

  // format y value in tooltip
  const tooltipYFormatter = useMemo(() => (value) => {
    //perform percentage formatter if needed
    const formattedValue = dataLabelPercentageFormatter(value);
    return `<span style="font-weight: 900; font-size: 16px; color: black;">  ${formattedValue}</span>`;
  }, [dataLabelPercentageFormatter]);

  //format title for label prefix in tooltip
  const tooltipYTitleFormatter = useMemo(() => (seriesName) => {
      return `
        <span style="font-weight: 700; font-size: 14px;">${seriesName}  </span>
      `;

  }, [tooltipLabelPrefix]); // recalculate when tooltipLabelPrefix changes

  const legend = useMemo(() => ({
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Segoe UI, Arial, sans-serif',
    horizontalAlign: 'center',
    position: 'top',
    offsetY: 15,
  }), []);


  return  {
    axisTitleStyle, dataLabelPercentageFormatter, dataLabelsOnBarText , 
    dataLabelsOnBarBackground, dataLabelsOnBarDropShadow, getColorForLabel,
    axisLabelsStyles, tooltipXFormatter, tooltipYFormatter, 
    tooltipYTitleFormatter, legend
  };
};
