// Dropdown.js
import React, { useState, useEffect, useRef } from 'react';

const MultiSelectDropdown = (options) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  //const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    if (selectedValues.includes(option)) {
      setSelectedValues(selectedValues.filter((value) => value !== option));
    } else {
      setSelectedValues([...selectedValues, option]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {selectedValues.length > 0 ? selectedValues.join(', ') : 'Select benchmark IDs'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <input
            type="text"
            className="dropdown-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`dropdown-item ${selectedValues.includes(option) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleOptionClick(option)}
                  />
                  {option}
                </li>
              ))
            ) : (
              <li className="dropdown-item">Selection not found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
