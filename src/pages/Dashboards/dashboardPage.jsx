import React, { useState, useEffect } from "react";
import CompressedEventCarousel from "../../components/clubEventPages/compressedEventCarosel";

const DashboardPage = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserID = user.userID;

  // State for RSVP'd events
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);

  // State for member clubs
  const [memberClubs, setMemberClubs] = useState([]);
  const [loadingMemberClubs, setLoadingMemberClubs] = useState(false);
  const [errorMemberClubs, setErrorMemberClubs] = useState(null);

  // State for managed clubs
  const [managedClubs, setManagedClubs] = useState([]);
  const [loadingManagedClubs, setLoadingManagedClubs] = useState(false);
  const [errorManagedClubs, setErrorManagedClubs] = useState(null);

  // Helper function to create event elements
  const createEventElements = (events) => {
    return events.map((event) => {
      let eventDate = "Date TBD";
      if (event.reservation?.start) {
        const startDate = new Date(event.reservation.start);
        if (!isNaN(startDate.getTime())) {
          eventDate = startDate.toISOString();
        }
      }
      return {
        id: event.eventID,
        imageUrl: event.image || "/images/default-event.jpg",
        title: event.name,
        date: eventDate,
        type: "event",
      };
    });
  };

  // In DashboardPage.js
  const createClubElements = (clubs) => {
    return clubs.map((club) => ({
      id: club.clubID,
      imageUrl: club.image,
      // imageUrl: club.image || '/images/default-club.png',
      title: club.clubName,
      date: "", // Clubs don't need dates
      type: "club",
    }));
  };

  // Update the carousel rendering to include type prop
  <CompressedEventCarousel
    items={managedClubs}
    title="Clubs I Manage"
    showTitle={true}
    itemType="club" // Explicitly tell carousel these are clubs
  />;
  // Fetch user's RSVP'd events
  useEffect(() => {
    const fetchUserRSVPs = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch(
          `http://localhost:5050/api/rsvps/user/${currentUserID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch RSVPs");

        const rsvps = await response.json();
        const events = rsvps.map((rsvp) => rsvp.event);
        const eventElements = createEventElements(events);

        // Sort events by date (newest first)
        const sortedEvents = eventElements.sort((a, b) => {
          if (a.date === "Date TBD" && b.date === "Date TBD") return 0;
          if (a.date === "Date TBD") return 1;
          if (b.date === "Date TBD") return -1;
          return new Date(b.date) - new Date(a.date);
        });

        setMyEvents(sortedEvents);
      } catch (err) {
        setErrorEvents(err.message);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (currentUserID) fetchUserRSVPs();
  }, [currentUserID, token]);

  // Fetch member clubs
  useEffect(() => {
    const fetchMemberClubs = async () => {
      try {
        setLoadingMemberClubs(true);
        const response = await fetch(
          `http://localhost:5050/api/clubs/user/${currentUserID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch member clubs");

        const clubs = await response.json();
        const clubElements = createClubElements(clubs);
        setMemberClubs(clubElements);
      } catch (err) {
        setErrorMemberClubs(err.message);
      } finally {
        setLoadingMemberClubs(false);
      }
    };

    if (currentUserID) fetchMemberClubs();
  }, [currentUserID, token]);

  // Fetch managed clubs using getUserExecClubs
  useEffect(() => {
    const fetchManagedClubs = async () => {
      try {
        setLoadingManagedClubs(true);
        const response = await fetch(
          `http://localhost:5050/api/clubs/user-exec/${currentUserID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch managed clubs");

        const clubs = await response.json();
        const clubElements = createClubElements(clubs);
        setManagedClubs(clubElements);
      } catch (err) {
        setErrorManagedClubs(err.message);
      } finally {
        setLoadingManagedClubs(false);
      }
    };

    if (currentUserID) fetchManagedClubs();
  }, [currentUserID, token]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#1f2937",
        minHeight: "100vh",
      }}
    >
      {/* Header with gray bar */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "40px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#005587",
            margin: 0,
            textAlign: "center",
            fontSize: "2rem",
          }}
        >
          My Dashboard
        </h1>
      </div>

      {/* Clubs I Manage (Executive) */}
      {loadingManagedClubs ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading your managed clubs...
        </div>
      ) : errorManagedClubs ? (
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading managed clubs: {errorManagedClubs}
        </div>
      ) : (
        <CompressedEventCarousel
          items={managedClubs}
          title="Clubs I Manage"
          showTitle={true}
          type="club"
        />
      )}

      {/* Clubs I'm a Member Of */}
      {loadingMemberClubs ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading your clubs...
        </div>
      ) : errorMemberClubs ? (
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading clubs: {errorMemberClubs}
        </div>
      ) : (
        <CompressedEventCarousel
          items={memberClubs}
          title="Clubs I'm a Member Of"
          showTitle={true}
          type="club"
        />
      )}

      {/* My Events (RSVP'd) */}
      {loadingEvents ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading your events...
        </div>
      ) : errorEvents ? (
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading events: {errorEvents}
        </div>
      ) : (
        <CompressedEventCarousel
          items={myEvents}
          title="My Events"
          showTitle={true}
        />
      )}
    </div>
  );
};

export default DashboardPage;
