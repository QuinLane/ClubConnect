/**
 *  Displays a single suggested event or group in a 'Suggested Events' section
 *
 *  Props:
 *  -item: Suggested item (events or groups) with properties like name, description, image, member ammount
 *  -userID: authenticated user's ID
 *  -onAction: callback to handle actions like joining a group/registering for event
 *
 *  Renders a card with:
 *  -image placeholder
 *  -items name (e.g "Hackathon Mar 28, 6pm")
 *  -a brief description
 *  -categories/interests
 *  -button ('Join' for groups, 'Register' for events)
 *  -calls onAction with items Id and action type when the user clicks the button
 *
 *  State:
 *  -loading : to disable the button during async operations
 *  -error:  to display errors (e.g. , "Failed to register")
 *
 *
 */
