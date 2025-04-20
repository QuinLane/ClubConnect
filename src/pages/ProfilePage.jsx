import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SuSidebar from "../components/SuSidebar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const userID = stored.userID;
  const isSUAdmin = stored.userType === "SUAdmin";

  const [userDetails, setUserDetails] = useState(null);
  const [memberClubs, setMemberClubs] = useState([]);
  const [execClubs, setExecClubs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [uRes, mRes, eRes] = await Promise.all([
          fetch(`http://localhost:5050/api/users/${userID}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5050/api/clubs/user/${userID}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5050/api/clubs/user-exec/${userID}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!uRes.ok) throw new Error("Could not load user info");
        if (!mRes.ok) throw new Error("Could not load member clubs");
        if (!eRes.ok) throw new Error("Could not load executive clubs");

        const userData = await uRes.json();
        const memberData = await mRes.json();
        const execData = await eRes.json();

        setUserDetails(userData);
        setMemberClubs(memberData);
        setExecClubs(execData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userID, navigate]);

  if (loading) {
    return (
      <div style={styles.page}>
        {isSUAdmin ? <SuSidebar /> : <Sidebar />}
        <div style={styles.loading}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        {isSUAdmin ? <SuSidebar /> : <Sidebar />}
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {isSUAdmin ? <SuSidebar /> : <Sidebar />}
      <div style={styles.main}>
        <h1 style={styles.title}>My Profile</h1>

        <section style={styles.section}>
          <p style={styles.field}><strong>UCID:</strong> {userDetails.userID}</p>
          <p style={styles.field}><strong>Username:</strong> {userDetails.username}</p>
          <p style={styles.field}><strong>Email:</strong> {userDetails.email}</p>
          <p style={styles.field}><strong>User Type:</strong> {userDetails.userType}</p>
        </section>

        {!isSUAdmin && (
          <>
            <section style={styles.section}>
              <h2 style={styles.subTitle}>Member of</h2>
              {memberClubs.length ? (
                <ul style={styles.list}>
                  {memberClubs.map((club) => (
                    <li key={club.clubID} style={styles.listItem}>{club.clubName}</li>
                  ))}
                </ul>
              ) : (
                <p style={styles.field}>You’re not a member of any clubs.</p>
              )}
            </section>

            <section style={styles.section}>
              <h2 style={styles.subTitle}>Executive of</h2>
              {execClubs.length ? (
                <ul style={styles.list}>
                  {execClubs.map((club) => {
                    const role = club.executives.find(e => e.userID === userID)?.role;
                    return (
                      <li key={club.clubID} style={styles.listItem}>
                        {club.clubName}{role && ` – ${role}`}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={styles.field}>You’re not an executive of any clubs.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9fafb'
  },
  loading: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    textAlign: 'left'
  },
  error: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    color: 'red',
    textAlign: 'left'
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 24px'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    paddingLeft: 16
  },
  section: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32
  },
  subTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12
  },
  field: {
    fontSize: 18,
    paddingLeft: 16,
    margin: '4px 0'
  },
  list: {
    listStyleType: 'disc',
    marginLeft: 32,
    paddingLeft: 0
  },
  listItem: {
    fontSize: 18,
    marginBottom: 8
  }
};
