import React, { useState } from 'react';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';

const EventPage = ({ 
  eventTitle = "Annual Charity Gala", 
  logoUrl = "/images/club-logo.png",
  eventPhoto = "/images/event-photo.jpg",
  bioText = `Join us for an evening of fundraising and celebration at our annual charity gala. All proceeds will benefit local education initiatives.`,
  eventDate = "Saturday, November 18, 2023",
  eventTime = "6:30 PM - 11:00 PM",
  logoSize = 80,
  isExec = false,
  approvalStatus = "Pending",
  onCancelEvent = () => {}
}) => {
  const [isRSVPed, setIsRSVPed] = useState(false);

  const handleRSVPClick = () => {
    setIsRSVPed(!isRSVPed);
  };

  const handleCancelEvent = () => {
    if (window.confirm("Are you sure you want to cancel this event?")) {
      onCancelEvent();
    }
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
            fontSize: '2rem',
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
          marginBottom: '40px'
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

        {/* Approval Status for Executives */}
        {isExec && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            <div>
              Approval Status: <span style={{ color: approvalStatus === 'Approved' ? '#388e3c' : '#e74c3c' }}>{approvalStatus}</span>
            </div>
            <button 
              onClick={handleCancelEvent}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              Cancel Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;