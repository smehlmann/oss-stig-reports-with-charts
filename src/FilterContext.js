
/**
  The following defines a custom context for managing a filter state using the "FilterProvider" component to manage this state.
  The useFilter hook is also created to access and update the filter state from any component within the context of "FilterProvider"
 
 */

  import React, { createContext, useState, useContext } from 'react';

  const FilterContext = createContext();
  
  /*
  The FilterProvider component wraps its children with the FilterContext.Provider and manages the 'filter' state using the 'useState' hook. It also provides the updateFilter function to update the filter state.
  */
  export const FilterProvider = ({ children }) => {
    //initializes filter as empty object
    const [filter, setFilters] = useState({});
  
    /* Merges new filter with the previous filters so they can be applied at the same time. Does not remove any keys*/
    const updateFilter = (newFilter) => {
      setFilters(prevFilters => {
        const key = Object.keys(newFilter)[0];
        const value = newFilter[key];
  
        if (prevFilters[key] === value) {
          // If the new value is the same as the current value for the key, remove the key from the filter.
          const { [key]: removed, ...rest } = prevFilters;
          return rest;
        } else {
          // Otherwise, update the filter with the new key-value pair.
          return { ...prevFilters, ...newFilter };
        }
      });
    };

    const clearFilter = () => {
      setFilters({});
    };
  
    return (
      //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
      <FilterContext.Provider value={{ filter, updateFilter, clearFilter }}>
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
//   const updateFilter = (newFilter) => {
//     setFilter(prevFilter => {
//       const key = Object.keys(newFilter)[0];
//       const value = newFilter[key];

//       //if new filter value === previous value for the key, it removes current key from filter. Otherwise, it updates the filter with new key-value pair.
//       if (prevFilter[key] === value) {
//         const { [key]: removed, ...rest } = prevFilter;
//         return rest;
//       } else {
//         return { ...prevFilter, ...newFilter };
//       }
//     });
//   };

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


