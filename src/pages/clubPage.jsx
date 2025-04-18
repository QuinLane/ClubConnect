import React, { useState } from 'react';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';
import CompressedEventCarousel from '../components/clubEventPages/compressedEventCarosel'; // Check spelling if needed
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Contact from '../components/clubEventPages/contactBox'; // Import the Contact component

const ClubPage = ({
  clubName = "Kya Slay Club",
  logoUrl = "/images/club-logo.png",
  bioText = `This club is super fun fun fun sdncskjdnkjsnkdsncs
  skjdcnksdckjsndkcnsdcksjnckjsdn
  ksjdcnskncksnckjsnkjsns
  skdjcnksnksjnksdnckjsjcnksdcjsk
  hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
  hhhhhh
  hhhhhhhhhhhhhhhhhhhhh`,
  memberCount = 42,
  logoSize = 80,
  titleSize = '2rem',
  isExec = true, // Add the isExec prop to check if the user is an exec
}) => {
  const [isRSVPed, setIsRSVPed] = useState(false);

  const handleRSVPClick = () => {
    setIsRSVPed(!isRSVPed);
  };

  const upcomingEvents = [
    { imageUrl: "/images/event1.jpg", title: "Monthly Meetup", date: "June 15, 2023", titleOnImage: true },
    { imageUrl: "/images/event2.jpg", title: "Workshop Series", date: "June 22, 2023", titleOnImage: true },
    { imageUrl: "/images/event3.jpg", title: "Annual Gala", date: "July 5, 2023", titleOnImage: false },
    { imageUrl: "/images/event4.jpg", title: "Member Social", date: "July 15, 2023", titleOnImage: true },
    { imageUrl: "/images/event5.jpg", title: "Fundraiser", date: "August 2, 2023", titleOnImage: false },
    { imageUrl: "/images/event1.jpg", title: "Monthly Meetup4", date: "June 15, 2023", titleOnImage: true },
    { imageUrl: "/images/event1.jpg", title: "Monthly Meetup3", date: "June 15, 2023", titleOnImage: true },
    { type: "club", imageUrl: "/images/club-logo.png", title: "Chess Enthusiasts" }, // 👈 Club example
  ];

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
            {clubName}
          </h1>
          <div style={{ marginLeft: '20px', flexShrink: 0 }}>
            <Logo imageUrl={logoUrl} size={logoSize} />
          </div>
        </div>

        {/* Bio and Contact Section */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Bio - 2/3 Width */}
          <div style={{
            flex: 2,
            minWidth: 'min(300px, 100%)',
            height: '200px'
          }}>
            <Bio 
              text={bioText} 
              width="100%"
              height="100%"
            />
          </div>

          {/* Contact Section - 1/3 Width */}
          <div style={{
            flex: 1,
            minWidth: 'min(200px, 100%)',
            height: '200px'
          }}>
            <Contact 
              email="example@club.com" 
              instagram="@clubhandle"
              website="https://www.clubwebsite.com"
            />
          </div>
        </div>

        {/* Member Count and Join Button */}
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
              Number of members: {memberCount}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Conditionally render buttons based on whether the user is an exec */}
            {isExec ? (
              <>
                <button
                  onClick={() => alert("Create event functionality")}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#388e3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Create Event
                </button>
                <button
                  onClick={() => alert("Manage members functionality")}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f57c00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Manage Members
                </button>
              </>
            ) : (
              <>
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
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isRSVPed ? 'Joined!' : 'Join Club'}
                </button>
                <button
                  onClick={() => alert("Redirect to application form")}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f57c00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Apply for Position
                </button>
              </>
            )}
          </div>
        </div>

        {/* Events Carousel */}
        <div style={{
          marginTop: '60px',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '40px'
        }}>
          <CompressedEventCarousel
            events={upcomingEvents}
            title="Upcoming Events"
            carouselHeight="240px"
          />
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
