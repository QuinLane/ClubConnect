import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const EventCompressed = ({
  id,
  imageUrl = "/images/default-event.jpg",
  title = "Event Title",
  date = "",
  width = "280px",
  height = "200px",
  borderRadius = "12px",
  type = "event"
}) => {
  const navigate = useNavigate();

  // Format only the date for display
  const formatDate = () => {
    if (!date) return '';
    
    try {
      const eventDate = new Date(date);
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      };
      return eventDate.toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return date; // Fallback to raw date string
    }
  };

  const handleClick = () => {
    navigate(`/app/events/${id}`, { 
      state: { 
        title, 
        imageUrl, 
        date,
        type 
      } 
    });
  };

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, filter 0.3s ease',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#e0e0e0',
          position: 'relative',
          filter: 'brightness(100%)',
          transition: 'filter 0.3s ease',
        }}
        className="event-compressed-image"
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
          }}
        >
          {type === 'event' && (
            <div
              style={{
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                marginBottom: '4px',
              }}
            >
              {formatDate()}
            </div>
          )}
          <div
            style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

EventCompressed.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  type: PropTypes.oneOf(['event', 'club']),
};

EventCompressed.defaultProps = {
  imageUrl: '/images/default-event.jpg',
  width: '280px',
  height: '200px',
  borderRadius: '12px',
  type: 'event',
};

export default EventCompressed;