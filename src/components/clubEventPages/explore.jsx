import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX } from 'react-icons/fi';
import EventCompressed from '../clubEventPages/compressedElements';

const ExploreComponent = ({ title, items = [], type = 'event' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = items.filter(item => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchTerm) ||
      (item.date && item.date.toLowerCase().includes(searchTerm)) ||
      (item.startTime && item.startTime.toLowerCase().includes(searchTerm)) ||
      (item.clubName && item.clubName.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div style={{
      ...styles.container,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Fixed Header Section */}
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type}s by name, date, time, or club...`}
              style={styles.searchInput}
            />
            {searchQuery && (
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
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div style={styles.scrollableContent}>
        {filteredItems.length > 0 ? (
          <div style={styles.grid}>
            {filteredItems.map((item) => (
              <EventCompressed
                key={item.id} 
                id={item.id}
                imageUrl={item.imageUrl || item.image}
                title={item.title || item.name}
                date={item.date || item.reservation?.date}
                startTime={item.startTime || item.reservation?.startTime}
                endTime={item.endTime || item.reservation?.endTime}
                clubName={item.clubName || item.club?.name}
                type={type}
              />
            ))}
          </div>
        ) : (
          <div style={styles.noResults}>
            No {type}s found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    padding: '20px',
    flexShrink: 0
  },
  title: {
    color: '#2c3e50',
    fontSize: '1.8rem',
    marginBottom: '20px',
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInputContainer: {
    position: 'relative',
    maxWidth: '600px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#005587',
      boxShadow: '0 0 0 2px rgba(0, 85, 135, 0.2)',
    },
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: '#666',
    fontSize: '1.25rem',
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  clearIcon: {
    color: '#666',
    fontSize: '1.25rem',
    ':hover': {
      color: '#333',
    },
  },
  scrollableContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 20px 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    padding: '10px',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
    padding: '40px 0',
  },
};

ExploreComponent.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      imageUrl: PropTypes.string,
      image: PropTypes.string, 
      title: PropTypes.string,
      name: PropTypes.string, 
      date: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      clubName: PropTypes.string,
      club: PropTypes.shape({
        name: PropTypes.string
      }),
      reservation: PropTypes.shape({
        date: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string
      }),
      description: PropTypes.string
    })
  ),
  type: PropTypes.oneOf(['event', 'club']),
};

ExploreComponent.defaultProps = {
  items: [],
  type: 'event',
};

export default ExploreComponent;