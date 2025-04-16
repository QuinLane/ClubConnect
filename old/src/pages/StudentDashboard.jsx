/**
 * Page to display default view for students after they have logged in.
 *
 * Components:
 * -SuggestedSection.jsx
 * -FindFriendsCard.jsx
 * -Header.jsx
 * -Notifications.jsx
 *
 * Logic Needed:
 * -Auth Check: use onAuthStateChanged to ensure user is logged in.\
 * -If logged in fetch user data
 * -Fetch Dashboard Data: get new matches, group messages, friend suggestions
 * -Real-Time Notifications: use onSnapshot to listen for new notifications
 * -Friend suggestion actions: handles actions like sending friend request by updating Firestore
 *
 * Interaction with components:
 * -pass user data, mathces, and suggesttions to SuggestedSeciton and FindFriendsCard
 * -Pass a callback to FindFriendsCard to handle friend requests
 * -Pass notification data to NotificationItem
 */
import React from 'react'

function StudentDashboard() {
  return (
    <div>StudentDashboard</div>
  )
}

export default StudentDashboard