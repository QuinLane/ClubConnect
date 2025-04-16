/**
 * Displays a card for finding friends with a user’s details
 *
 * Props:
 * -friend: The friend’s data (e.g., { name: "John Doe", year: "2nd year", interests: ["SENG513"], courses: ["Data Sci"] })
 * -onAddFriend: A callback to handle adding the friend
 *
 * Functionality:
 * -Renders a card with the friend’s profile photo (or placeholder), name, year, interests, and courses
 * -Includes navigation arrows to cycle through potential friends
 * -Renders an "Add Friend" button
 * -Calls onAddFriend with the friend’s ID when the user clicks "Add Friend"
 *
 * State:
 * -loading: To disable the "Add Friend" button during async operations
 * -error: To display errors (e.g., "Failed to add friend")
 */
