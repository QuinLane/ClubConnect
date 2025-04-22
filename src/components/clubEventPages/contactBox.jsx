import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";

const Contact = ({
  email,
  socialMediaLinks,
  website,
  isEditable = false,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedSocialMediaLinks, setEditedSocialMediaLinks] =
    useState(socialMediaLinks);
  const [editedWebsite, setEditedWebsite] = useState(website);

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const socialMediaArray = [];
    if (editedSocialMediaLinks.instagram)
      socialMediaArray.push(editedSocialMediaLinks.instagram);
    if (editedSocialMediaLinks.twitter)
      socialMediaArray.push(editedSocialMediaLinks.twitter);
    if (editedSocialMediaLinks.linkedin)
      socialMediaArray.push(editedSocialMediaLinks.linkedin);
    const socialMediaLinksString = socialMediaArray.join(",");

    onSave({
      email: editedEmail,
      socialMediaLinks: socialMediaLinksString,
      website: editedWebsite,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmail(email);
    setEditedSocialMediaLinks(socialMediaLinks);
    setEditedWebsite(website);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: "min(200px, 100%)",
        backgroundColor: "#e0e0e0",
        padding: "20px",
        borderRadius: "8px",
        height: "160px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: isEditable ? "pointer" : "default",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "auto",
          }}
        >
          <div>
            <strong>Email:</strong>
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <strong>Instagram:</strong>
            <input
              type="url"
              value={editedSocialMediaLinks.instagram || ""}
              onChange={(e) =>
                setEditedSocialMediaLinks({
                  ...editedSocialMediaLinks,
                  instagram: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <strong>Twitter:</strong>
            <input
              type="url"
              value={editedSocialMediaLinks.twitter || ""}
              onChange={(e) =>
                setEditedSocialMediaLinks({
                  ...editedSocialMediaLinks,
                  twitter: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <strong>LinkedIn:</strong>
            <input
              type="url"
              value={editedSocialMediaLinks.linkedin || ""}
              onChange={(e) =>
                setEditedSocialMediaLinks({
                  ...editedSocialMediaLinks,
                  linkedin: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <strong>Website:</strong>
            <input
              type="url"
              value={editedWebsite || ""}
              onChange={(e) => setEditedWebsite(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button onClick={handleSave} style={buttonStyle("#4CAF50")}>
              Save
            </button>
            <button onClick={handleCancel} style={buttonStyle("#f44336")}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#2c3e50" }}>
            Contact
          </h3>
          <div style={{ fontSize: "0.95rem", color: "#444" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Email:</strong> {email}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {socialMediaLinks.instagram && (
                <a
                  href={socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "1.2rem", color: "#444" }}
                >
                  <FaInstagram />
                </a>
              )}
              {socialMediaLinks.twitter && (
                <a
                  href={socialMediaLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "1.2rem", color: "#444" }}
                >
                  <FaTwitter />
                </a>
              )}
              {socialMediaLinks.linkedin && (
                <a
                  href={socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "1.2rem", color: "#444" }}
                >
                  <FaLinkedin />
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "1.2rem", color: "#444" }}
                >
                  <BsGlobe />
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const buttonStyle = (bgColor) => ({
  padding: "10px 20px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
  minWidth: "100px",
});

export default Contact;
