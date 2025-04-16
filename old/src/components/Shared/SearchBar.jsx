/**
 *  Provides a search inmput for users to filter results by course, interest, or name
 *
 *  Props:
 *  -onSearch: A callback to pass the search query to parent when the user submits the search
 *
 *
 *  Functionality:
 *  -Renders an input field with a placeholder (e.g., Search by Course,Interest,or name)
 *  -Includes a search icon or button to submit the query
 *  -Updates the search query in local state as the user types
 *  -Calls onSearch with the query when the user presses Enter or clicks the search button
 *
 *  State:
 *  -query: the current search item entered by the user
 *
 */
