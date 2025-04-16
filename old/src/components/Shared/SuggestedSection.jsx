/**
 * Displays a section of suggested events or groups
 * Props:
 * -Suggestions: Array of suggested items (events or groups) fetched by SearchPage
 * -userID: authenticated user's ID
 * -onAction: callback to handle actions (Passed to suggestedCard)
 *
 *  Renders a heading ("Suggested Events")
 *  Maps over the suggestions array to render a SuggestedCard for each item
 *  Passes the userID and onAction props to each SuggestedCard
 *
 *  State: None (managed by suggestedCard)
 *
 *
 */
