import React, { useState } from 'react';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';
import Carousel from '../components/clubEventPages/compressedEventCarosel'; // Add this import

const EventPage = ({ 
  eventTitle = "Annual Charity Gala", 
  logoUrl = "/images/club-logo.png",
  eventPhoto = "/images/event-photo.jpg",
  bioText = `...`,
  eventDate = "Saturday, November 18, 2023",
  eventTime = "6:30 PM - 11:00 PM",
  logoSize = 80,
  titleSize = '2rem',
  carouselImages = [ // Add this new prop for carousel images
    "/images/event-gallery1.jpg",
    "/images/event-gallery2.jpg",
    "/images/event-gallery3.jpg"
  ]
}) => {
  const [isRSVPed, setIsRSVPed] = useState(false);

  const handleRSVPClick = () => {
    setIsRSVPed(!isRSVPed);
  };

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '20px',
      boxSizing: 'border-box',
      margin: 0,
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        {/* Title and Logo Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{
            fontSize: titleSize,
            margin: 0,
            flex: 1,
            minWidth: 'min(300px, 100%)',
            color: '#2c3e50',
            lineHeight: '1.2'
          }}>
            {eventTitle}
          </h1>
          
          <div style={{ 
            marginLeft: '20px',
            flexShrink: 0 
          }}>
            <Logo imageUrl={logoUrl} size={logoSize} />
          </div>
        </div>

        {/* Photo and Bio Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <Bio 
            text={bioText} 
            width={'400px'}
            height={'400px'}
          />

          <div style={{
            width: '400px',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            flexShrink: 0
          }}>
            <img 
              src={eventPhoto} 
              alt={eventTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        </div>

        {/* Date/Time and Buttons Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px' // Added margin to separate from carousel
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              {eventDate}
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#4a5568'
            }}>
              {eventTime}
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleRSVPClick}
              style={{
                padding: '12px 24px',
                backgroundColor: isRSVPed ? '#388e3c' : '#005587',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: isRSVPed ? '#2e7d32' : '#003d66'
                }
              }}
            >
              {isRSVPed ? 'RSVP Confirmed!' : 'RSVP Now'}
            </button>
            
            <button style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#005587',
              border: '2px solid #005587',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ':hover': {
                backgroundColor: '#f0f7ff'
              }
            }}>
              View Club
            </button>
          </div>
        </div>

        {/* New Carousel Section */}
        <div style={{
          marginTop: '60px',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '40px'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Event Gallery
          </h2>
          <Carousel 
            images={carouselImages}
            autoPlay={true}
            interval={4000} // 4 seconds between slides
          />
        </div>
      </div>
    </div>
  );
};

export default EventPage;