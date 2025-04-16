/**
 *  Displays the app's header with the logo, nagivation links, and user profile/notification icons
 *
 *  Props:
 *  -user: authenticated user object
 *  -onLogout: a callback to handle logout(calls signOut from Firebase Auth)
 *
 *  Functionality:
 *  -Renders the "CampusConnect" logo
 *  -Displays nagivation links (Home,Network,Search,Groups) that link to other pages
 *  -Shows a profile icon and a notifications icon
 *  -Includes a logout button or link
 *
 *  State:
 *  -May include a loading state for logout operations
 *  -May include an error state for lgout errors
 *
 */
