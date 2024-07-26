
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
      setFilters(prevFilters => {
        const key = Object.keys(newFilter)[0];
        const value = newFilter[key];
    
        // console.log(`Current filters: ${JSON.stringify(prevFilters)}`);
        // console.log(`New filter: ${key} = ${value} from ${source}`);
    
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
            return rest;
          } 
          //if no double-click
          else {
            //update add key-value pair in filters (toggling on)
            const updatedFilters = { ...prevFilters, ...newFilter };
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
  



// import React, { createContext, useState, useContext } from 'react';

// const FilterContext = createContext();

// /*
// The FilterProvider component wraps its children with the FilterContext.Provider and manages the 'filter' state using the 'useState' hook. It also provides the updateFilter function to update the filter state.
// */
// export const FilterProvider = ({ children }) => {
//   //initializes filter as empty object
//   const [filter, setFilter] = useState({});

//   /* checks if the new filter value is the same as the existing value for the given key. If it is, it removes the key from the filter. Otherwise, it updates the filter with the new key-value pair. This allows toggling filters on and off. */
  // const updateFilter = (newFilter) => {
  //   setFilter(prevFilter => {
  //     const key = Object.keys(newFilter)[0];
  //     const value = newFilter[key];

  //     //if new filter value === previous value for the key, it removes current key from filter. Otherwise, it updates the filter with new key-value pair.
  //     if (prevFilter[key] === value) {
  //       const { [key]: removed, ...rest } = prevFilter;
  //       return rest;
  //     } else {
  //       return { ...prevFilter, ...newFilter };
  //     }
  //   });
  // };

//   const clearFilter = () => {
//     setFilter({});
//   };

//   return (
//     //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
//     <FilterContext.Provider value={{ filter, updateFilter, clearFilter }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };

// export const useFilter = () => useContext(FilterContext);


