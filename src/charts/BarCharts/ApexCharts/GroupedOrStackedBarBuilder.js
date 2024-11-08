import React, { useMemo, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {getPercentageFormatterObject} from "../../../components/getPercentageFormatterObject.js";

const GroupedOrStackedBarBuilder = ({
  series,
  dataLabels,
  dataLabelsArePercentages,
  showLabelsOnBars,
  isHorizontal,
  isStackedBarChart,
  xAxisHeader,
  yAxisHeader,
  onClick,
  formatLabelToPercentage,
}) => {
  const theme = useTheme();

  //determines whether to format the value if it should be a percentage
  const dataLabelFormatter  = useMemo(() => (value) => {
    if (dataLabelsArePercentages) {
      //format the value using the percentage formatter
      return getPercentageFormatterObject().formatter(value);
    } 
    //dataValues are not percentages, return raw value
    return value;

  }, [dataLabelsArePercentages]);

  const axisTitleStyle = useMemo(
    () => ({
      fontSize: '14px',
      fontFamily: 'Segoe UI',
      fontWeight: '600',
      margin: 0,
      textAlign: 'center',
      
    }),
    []
  );

  const getColorForLabel = useCallback(
    (label) => {
      switch (label) {
        case 'Average Assessed':
          return '#acb5df';
        case 'Average Submitted':
          return theme.palette.submitted;
        case 'Average Accepted':
          return theme.palette.accepted;
        case 'Average Rejected':
          return theme.palette.rejected;
        default:
          return undefined;
      }
    },
    [theme.palette]
  );


  const barColors = useMemo(() => {
    const defaultColors = ['#3194af', '#52E3E1','#A0E426', '#FDF148', '#FFAB00', '#F77976', '#F050AE', '#D883FF', '#9336FD'];
    //map over dataLabels and use the default colors if getColorForLabel returns undefined
    return series.map((label, index) => {
      const color = getColorForLabel(label.name);
      return color ? color : defaultColors[index % defaultColors.length];
    });
  }, [series, getColorForLabel]);


  //memoize options to avoid state updates on the initial render
  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        width: '100%',
        stacked: isStackedBarChart,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            onClick(event, chartContext, config);
          },
        },
      },
      xaxis: {
        categories: dataLabels,
        title: { text: xAxisHeader, style: axisTitleStyle },
        labels: {
          formatter: dataLabelFormatter,
        },
      },
      yaxis: {
        title: { text: yAxisHeader, 
          style: axisTitleStyle, 
          // offsetX: 2,
        },
        labels: {
          maxWidth: 430,
          offsetX: 6,
          style: {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-label',
          }
        },
      },
      tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        x: {
          formatter: (val, opts) =>
            opts.w.globals.initialConfig.xaxis.categories[
              opts.dataPointIndex
            ] || '',
        },
        y: {
          formatter: dataLabelFormatter,
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: isHorizontal,
          // columnHeight: '100%',
          barHeight: '80%',
          // columnwidth: '80%',
          borderRadiusWhenStacked: 'last',
          colors: {
            // backgroundBarColors: barColors,
            backgroundBarOpacity: 1,
            opacity: 1, 
          }
        },
      },
      grid: {
        left: 400,
      },
      dataLabels: {
        enabled: showLabelsOnBars,
        labels: {
          formatter: function (value) {
            if (formatLabelToPercentage) {
              return formatLabelToPercentage.formatter(value);
            }
            return value;
          },
        },
        style: {
          fontFamily: 'Segoe UI',
          colors: ['#283249'], //background color 
        },
        background: {
          enabled: true,
          foreColor: '#ffffff',
          padding: 4,
          borderRadius: 4,
          borderWidth: 0,
          borderColor: '#283249',
          opacity: 0.9,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.7,
        },
      },
      fill: {
        opacity: 1,
        colors: barColors,
      },
      colors: barColors,
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetY: 15,
        // markers:{
        //   fillColors: barColors,
        // }
      },
    }),
    [dataLabels, isHorizontal, xAxisHeader, showLabelsOnBars, yAxisHeader, onClick, axisTitleStyle, formatLabelToPercentage, isStackedBarChart, barColors, dataLabelFormatter]
  );


  const chartHeight = Math.max(400, dataLabels.length * 26); //each row is 26px in height

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%',  }}>
      <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />
    </div>
  );
};

export default GroupedOrStackedBarBuilder;
