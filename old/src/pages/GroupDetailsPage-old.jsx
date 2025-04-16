/**
 * Display details about a specific Group
 *
 * Logic:
 * - Auth Check (via useAuth hook)
 * - Fetch Group Details (Real-Time)
 * - Handle Group Actions (Join, Leave, Edit)
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Updated path
import useGroupData from "../hooks/useGroupData"; // Updated path
import {
  sendGroupJoinRequest,
  removeGroupJoinRequest,
  leaveGroup,
  editGroupDetails,
} from "../structure/groupsStructure"; // Updated path

// Basic styles (replace with CSS modules or styled-components as needed)
const styles = {
  pageContainer: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  groupHeader: {
    marginBottom: "20px",
  },
  groupDetails: {
    marginBottom: "20px",
  },
  membersList: {
    marginBottom: "20px",
  },
  memberItem: {
    padding: "5px 0",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "5px",
  },
};

const GroupsDetailsPage = () => {
  // Use the useAuth hook for authentication
  const { user, loading: authLoading } = useAuth();
  const { groupId } = useParams();

  // State for group actions
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Fetch group data and members in real-time
  const {
    groupData,
    membersData,
    loading: groupLoading,
    error: groupError,
  } = useGroupData(groupId, user);

  // Initialize edit form with current group data
  useEffect(() => {
    if (groupData) {
      setUpdatedName(groupData.name);
      setUpdatedDescription(groupData.description || "");
    }
  }, [groupData]);

  // Handle sending a request to join a group
  const handleSendGroupJoinRequest = async () => {
    try {
      setError(null);
      await sendGroupJoinRequest(groupId, user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle removing a request to join a group
  const handleRemoveGroupJoinRequest = async () => {
    try {
      setError(null);
      await removeGroupJoinRequest(groupId, user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle leaving a group
  const handleLeaveGroup = async () => {
    try {
      setError(null);
      await leaveGroup(groupId, user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle editing group details
  const handleEditGroupDetails = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedGroupDetails = {
        name: updatedName,
        description: updatedDescription,
      };
      await editGroupDetails(groupId, user, updatedGroupDetails);
      setEditMode(false); // Exit edit mode after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  // Render loading state
  if (authLoading || groupLoading) {
    return <div style={styles.pageContainer}>Loading...</div>;
  }

  // Render error state
  if (groupError) {
    return <div style={styles.pageContainer}>Error: {groupError}</div>;
  }

  // Determine user status in the group
  const isMember = groupData?.members?.includes(user.uid);
  const hasJoinRequest = groupData?.joinRequests?.includes(user.uid);
  const isAdmin = groupData?.admins?.includes(user.uid);

  // Render the page
  return (
    <div style={styles.pageContainer}>
      <div style={styles.groupHeader}>
        <h1>{groupData.name}</h1>
        <p>{groupData.description || "No description available."}</p>
      </div>

      {error && <div style={styles.error}>Error: {error}</div>}

      {/* Edit form (visible only to admins) */}
      {isAdmin && editMode ? (
        <form style={styles.form} onSubmit={handleEditGroupDetails}>
          <input
            style={styles.input}
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Group Name"
            required
          />
          <textarea
            style={styles.input}
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Group Description"
          />
          <div style={styles.actions}>
            <button style={styles.button} type="submit">
              Save Changes
            </button>
            <button
              style={styles.button}
              type="button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        isAdmin && (
          <div style={styles.actions}>
            <button style={styles.button} onClick={() => setEditMode(true)}>
              Edit Group Details
            </button>
          </div>
        )
      )}

      {/* Group actions */}
      <div style={styles.actions}>
        {!isMember && !hasJoinRequest && (
          <button style={styles.button} onClick={handleSendGroupJoinRequest}>
            Request to Join
          </button>
        )}
        {!isMember && hasJoinRequest && (
          <button style={styles.button} onClick={handleRemoveGroupJoinRequest}>
            Cancel Join Request
          </button>
        )}
        {isMember && !isAdmin && (
          <button style={styles.button} onClick={handleLeaveGroup}>
            Leave Group
          </button>
        )}
      </div>

      {/* Group details */}
      <div style={styles.groupDetails}>
        <h2>Group Details</h2>
        <p>Owner ID: {groupData.ownerId}</p>
        <p>Created At: {groupData.CreatedAt?.toDate().toLocaleString()}</p>
      </div>

      {/* Members list */}
      <div style={styles.membersList}>
        <h2>Members ({membersData.length})</h2>
        {membersData.length > 0 ? (
          <ul>
            {membersData.map((member) => (
              <li key={member.id} style={styles.memberItem}>
                {member.username || "Unknown User"} (ID: {member.id})
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>
    </div>
  );
};

export default GroupsDetailsPage;
