/**
 * Displays the user’s profile header with photo, name, school, program, and connections
 *
 * Props:
 * -userData: The user’s data (e.g., username, school, program, profilePhoto, connections)
 * -onConnect: A callback to handle connecting with the user
 *
 * Functionality:
 * -Renders the user’s profile photo (or a placeholder if none exists)
 * -Displays the user’s first and last name, school, and program
 * -Shows the number of connections (e.g., "50 Connections")
 * -Renders a "Connect" button to initiate a connection request
 * -Calls onConnect when the user clicks the "Connect" button
 *
 * State:
 * -loading: To disable the "Connect" button during async operations
 * -error: To display errors (e.g., "Failed to connect")
 */
