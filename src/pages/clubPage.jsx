import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../components/clubEventPages/logo";
import Bio from "../components/clubEventPages/bio";
import CompressedEventCarousel from "../components/clubEventPages/compressedEventCarosel";
import Contact from "../components/clubEventPages/contactBox";

const ClubPage = () => {
  const { clubID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserID = storedUser.userID;

  const [club, setClub] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExec, setIsExec] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedClubName, setEditedClubName] = useState("");
  const titleInputRef = useRef(null);

  const fetchClub = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5050/api/clubs/${clubID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          // Invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const execList = data.executives || [];
      const memberList = data.members || [];
      const userExecRole = execList.find(
        (e) => e.userID === currentUserID
      )?.role;
      setIsExec(!!userExecRole);
      setIsMember(memberList.some((m) => m.userID === currentUserID));

      const socialMediaLinks = {};
      if (data.socialMediaLinks) {
        const linksArray = data.socialMediaLinks
          .split(",")
          .map((link) => link.trim());
        linksArray.forEach((link) => {
          if (link.includes("instagram.com")) socialMediaLinks.instagram = link;
          else if (link.includes("twitter.com") || link.includes("x.com"))
            socialMediaLinks.twitter = link;
          else if (link.includes("linkedin.com"))
            socialMediaLinks.linkedin = link;
        });
      }

      setClub({
        clubName: data.clubName,
        logoUrl: data.image || "/images/default-club.png",
        bioText: data.description || "No description available.",
        memberCount: memberList.length,
        contact: {
          email: data.clubEmail,
          socialMediaLinks,
          website: data.website,
        },
        userRole: userExecRole || null,
      });
      setEditedClubName(data.clubName);
    } catch (err) {
      console.error(err);
      if (err.message.includes("Invalid token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false); // Ensure loading is reset even on error
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUpcoming = async () => {
      try {
        const res = await fetch(
          `http://localhost:5050/api/events/upcoming/club/${clubID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            // Invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error(data.error || `HTTP ${res.status}`);
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Expected an array of events but got something else."
          );
        }

        setUpcomingEvents(
          data.map((evt) => ({
            id: evt.eventID,
            imageUrl: evt.image,
            title: evt.name,
            date: evt.reservation.start,
          }))
        );
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        if (err.message.includes("Invalid token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        // Optionally set an error state for upcoming events
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
    fetchUpcoming();
  }, [clubID, token, navigate, currentUserID]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleBioUpdate = async (newBio) => {
    if (!token || !clubID) return;
    try {
      const response = await fetch(
        `http://localhost:5050/api/clubs/${clubID}/bio`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: newBio }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bio");
      }

      setClub((prev) => ({
        ...prev,
        bioText: newBio,
      }));
    } catch (err) {
      console.error("Error updating bio:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleContactUpdate = async (updatedContact) => {
    if (!token || !clubID) return;

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedContact.email)) {
      alert("Error: Please enter a valid email address");
      return;
    }

    if (updatedContact.website && !updatedContact.website.startsWith("http")) {
      updatedContact.website = `https://${updatedContact.website}`;
    }

    try {
      console.log("Updating contact with payload:", updatedContact);

      const response = await fetch(
        `http://localhost:5050/api/clubs/${clubID}/contact`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clubEmail: updatedContact.email,
            socialMediaLinks: updatedContact.socialMediaLinks,
            website: updatedContact.website,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update contact");
      }

      setClub((prev) => ({
        ...prev,
        contact: {
          email: updatedContact.email,
          socialMediaLinks: prev.contact.socialMediaLinks, // Will be updated via fetchClub
          website: updatedContact.website,
        },
      }));

      // Re-fetch the club to ensure socialMediaLinks is parsed correctly
      console.log("Fetching club after contact update...");
      await fetchClub();
    } catch (err) {
      console.error("Error in handleContactUpdate:", err);
      if (err.message.includes("Invalid token")) {
        // Suppress alert; fetchClub will handle redirect
        return;
      }
      alert(`Error: ${err.message}`);
    }
  };

  const handleClubNameUpdate = async () => {
    if (!token || !clubID || !editedClubName.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5050/api/clubs/${clubID}/name`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clubName: editedClubName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update club name");
      }

      setClub((prev) => ({
        ...prev,
        clubName: editedClubName,
      }));
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Error updating club name:", err);
      alert(`Error: ${err.message}`);
      setEditedClubName(club.clubName);
      setIsEditingTitle(false);
    }
  };

  const handleTitleDoubleClick = () => {
    if (isExec) {
      setIsEditingTitle(true);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClubNameUpdate();
    } else if (e.key === "Escape") {
      setEditedClubName(club.clubName);
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    handleClubNameUpdate();
  };

  const handleJoinClub = async () => {
    if (!token || !clubID) return;
    try {
      setJoinLoading(true);
      const response = await fetch(
        `http://localhost:5050/api/clubs/${clubID}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join club");
      }
      setIsMember(true);
      setClub((prev) => ({
        ...prev,
        memberCount: prev.memberCount + 1,
      }));
    } catch (err) {
      console.error("Error joining club:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (!token || !clubID) return;
    try {
      setLeaveLoading(true);
      const response = await fetch(
        `http://localhost:5050/api/clubs/${clubID}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave club");
      }
      setIsMember(false);
      setClub((prev) => ({
        ...prev,
        memberCount: prev.memberCount - 1,
      }));
    } catch (err) {
      console.error("Error leaving club:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLeaveLoading(false);
    }
  };

  if (loading) return <div>Loading club...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!club) return <div>Club not found</div>;

  const { clubName, logoUrl, bioText, memberCount, contact, userRole } = club;

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedClubName}
              onChange={(e) => setEditedClubName(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              style={{
                fontSize: "2rem",
                margin: 0,
                flex: 1,
                color: "#2c3e50",
                lineHeight: "1.2",
                border: "1px solid #ddd",
                padding: "4px",
                borderRadius: "4px",
              }}
            />
          ) : (
            <h1
              style={{
                fontSize: "2rem",
                margin: 0,
                flex: 1,
                color: "#2c3e50",
                lineHeight: "1.2",
                cursor: isExec ? "pointer" : "default",
              }}
              onDoubleClick={handleTitleDoubleClick}
            >
              {clubName}
            </h1>
          )}
          <Logo imageUrl={logoUrl} size={80} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div style={{ flex: 2, minWidth: "300px", height: "200px" }}>
            <Bio
              text={bioText}
              width="100%"
              height="100%"
              isEditable={isExec}
              onSave={handleBioUpdate}
            />
          </div>
          <div style={{ flex: 1, minWidth: "200px", height: "200px" }}>
            <Contact
              email={contact.email}
              socialMediaLinks={contact.socialMediaLinks}
              website={contact.website}
              isEditable={isExec}
              onSave={handleContactUpdate}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#2c3e50",
              }}
            >
              Number of members: {memberCount}
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {isExec ? (
              <>
                {userRole === "President" && (
                  <button
                    onClick={() => navigate(`/app/manage-members/${clubID}`)}
                    style={buttonStyle("#f57c00")}
                  >
                    Manage Members
                  </button>
                )}
              </>
            ) : (
              <>
                {isMember ? (
                  <button
                    onClick={handleLeaveClub}
                    disabled={leaveLoading}
                    style={buttonStyle("#4CAF50", leaveLoading)}
                  >
                    {leaveLoading ? "Leaving..." : "Joined Club"}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClub}
                    disabled={joinLoading}
                    style={buttonStyle("#005587", joinLoading)}
                  >
                    {joinLoading ? "Joining..." : "Join Club"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Events Carousel */}
        <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "40px" }}>
          <CompressedEventCarousel
            items={upcomingEvents}
            title="Upcoming Events"
            type="event"
          />
        </div>
      </div>
    </div>
  );
};

const buttonStyle = (bg, disabled = false) => ({
  padding: "12px 24px",
  backgroundColor: disabled ? "#cccccc" : bg,
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background-color 0.2s",
  opacity: disabled ? 0.7 : 1,
});

export default ClubPage;
