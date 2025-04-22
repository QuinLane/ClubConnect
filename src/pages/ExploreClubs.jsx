import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExploreComponent from '../components/clubEventPages/explore';
import ClubPage from './ClubPage';

const ExploreClubs = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);


  const [clubsList, setClubsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState(null);


  const [clubDetail, setClubDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    if (clubId) return;
    setLoadingList(true);
    fetch('http://localhost:5050/api/clubs', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then(list => {
        const items = list.map(club => ({
          id: club.clubID,
          title: club.clubName,
          description: club.description || '',
          imageUrl: club.image,
        }));
        setClubsList(items);
      })
      .catch(err => setErrorList(err.message))
      .finally(() => setLoadingList(false));
  }, [clubId, token]);

  useEffect(() => {
    if (!clubId) return;
    setLoadingDetail(true);
    fetch(`http://localhost:5050/api/clubs/${clubId}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then(data => {
        setClubDetail({
          clubID: data.clubID,
          clubName: data.clubName,
          description: data.description,
          imageUrl: data.image,
          executives: data.executives,
          members: data.members,
          president: data.presidentUser,
          events: data.events,
        });
      })
      .catch(err => setErrorDetail(err.message))
      .finally(() => setLoadingDetail(false));
  }, [clubId, token]);


  if (clubId) {
    if (loadingDetail) return <div>Loading club details...</div>;
    if (errorDetail) return <div>Error loading club: {errorDetail}</div>;
    if (!clubDetail) return <div>Club not found</div>;
    return (
      <ClubPage
        {...clubDetail}
      />
    );
  }

  if (loadingList) return <div>Loading clubs...</div>;
  if (errorList) return <div>Error loading clubs: {errorList}</div>;
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px 0' }}>
      <ExploreComponent
        title="Explore Clubs"
        items={clubsList}
        type="club"
      />
    </div>
  );
};

export default ExploreClubs;
