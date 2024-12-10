
/**
  The following defines a custom context for managing a filter state using the "FilterProvider" component to manage this state.
  The useFilter hook is also created to access and update the filter state from any component within the context of "FilterProvider"
 
 */

  import React, { createContext, useState, useContext } from 'react';

  const FilterContext = createContext();
  
  /*
  The FilterProvider component wraps its children with the FilterContext.Provider and manages the 'filter' state using the 'useState' hook. It also provides the updateFilter function to update the filter state, and clear the filter state.
  */
  export const FilterProvider = ({ children }) => {
    //initializes filter as empty object
    const [filter, setFilters] = useState({});
  
    //keeps track of switch's on/off status
    const [isWebOrDBIncluded, setIsWebOrDBIncluded] = useState(true); //state for the switch

    //keeps track of Delinquent switch's on/off status
    const [isDelinquent, setDelinquent] = useState(false); //default: shows all entries 


    // updates the filter object by adding or removing property-value pairs. 
    // newFilter = obj containing new filter key-value pair to be added/updated
    // source= only needed to clarify if we're using an expandable table
  
    const updateFilter = (newFilter, source = null, operator=null) => {
     setFilters(prevFilters => {

      // ensure previous filters is treated as an object
      if (typeof prevFilters !== 'object' || prevFilters === null) {
        return { ...newFilter }; // initialize with new filter if prevFilters is not valid
      } 
      let updatedFilters = { ...prevFilters}; //copy of previous filter

      // console.log(`Current filters: ${JSON.stringify(prevFilters)}`);
      // console.log(`New filter: [${Object.keys(newFilter)[0]}: ${newFilter[Object.keys(newFilter)[0]]}]`);
      // console.log('Previous filters:', prevFilters);
      // console.log('updatedFilters at the start: ', updatedFilters);

      if(source === 'dataGrid') {
        //apply operator to all keys in new filter
        Object.keys(newFilter).forEach(key => {
          // updatedFilters[key] = {
          //   value: newFilter[key],
          //   operator: operator
          const newFilterValue = {
            value: newFilter[key],
            operator,
          };

          // check if the column already has a filter
          if (updatedFilters[key]) {
            // replace the existing filter for the same column
            updatedFilters[key] = newFilterValue;
          } 
          else {
            // Add the new filter
            updatedFilters[key] = newFilterValue;
          }
        });
        return updatedFilters;
      }
      
      //executes logic only if working with expandable table
      if (source === 'expandableTable' || source=== 'stackedOrGroupedBarChart') {
        //updates filters directly by merging new filter with previous filters
        const updatedFilters = { ...prevFilters, ...newFilter };
        return updatedFilters;
      }

       //determines the filtering logic for updating filter state when filter value is single value or array      
    
      //iterate over all keys in new filter
      Object.keys(newFilter).forEach(key => {
        const value = newFilter[key]; //value at given key in newFilter
        const existingValue = prevFilters[key] || []; //value in our current filter


        //double-click logic: Remove the entire key-value pair if the value already exists
        if (existingValue === value || (Array.isArray(existingValue) && existingValue.includes(value))) {
          const { [key]: removed, ...rest } = updatedFilters;
          updatedFilters = rest; // remove the key-value pair
        } else if (Array.isArray(existingValue)) { 
          //if existingValue is an array
          if (Array.isArray(value)) {
            //merge arrays if both existing and new values are arrays
            updatedFilters[key] = Array.isArray(value)
              ? [...new Set([...existingValue, ...value])] //merging
              : [value];
          } else {
            //replace existing array with a new single value
            updatedFilters[key] = [value];
          }
        } else if (Array.isArray(value)) {
          //if new value is an array, access value directly
          updatedFilters[key] = value;
        } else {
          // add/update key with new value
          updatedFilters[key] = value;
        }
      });
      return updatedFilters;
     });
    };

    //remove single key from filter object
    const removeFilterKey = (key) => {
      setFilters(prevFilters => {
        const {[key]: removed, ...rest } = prevFilters;
        return rest 
      });
    };

    //replace value (an array) for a given key in filter
    function replaceValueFromFilterKeyArray(newFilter) {
      setFilters(prevFilters => {
        // ensure previous filters is treated as an object
        if (typeof prevFilters !== 'object' || prevFilters === null) {
          return { ...newFilter }; // initialize with new filter if prevFilters is not valid
        } 

        let updatedFilters = { ...prevFilters}; //copy of previous filter
        
        //iterate over all keys in new filter
        Object.keys(newFilter).forEach(key => {
          //replace array in newFilter with arrayh in prevFilter
          const newFilterArray = Array.isArray(newFilter[key])
            ? newFilter[key]  //replace old value (old array in value with new one)
            : [newFilter[key]]  //if single value replace as an array

          //add key and value (the array) to the filter object
          updatedFilters[key] = newFilterArray;
        });
        return updatedFilters;
       });
    };

    
    const clearFilter = () => {
      setFilters({});
    };

    //updates the isWebOrDBIncluded state when switch is toggled
    const toggleWebOrDBFilter = (isChecked) => {
      setIsWebOrDBIncluded(isChecked);
    };

    //updates the isDelinquent state when switch is toggled
    const toggleDelinquentFilter = (isChecked) => {
      setDelinquent(isChecked);
    };

    
  
    return (
      //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
      <FilterContext.Provider value={{ 
        filter: filter || {},
        updateFilter, 
        removeFilterKey, 
        replaceValueFromFilterKeyArray ,
        clearFilter, 
        isWebOrDBIncluded, 
        toggleWebOrDBFilter,
        isDelinquent,
        toggleDelinquentFilter 
      }}>
        {children}
      </FilterContext.Provider>
    );
  };
  
  export const useFilter = () => useContext(FilterContext);
  


/*OLD updateFilter: 

    // Updates the filter object by adding or removing property-value pairs. 
    // newFilter = obj containing new filter key-value pair to be added/updated
    // source= only needed to clarify if we're using an expandable table
    const updateFilter = (newFilter, source = null) => {
      // console.log('Updating filter with:', newFilter);
      setFilters(prevFilters => {
        const key = Object.keys(newFilter)[0];
        const value = newFilter[key];
    
        console.log(`Current filters: ${JSON.stringify(prevFilters)}`);
        console.log(`New filter: ${key}: ${value}`);

        // console.log('Previous filters:', prevFilters);
        // console.log('Updating with:', key, ':', value);

        //executes logic only if working with expandable table
        if (source === 'expandableTable') {
          //updates filters directly by merging new filter with previous filters
          const updatedFilters = { ...prevFilters, ...newFilter };
          return updatedFilters;
        }
        //handling the filterSelectionDrawer
        
        //default logic 
        else {
          
          if (prevFilters[key] === value) {
          // If the new value is the same as the current value for the key, remove the key from the filter.
          // helps ensure double click will remove criteria from filter. (toggling off)             
            const { [key]: removed, ...rest } = prevFilters;
            // console.log('Filter after removal:', rest);
            return rest;
          } 
          //if no double-click
          else {
            //update add key-value pair in filters (toggling on)
            const updatedFilters = { ...prevFilters, ...newFilter };
            // console.log('Updated filters:', updatedFilters);
            return updatedFilters;
          }
        }
      });
    };
*/