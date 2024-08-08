
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
  
    /* Updates the filter object by adding or removing property-value pairs. 
    newFilter = obj containing new filter key-value pair to be added/updated
    source= only needed to clarify if we're using an expandable table*/
    const updateFilter = (newFilter, source = null) => {
      // console.log('Updating filter with:', newFilter);
      setFilters(prevFilters => {
        const key = Object.keys(newFilter)[0];
        const value = newFilter[key];
    
        // console.log(`Current filters: ${JSON.stringify(prevFilters)}`);
        // console.log(`New filter: ${key}: ${value}`);

        // console.log('Previous filters:', prevFilters);
        // console.log('Updating with:', key, ':', value);

        //executes logic only if working with expandable table
        if (source === 'expandableTable') {
          //updates filters directly by merging new filter with previous filters
          const updatedFilters = { ...prevFilters, ...newFilter };
          return updatedFilters;
        }
        
        //logic for handling other visualizations 
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
  
    return (
      //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
      <FilterContext.Provider value={{ filter, updateFilter, removeFilterKey, clearFilter }}>
        {children}
      </FilterContext.Provider>
    );
  };
  
  export const useFilter = () => useContext(FilterContext);
  


  // const updateFilter = (newFilter, source = null) => {
  //   console.log('Updating filter with:', newFilter);
    
  //   setFilters(prevFilters => {
  //     // Extracting the key and value from newFilter
  //     const key = Object.keys(newFilter);
  //     const value = newFilter[key];
        
  //     // Check if the key includes an operator
  //     if (key.includes('_')) {
  //       // Extract column and operator from the key
  //       const [column, operator] = key.split('_');
  //       // Reconstruct the key with operator
  //       const updatedKey = `${column}_${operator}`;
        
  //       // Create a new filter object with the updated key
  //       const updatedFilters = { ...prevFilters, [updatedKey]: value };
        
  //       console.log('Updated filters with operator:', updatedFilters);
  //       return updatedFilters;
  //     }
        
  //     // Handle logic for expandable table
  //     if (source === 'expandableTable') {
  //       const updatedFilters = { ...prevFilters, ...newFilter };
  //       console.log('Updated filters for expandable table:', updatedFilters);
  //       return updatedFilters;
  //     }
      
  //     // Handle other visualizations
  //     if (prevFilters[key] === value) {
  //       // If the new value matches the existing value, remove the filter key
  //       const { [key]: removed, ...rest } = prevFilters;
  //       console.log('Filter after removal:', rest);
  //       return rest;
  //     } else {
  //       // Add or update the filter key-value pair
  //       const updatedFilters = { ...prevFilters, ...newFilter };
  //       console.log('Updated filters:', updatedFilters);
  //       return updatedFilters;
  //     }
  //   });
  // };


