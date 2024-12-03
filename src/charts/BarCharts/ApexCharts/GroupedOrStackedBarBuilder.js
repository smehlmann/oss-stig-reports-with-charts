import React, { useMemo, useCallback, useState, useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { useBarChartStyles } from './useBarChartStyles.js';
import { useFilter } from "../../../FilterContext.js";

const GroupedOrStackedBarBuilder = ({
  series,
  dataLabels,
  dataLabelsArePercentages,
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
    legendBarChart,

  } = useBarChartStyles(dataLabelsArePercentages, tooltipLabelPrefix, true);

  const {filter} = useFilter(); 

  const [showDataLabels, setShowDataLabels] = useState(false);

  
  //update setShowDataLabels
  useEffect(() => {
    setShowDataLabels(Object.keys(filter).length > 0);
  }, [filter]); //only re-run when the `filter` object changes


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
        // categories: dataLabels,
        categories: dataLabels.length > 0 ? dataLabels : ['No Data'],
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
        },
        items:{
          display: 'flex',
        },
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
        enabled: isStackedBarChart ? showDataLabels : true,
        formatter: (val, { seriesIndex, dataPointIndex, w }) => {
          if (isStackedBarChart) {
            const totals = w.globals.stackedSeriesTotals;
            if (seriesIndex === w.globals.series.length - 1&& totals[dataPointIndex] !== undefined) {
              return dataLabelPercentageFormatter(totals[dataPointIndex]); // show total above the bar
            }
            return ''; //hide for other segments
          }
          // non-stacked charts, show the value for the segment
          return dataLabelPercentageFormatter(val || 0);
        },
        position: isStackedBarChart ? 'top' : 'center',
        offsetY: 0,
        offsetX: 0,
        style: {...dataLabelsOnBarText},
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
        ...legendBarChart,
        // show: true,
        // horizontalAlign: 'center',
        // position: 'top',
        // offsetY: 15,
        // markers:{
        //   fillColors: barColors,
        // }
      },
      
    }),
    [dataLabels, isHorizontal, xAxisHeader, yAxisHeader, onClick, axisTitleStyle, isStackedBarChart, barColors, dataLabelPercentageFormatter]
  );


  if (!series.length || !dataLabels.length) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Segoe UI, sans-serif',
          fontSize: '16px',
          color: '#666',
          height: '100%',
          width: '100%',
        }}
      >
        <p>No data available</p>
      </div>
    );
  }
  

  const chartHeight = isStackedBarChart 
    ? Math.max(400, (dataLabels.length || 1 )* 26) //rowHeight = 26px
    : Math.max(400, (dataLabels.length || 1) * 50) //rowHeight= 50px 
  
  //each row is 50px in height

  return (
    <div className="apex-chart" style={{ height: '100%', width: '100%',  }}>
      <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />
    </div>
  );
};

export default GroupedOrStackedBarBuilder;
