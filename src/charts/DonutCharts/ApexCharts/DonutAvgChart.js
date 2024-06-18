import { useMemo } from "react";

import PropertyAvgMap from "../../PropertyAvgMap.js";
import ApexDonutChartBuilder from "./ApexDonutChartBuilder.js";
import { useFilter } from "../../../FilterContext.js";

//"data" is an array of objects. 

const DonutAvgChart = ({ targetColumns, chartTitle, legendName, data }) => {
  
  
  //useFilter contains 'filter' state and when it's updated
  const { filter, updateFilter } = useFilter();
  //stores the data filter has been applied
  const filteredData = useMemo(() => {
    if (Object.keys(filter).length > 0) {
      const filtered = data.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
      return filtered;
    }
    return data;
  }, [filter, data]);

  //keeps track of averages for each column 
  // const averageMap = useMemo(() => PropertyAvgMap(filteredData, targetColumns), [filteredData, targetColumns]);
  const averageMap = useMemo(() => PropertyAvgMap(data, targetColumns), [data, targetColumns]);

  //capitalize first letter of the donutLabels
  const donutLabels = useMemo(() => Object.keys(averageMap).map(label => label.charAt(0).toUpperCase() + label.slice(1)), [averageMap]);
  //set to average
  const donutValues = useMemo(() => Object.values(averageMap), [averageMap]);


  //updates the filter criteria based on user's click
  const handleDonutClick = (event, chartContext, config) => {
    const selectedValue = config.w.config.labels[config.dataPointIndex];
    updateFilter({ [targetColumns]: selectedValue });
  };


  return (
    <ApexDonutChartBuilder
      dataLabels={donutLabels}
      dataValues={donutValues}
      title={chartTitle}
      lengendTitle={legendName}
     onClick = {handleDonutClick}
      
    />
  );
};

export default DonutAvgChart;
