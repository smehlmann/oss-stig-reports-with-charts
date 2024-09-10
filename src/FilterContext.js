
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
       //determines the filtering logic for updating filter state when filter value is single value or array
   

      //retrieves current value of filter for a given key from prevFilters
      const existingValue = prevFilters;
      console.log("Existing value: ", existingValue);
      console.log('Updating filter with:', { key, value, existingValue });
      
      //if current filter value (existingValue) and new filter value (value) are arrays
      if (Array.isArray(existingValue)) {
        if (Array.isArray(value)) {
          // Merge arrays if both existing and new values are arrays
          const updatedArray = [...new Set([...existingValue, ...value])];
          return { ...prevFilters, [key]: updatedArray };
        } else {
          // Replace existing array with a new single value
          return { ...prevFilters, [key]: [value] };
        }
      } else if (Array.isArray(value)) {
        // If new value is an array, use it directly
        return { ...prevFilters, [key]: value };
      } else if (existingValue === value) {
        // Remove key if new value is the same as the existing value
        const { [key]: removed, ...rest } = prevFilters;
        return rest;
      } else {
        // Add or update key with new value
        return { ...prevFilters, [key]: value };
      }
      
     });
    };


    
    //remove single key from filter object
    const removeFilterKey = (key) => {
      setFilters(prevFilters => {
        const {[key]: removed, ...rest } = prevFilters;
        return rest 
      });
    };

    const clearFilter = () => {
      setFilters({});
    };

    //updates the isWebOrDBIncluded state when switch is toggled
    const toggleWebOrDBFilter = (isChecked) => {
      setIsWebOrDBIncluded(isChecked);
    };


    
  
    return (
      //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
      <FilterContext.Provider value={{ filter, updateFilter, removeFilterKey, clearFilter, isWebOrDBIncluded, toggleWebOrDBFilter }}>
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