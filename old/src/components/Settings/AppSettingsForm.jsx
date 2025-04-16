/**
 * Displays a form to manage app settings (notifications, visibility, language, theme, sound)
 *
 * Props:
 * -settings: The user’s current settings (e.g., { emailNotifications: true, pushNotifications: false, showOnlineStatus: true, groupChatNotifications: false, profileVisibility: "Everyone", appLanguage: "English", theme: "Light", notificationSound: "Bell" })
 * -onChange: A callback to handle changes to settings
 *
 * Functionality:
 * -Renders toggles for email notifications, push notifications, show online status, and group chat notifications
 * -Renders dropdowns for profile visibility, app language, theme preference, and notification sound
 * -Updates local state as the user toggles or selects options
 * -Calls onChange with the updated settings when the user modifies a field
 *
 * State:
 * -formData: The current form values (e.g., { emailNotifications, pushNotifications, ... })
 */
