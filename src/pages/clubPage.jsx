import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';
import CompressedEventCarousel from '../components/clubEventPages/compressedEventCarosel';
import Contact from '../components/clubEventPages/contactBox';

const ClubPage = () => {
  const { clubID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserID = storedUser.userID;

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExec, setIsExec] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5050/api/clubs/${clubID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

        // Check if current user is an executive or member
        const execList = data.executives || [];
        const memberList = data.members || [];
        setIsExec(execList.some(e => e.userID === currentUserID));
        setIsMember(memberList.some(m => m.userID === currentUserID));

        // shape upcoming events
        const upcomingEvents = (data.events || []).map(evt => ({
          imageUrl: evt.image || '/images/event-default.png',
          title: evt.name,
          date: evt.reservation?.date
            ? new Date(evt.reservation.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : 'Date TBD',
          titleOnImage: true
        }));

        setClub({
          clubName: data.clubName,
          logoUrl: data.image || '/images/default-club.png',
          bioText: data.description || 'No description available.',
          memberCount: memberList.length,
          upcomingEvents,
          contact: {
            email: data.clubEmail,
            instagram: data.socialMediaLinks?.instagram,
            website: data.website
          }
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubID, token, navigate, currentUserID]);

  const handleJoinClub = async () => {
    if (!token || !clubID) return;
    
    try {
      setJoinLoading(true);
      setJoinError(null);
      
      const response = await fetch(`http://localhost:5050/api/clubs/${clubID}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join club');
      }
  
      // Update member status
      setIsMember(true);
      setClub(prev => ({
        ...prev,
        memberCount: prev.memberCount + 1
      }));
  
    } catch (err) {
      console.error("Error joining club:", err);
      setJoinError(err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) return <div>Loading club...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!club) return <div>Club not found</div>;

  const { clubName, logoUrl, bioText, memberCount, upcomingEvents, contact } = club;

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, flex: 1, color: '#2c3e50', lineHeight: '1.2' }}>{clubName}</h1>
          <Logo imageUrl={logoUrl} size={80} />
        </div>

        {/* Bio & Contact */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          <div style={{ flex: 2, minWidth: '300px', height: '200px' }}>
            <Bio text={bioText} width="100%" height="100%" />
          </div>
          <div style={{ flex: 1, minWidth: '200px', height: '200px' }}>
            <Contact email={contact.email} instagram={contact.instagram} website={contact.website} />
          </div>
        </div>

        {/* Members & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2c3e50' }}>
              Number of members: {memberCount}
            </div>
            {joinError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {joinError}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {isExec ? (
              <>  
                <button onClick={() => navigate(`/app/events/create?club=${clubID}`)} style={buttonStyle('#388e3c')}>Create Event</button>
                <button onClick={() => navigate(`/app/manage-members/${clubID}`)} style={buttonStyle('#f57c00')}>Manage Members</button>
              </>
            ) : isMember ? (
              <button disabled style={buttonStyle('#cccccc')}>Already a Member</button>
            ) : (
              <>  
                <button 
                  onClick={handleJoinClub} 
                  disabled={joinLoading}
                  style={buttonStyle('#005587', joinLoading)}
                >
                  {joinLoading ? 'Joining...' : 'Join Club'}
                </button>
                <button onClick={() => alert('Apply for Position')} style={buttonStyle('#f57c00')}>Apply for Position</button>
              </>
            )}
          </div>
        </div>

        {/* Events Carousel */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '40px' }}>
          <CompressedEventCarousel events={upcomingEvents} title="Upcoming Events" carouselHeight="240px" />
        </div>
      </div>
    </div>
  );
};

const buttonStyle = (bg, disabled = false) => ({
  padding: '12px 24px',
  backgroundColor: disabled ? '#cccccc' : bg,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s',
  opacity: disabled ? 0.7 : 1
});

export default ClubPage;