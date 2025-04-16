/**
 *  Displays search results in a table format with columns for Name, Description, Categories/Interests, Mutual Connections and Action
 *
 *  Props:
 *      -results: array of search results (groups, people, events) fetched by SearchPage
 *      -userId: the authenticated uesr Id
 *      -onAction: callback to handle actions like joining a group, connecting with a person, or registering for an event.
 *
 *  Functionality:
 *      -Renders table with headers : "Name", "Description", "Categories/Interests", "Mutual Connections", "Action"
 *      -Maps over the results array to render each row:
 *      -"Name": Displays the name
 *      -"Description": Shows a brief description
 *      -"Categories/Interests": Lists relevant categories or interests
 *      -"Mutual Connections": Shows the number of mutual connections with icons for visual representation
 *      -"Action":
 *          -"Join" for groups
 *          -"Connect" for people
 *          -"Register" for events
 *      -Calls onAction with the results ID and action type when the user clicks an action button
 *
 *  State:
 *      -loading : for each row, to disable the action button during async operation
 *      -error:  to display errors (e.g. , "Failed to register")
 */
