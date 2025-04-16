/**
 * Displays a form to edit the user’s profile details (username, bio, interests, groups)
 *
 * Props:
 * -profileDetails: The user’s current profile details (e.g., { username: "user123", bio: "Write something...", interests: ["SENG513"], groups: ["SENG513 Study Group"] })
 * -onChange: A callback to handle changes to profile details
 *
 * Functionality:
 * -Renders a form with fields for username, bio, interests, and groups
 * -Allows users to add/remove interests and groups (e.g., as tags or a multi-select dropdown)
 * -Updates local state as the user types or modifies fields
 * -Calls onChange with the updated profile details when the user modifies a field
 *
 * State:
 * -formData: The current form values (e.g., { username, bio, interests, groups })
 */
