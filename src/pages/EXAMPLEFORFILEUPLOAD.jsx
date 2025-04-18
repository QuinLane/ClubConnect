



//This is the code chatgpt gave me for UPLOADING IMAGE

/**
 * 
 * in the forms, you would ned to add a file input and send the request as multipart/form-data
 * 
 * 
 */


import React, { useState } from "react";
import axios from "axios";

const CreateClubForm = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    president: "",
    socialMediaLinks: [],
    website: "",
    clubEmail: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("clubName", formData.clubName);
    data.append("description", formData.description);
    data.append("president", formData.president);
    data.append("socialMediaLinks", JSON.stringify(formData.socialMediaLinks));
    data.append("website", formData.website);
    data.append("clubEmail", formData.clubEmail);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.post("/api/clubs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Club created:", response.data);
    } catch (error) {
      console.error("Error creating club:", error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="clubName"
        value={formData.clubName}
        onChange={handleChange}
        placeholder="Club Name"
        required
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="president"
        value={formData.president}
        onChange={handleChange}
        placeholder="President ID"
        required
      />
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="Website"
      />
      <input
        type="text"
        name="clubEmail"
        value={formData.clubEmail}
        onChange={handleChange}
        placeholder="Club Email"
      />
      <input
        type="file"
        name="image"
        onChange={handleFileChange}
        accept="image/*"
      />
      <button type="submit">Create Club</button>
    </form>
  );
};

export default CreateClubForm;

//NOTES ON THIS:
/**
 * Use FormData to send multipart/form-data
 * socialmediaLinks is stringified because FormData sends values as strings
 * accept="image/*" attribute restricts uploads to images
 * 
 * 
 * 
 */


/////////////////////////////////////////////////////////////////////

// THIS IS THE CODE IT GAVE ME FOR DISPLAYING THE IMAGE
import React, { useState, useEffect } from "react";
import axios from "axios";

const ClubList = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get("/api/clubs");
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div>
      {clubs.map((club) => (
        <div key={club.clubID}>
          <h2>{club.clubName}</h2>
          <img src={club.image} alt={club.clubName} width="200" />
          <p>{club.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ClubList;


//NOTES FROM CHATGPT
//image field is already in base64 string, so it can just work directly in the <img> tag
//Controllers handle validating file types (only image types allowed)