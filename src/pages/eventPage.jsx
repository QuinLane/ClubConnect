import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../components/clubEventPages/logo";
import Bio from "../components/clubEventPages/bio";

const EventPage = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserID = storedUser.userID;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExec, setIsExec] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedEventTitle, setEditedEventTitle] = useState("");
  const titleInputRef = useRef(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/events/${eventID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

        const execs = data.club?.executives || [];
        console.log("Executives:", execs);
        console.log("Current User ID:", currentUserID);
        const isExecutive = execs.some((e) => e.userID === currentUserID);
        console.log("Is Executive:", isExecutive);
        setIsExec(isExecutive);

        let eventDate = "Date TBD";
        let eventTime = "Time TBD";
        let venueName = "Venue TBD";
        let venueAddress = "Address TBD";
        if (data.reservation) {
          console.log("Reservation Start:", data.reservation.start);
          console.log("Reservation End:", data.reservation.endTime);
          const startDate = new Date(data.reservation.start);
          const endDate = new Date(data.reservation.endTime);
          console.log("Parsed Start Date:", startDate);
          console.log("Parsed End Date:", endDate);

          if (!isNaN(startDate.getTime())) {
            eventDate = startDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          }

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const startTime = startDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endTime = endDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            eventTime = `${startTime} - ${endTime}`;
          }

          if (data.reservation.venue) {
            venueName = data.reservation.venue.name || "Venue TBD";
            venueAddress = data.reservation.venue.address || "Address TBD";
          }
        }
        console.log("status: " + data.status);
        setEvent({
          eventTitle: data.name,
          logoUrl: data.club?.logo || "/images/default-club.png",
          eventPhoto: data.image || "/images/default-event.jpg",
          bioText: data.description || "No description available.",
          eventDate,
          eventTime,
          venueName,
          venueAddress,
          approvalStatus: data.status || "Pending",
          clubID: data.clubID,
        });
        setEditedEventTitle(data.name);
        setIsEditingPhoto(false);

        const rsvpRes = await fetch(
          `http://localhost:5050/api/rsvps/${eventID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (rsvpRes.ok) {
          const rsvpData = await rsvpRes.json();
          setHasRSVPed(rsvpData.some((r) => r.userID === currentUserID));
        } else if (rsvpRes.status === 404) {
          setHasRSVPed(false);
        } else {
          console.warn(`Unexpected RSVP fetch status: ${rsvpRes.status}`);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventID, token, navigate, currentUserID]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleRSVPClick = async () => {
    setRsvpLoading(true);
    try {
      const method = hasRSVPed ? "DELETE" : "POST";
      const res = await fetch(
        `http://localhost:5050/api/rsvps/${eventID}/${currentUserID}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 404) {
        console.warn(`RSVP endpoint not found: ${res.status}`);
        setHasRSVPed(!hasRSVPed);
        return;
      }

      if (!res.ok) {
        let err;
        try {
          const data = await res.json();
          err = data.error;
        } catch {
          err = await res.text();
        }
        throw new Error(err || "Failed to update RSVP");
      }

      setHasRSVPed(!hasRSVPed);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelEvent = () => {
    if (!window.confirm("Cancel this event?")) return;
    fetch(`http://localhost:5050/api/events/${eventID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel event");
        navigate("/app/explore-events");
      })
      .catch((err) => setError(err.message));
  };

  const handleBioUpdate = async (newBio) => {
    if (!token || !eventID) return;
    try {
      const response = await fetch(
        `http://localhost:5050/api/events/${eventID}`,
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
        throw new Error(errorData.error || "Failed to update event bio");
      }

      setEvent((prev) => ({
        ...prev,
        bioText: newBio,
      }));
    } catch (err) {
      console.error("Error updating event bio:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleTitleDoubleClick = () => {
    if (isExec) {
      setIsEditingTitle(true);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEventTitleUpdate();
    } else if (e.key === "Escape") {
      setEditedEventTitle(event.eventTitle);
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    handleEventTitleUpdate();
  };

  const handleEventTitleUpdate = async () => {
    if (!token || !eventID || !editedEventTitle.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5050/api/events/${eventID}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedEventTitle }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event title");
      }

      setEvent((prev) => ({
        ...prev,
        eventTitle: editedEventTitle,
      }));
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Error updating event title:", err);
      alert(`Error: ${err.message}`);
      setEditedEventTitle(event.eventTitle);
      setIsEditingTitle(false);
    }
  };

  const handlePhotoDoubleClick = () => {
    if (isExec) {
      setIsEditingPhoto(true);
      fileInputRef.current?.click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setIsEditingPhoto(false);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      setIsEditingPhoto(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `http://localhost:5050/api/events/photo/${eventID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to update event photo (HTTP ${response.status})`
        );
      }

      const updatedEvent = await response.json();
      setEvent((prev) => ({
        ...prev,
        eventPhoto: updatedEvent.image || "/images/default.webp",
      }));
      setIsEditingPhoto(false);
    } catch (err) {
      console.error("Error updating event photo:", err);
      alert(`Error updating event photo: ${err.message}`);
      setIsEditingPhoto(false);
    }
  };

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  const {
    eventTitle,
    logoUrl,
    eventPhoto,
    bioText,
    eventDate,
    eventTime,
    venueName,
    venueAddress,
    approvalStatus,
    clubID,
  } = event;

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
          backgroundColor: "#fff",
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
              value={editedEventTitle}
              onChange={(e) => setEditedEventTitle(e.target.value)}
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
              {eventTitle}
            </h1>
          )}
          <Logo imageUrl={logoUrl} size={80} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <Bio
            text={bioText}
            width="400px"
            height="400px"
            isEditable={isExec}
            onSave={handleBioUpdate}
          />
          <div
            style={{
              width: "400px",
              height: "400px",
              overflow: "hidden",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <img
              src={eventPhoto}
              alt={eventTitle}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: isExec ? "pointer" : "default",
              }}
              onDoubleClick={handlePhotoDoubleClick}
            />
            {isEditingPhoto && (
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePhotoChange}
                accept="image/*"
              />
            )}
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
              style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2c3e50" }}
            >
              {eventDate}
            </div>
            <div
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "#4a5568" }}
            >
              {eventTime}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#2c3e50",
                marginTop: "8px",
              }}
            >
              {venueName}
            </div>
            <div style={{ fontSize: "1rem", color: "#4a5568" }}>
              {venueAddress}
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleRSVPClick}
              disabled={rsvpLoading}
              style={buttonStyle(hasRSVPed ? "#e74c3c" : "#005587")}
            >
              {hasRSVPed ? "Cancel RSVP" : "RSVP Now"}
            </button>
            <button
              onClick={() => navigate(`/app/club/${clubID}`)}
              style={buttonStyle("#f57c00")}
            >
              View Club
            </button>
          </div>
        </div>

        {isExec && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#f0f0f0",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              Status:{" "}
              <strong
                style={{
                  color: approvalStatus === "Approved" ? "#388e3c" : "#e74c3c",
                }}
              >
                {approvalStatus}
              </strong>
            </span>
            <button onClick={handleCancelEvent} style={buttonStyle("#e74c3c")}>
              Cancel Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = (bg) => ({
  padding: "12px 24px",
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
});

export default EventPage;
