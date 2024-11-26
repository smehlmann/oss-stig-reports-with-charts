import React, { useMemo, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { useBarChartStyles } from './useBarChartStyles.js';

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
  tooltipLabelPrefix='',
}) => {
  const theme = useTheme();

  //styles from custom hook
  const {
    axisTitleStyle, 
    dataLabelPercentageFormatter,  
    dataLabelsOnBarText, 
    dataLabelsOnBarBackground, 
    dataLabelsOnBarDropShadow,
    getColorForLabel,
    axisLabelsStyles,
    tooltipXFormatter,
    tooltipYFormatter, 
    tooltipYTitleFormatter,

  } = useBarChartStyles(dataLabelsArePercentages, tooltipLabelPrefix, true);

  const barColors = useMemo(() => {
    const defaultColors = ['#3194af', '#52E3E1','#A0E426', '#FDF148', '#FFAB00', '#F77976', '#F050AE', '#D883FF', '#9336FD'];
    //map over dataLabels and use the default colors if getColorForLabel returns undefined
    return series.map((label, index) => {
      const color = getColorForLabel(label.name);
      return color !== theme.palette.primary.main 
        ? color 
        : defaultColors[index % defaultColors.length];
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
          formatter: dataLabelPercentageFormatter,
          maxHeight: 200,
        },
        style: {
          ...axisLabelsStyles,
          cssClas: 'apexcharts-xaxis-label',
        }
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
            ...axisLabelsStyles,
            cssClas: 'apexcharts-xaxis-label',
          }
        },
      },
      tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        x: {
          formatter: tooltipXFormatter
        },
        
        y: {
          formatter: tooltipYFormatter,
          title: {
            formatter: tooltipYTitleFormatter,
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: isHorizontal,
          barHeight: '85%',

          colors: {
            backgroundBarOpacity: 1,
            opacity: 1, 
          },
          dataLabels: {
            position: 'center',
            
          }
        },
      },
      grid: {
        left: 400,
      },
      dataLabels: {
        enabled: showLabelsOnBars,
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
          //if stacked bar chart
          if (isStackedBarChart) {
            const totals = w.globals.stackedSeriesTotals; 
            // display the total on the last segment of the stack
            if (seriesIndex === w.globals.series.length - 1) {
              return dataLabelPercentageFormatter(totals[dataPointIndex]);
            }
            return ""; // hide labels if stacked
          }
        
          return dataLabelPercentageFormatter(val);
        },
         
       
      
        // offsetY: isStackedBarChart ? -8 : 0,
        style: dataLabelsOnBarText,
        background: dataLabelsOnBarBackground,
        dropShadow: dataLabelsOnBarDropShadow,
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
    [dataLabels, isHorizontal, xAxisHeader, showLabelsOnBars, yAxisHeader, onClick, axisTitleStyle, isStackedBarChart, barColors, dataLabelPercentageFormatter]
  );


  const chartHeight = isStackedBarChart 
    ? Math.max(400, dataLabels.length * 26) //rowHeight = 26px
    : Math.max(400, dataLabels.length * 50) //rowHeight= 50px 
  
  //each row is 50px in height

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%',  }}>
      <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />
    </div>
  );
};

export default GroupedOrStackedBarBuilder;
