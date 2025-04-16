/**
 * Displays a table of friends or connections with their details
 *
 * Props:
 * -friends: An array of friends (e.g., [{ name: "Alex Carter", year: "3rd", major: "Comp Sci", interests: ["Coding"], courses: ["SENG513"], lastActive: "Online Now" }])
 * -userId: The authenticated user’s ID (to determine actions like viewing profiles)
 * -onViewProfile: A callback to handle viewing a friend’s profile
 *
 * Functionality:
 * -Renders a table with headers: "Friends", "Year", "Major", "Interests", "Courses", "Last Active"
 * -Maps over the friends array to display each friend’s details in a row
 * -Includes a profile icon for each friend
 * -Shows an "Online Now" badge for friends who are currently active
 * -Calls onViewProfile with the friend’s ID when the user clicks their name or profile icon
 *
 * State:
 * -None (state managed by parent)
 */
