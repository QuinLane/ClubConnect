import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EventCompressed from '../clubEventPages/compressedElements';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CompressedEventCarousel = ({
  events = [],
  title = "Upcoming Events",
  showTitle = true
}) => {
  const visibleCount = Math.min(3, events.length);
  const totalPages = Math.ceil(events.length / visibleCount);
  const [currentPage, setCurrentPage] = useState(0);

  const nextSlide = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getVisibleEvents = () => {
    const start = currentPage * visibleCount;
    return events.slice(start, start + visibleCount);
  };

  const cardWidth = `calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`;
  const isLastPage = currentPage === totalPages - 1;
  const remainingItems = events.length - currentPage * visibleCount;
  const hasPartialGroup = isLastPage && remainingItems < visibleCount && remainingItems > 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '30px auto',
      padding: '0 20px',
      boxSizing: 'border-box'
    }}>
      {showTitle && (
        <h2 style={{
          fontSize: '1.8rem',
          color: '#2d3748',
          marginBottom: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {title}
        </h2>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          style={arrowStyle}
          aria-label="Previous events"
        >
          <FaChevronLeft />
        </button>

        {/* Events Container */}
        <div style={{
          display: 'flex',
          gap: '20px',
          width: '100%',
          overflow: 'hidden',
          justifyContent: hasPartialGroup ? 'flex-start' : 'center',
          paddingLeft: hasPartialGroup ? 'calc((100% - (280px * 3 + 40px)) / 2)' : '0'
        }}>
          {getVisibleEvents().map((event, index) => (
            <div key={`${currentPage}-${index}`} style={{
              flex: `0 0 ${cardWidth}`,
              maxWidth: '280px',
              minWidth: '200px',
              height: '140px',
              transition: 'transform 0.3s ease',
              marginLeft: hasPartialGroup && index === 0 ? 'calc((100% - (280px * remainingItems + 20px * (remainingItems - 1))) / 2)' : '0'
            }}>
              <EventCompressed
                imageUrl={event.imageUrl}
                title={event.title}
                date={event.date}
                width="100%"
                height="100%"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          style={arrowStyle}
          aria-label="Next events"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots Indicator */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '24px'
        }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentPage === i ? '#005587' : '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              aria-label={`View events ${i * visibleCount + 1}-${(i + 1) * visibleCount}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const arrowStyle = {
  background: 'white',
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  fontSize: '20px',
  color: '#005587',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s',
  outline: 'none',
};

CompressedEventCarousel.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired,
  title: PropTypes.string,
  showTitle: PropTypes.bool
};

export default CompressedEventCarousel;