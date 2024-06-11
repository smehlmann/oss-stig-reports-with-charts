import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState({});

  const updateFilter = (newFilter) => {
    setFilter(prevFilter => {
      const key = Object.keys(newFilter)[0];
      const value = newFilter[key];
      if (prevFilter[key] === value) {
        const { [key]: removed, ...rest } = prevFilter;
        return rest;
      } else {
        return { ...prevFilter, ...newFilter };
      }
    });
  };

  return (
    <FilterContext.Provider value={{ filter, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);