/**
 * Allows users to upload or remove their profile photo
 *
 * Props:
 * -currentPhoto: The URL of the user’s current profile photo (or null if none)
 * -onPhotoChange: A callback to handle photo upload or removal
 *
 * Functionality:
 * -Renders the current profile photo (or a placeholder if none exists)
 * -Provides an "Upload Photo" button to select a new photo
 * -Provides a "Remove" button to delete the current photo
 * -Displays image requirements (e.g., "Min. 400 x 400px, 2MB max, Your face")
 * -Calls onPhotoChange with the new photo file or null (for removal) when the user uploads or removes a photo
 *
 * State:
 * -loading: To disable buttons during upload/removal
 * -error: To display errors (e.g., "File too large")
 */
