import React, { createContext, useState, useContext } from 'react';

/**
  The following defines a custom context for managing a filter state using the "FilterProvider" component to manage this state.
  The useFilter hook is also created to access and update the filter state from any component within the context of "FilterProvider"
 
 */
const FilterContext = createContext();

/*
The FilterProvider component wraps its children with the FilterContext.Provider and manages the 'filter' state using the 'useState' hook. It also provides the updateFilter function to update the filter state.
*/
export const FilterProvider = ({ children }) => {
  //initializes filter as empty object
  const [filter, setFilter] = useState({});

  /*Based on the newFilter, the 'filter' state is updated */
  const updateFilter = (newFilter) => {
    setFilter(prevFilter => {
      const key = Object.keys(newFilter)[0];
      const value = newFilter[key];

      //if new filter value === previous value for the key, it removes current key from filter. Otherwise, it updates the filter with new key-value pair.
      if (prevFilter[key] === value) {
        const { [key]: removed, ...rest } = prevFilter;
        return rest;
      } else {
        return { ...prevFilter, ...newFilter };
      }
    });
  };

  return (
    //provides 'filter' state and 'updateFilter' to all components nested in FilterProvider
    <FilterContext.Provider value={{ filter, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);


