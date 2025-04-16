/**
 * Provides a button to delete the user’s account
 *
 * Props:
 * -onDelete: A callback to handle account deletion
 *
 * Functionality:
 * -Renders a "Delete Account" button with a distinct style (e.g., red background)
 * -Calls onDelete when the user clicks the button (may prompt for confirmation)
 *
 * State:
 * -loading: To disable the button during deletion
 * -error: To display errors (e.g., "Failed to delete account")
 */