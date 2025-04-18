import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.inputContainer}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={styles.input}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={styles.clearButton}
              aria-label="Clear search"
            >
              <FiX style={styles.clearIcon} />
            </button>
          )}
        </div>
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1rem',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#005587',
      boxShadow: '0 0 0 2px rgba(0, 85, 135, 0.2)',
    },
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#666',
    fontSize: '1.25rem',
  },
  clearButton: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    color: '#666',
    fontSize: '1.25rem',
    ':hover': {
      color: '#333',
    },
  },
  searchButton: {
    padding: '0 1.5rem',
    borderRadius: '8px',
    backgroundColor: '#005587',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#003d66',
    },
  },
};

export default SearchBar;