const validateUserData = (userData, isUpdate = false, res) => {
  if (!isUpdate) {
    if (!userData.username || typeof userData.username !== "string") {
      return res
        .status(400)
        .json({ error: "Username is required and must be a string" });
    }
    if (
      !userData.courses ||
      !Array.isArray(userData.courses) ||
      userData.courses.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Courses are required and must be a non-empty array" });
    }
  }

  if ("username" in userData && userData.username !== undefined) {
    if (typeof userData.username !== "string") {
      return res.status(400).json({ error: "Username must be a string" });
    }
    if (userData.username.trim().length === 0) {
      return res.status(400).json({ error: "Username cannot be empty" });
    }
  }

  if ("bio" in userData && userData.bio !== undefined) {
    if (typeof userData.bio !== "string") {
      return res.status(400).json({ error: "Bio must be a string" });
    }
  }

  if ("courses" in userData && userData.courses !== undefined) {
    if (!Array.isArray(userData.courses)) {
      return res.status(400).json({ error: "Courses must be an array" });
    }
    if (!userData.courses.every((course) => typeof course === "string")) {
      return res.status(400).json({ error: "All courses must be strings" });
    }
  }

  if ("interests" in userData && userData.interests !== undefined) {
    if (!Array.isArray(userData.interests)) {
      return res.status(400).json({ error: "Interests must be an array" });
    }
    if (!userData.interests.every((interest) => typeof interest === "string")) {
      return res.status(400).json({ error: "All interests must be strings" });
    }
  }

  if ("year" in userData && userData.year !== undefined) {
    if (typeof userData.year !== "string") {
      return res.status(400).json({ error: "Year must be a string" });
    }
  }

  if ("role" in userData && userData.role !== undefined) {
    const allowedRoles = ["student", "admin"];
    if (!allowedRoles.includes(userData.role)) {
      return res
        .status(400)
        .json({ error: `Role must be one of: ${allowedRoles.join(", ")}` });
    }
  }

  if ("profilePhoto" in userData && userData.profilePhoto !== undefined) {
    if (typeof userData.profilePhoto !== "string") {
      return res
        .status(400)
        .json({ error: "Profile photo must be a string (URL)" });
    }
  }

  if ("settings" in userData && userData.settings !== undefined) {
    if (typeof userData.settings !== "object" || userData.settings === null) {
      return res.status(400).json({ error: "Settings must be an object" });
    }
    if (
      "notifications" in userData.settings &&
      (typeof userData.settings.notifications.email !== "boolean" ||
        typeof userData.settings.notifications.push !== "boolean")
    ) {
      return res.status(400).json({
        error:
          "Notifications settings must contain boolean values for email and push",
      });
    }
    if (
      "privacy" in userData.settings &&
      !["everyone", "friends", "private"].includes(userData.settings.privacy)
    ) {
      return res.status(400).json({
        error: "Privacy must be one of: everyone, friends, private",
      });
    }
    if (
      "theme" in userData.settings &&
      !["light", "dark"].includes(userData.settings.theme)
    ) {
      return res
        .status(400)
        .json({ error: "Theme must be one of: light, dark" });
    }
  }

  if ("blockedUsers" in userData && userData.blockedUsers !== undefined) {
    if (!Array.isArray(userData.blockedUsers)) {
      return res.status(400).json({ error: "Blocked users must be an array" });
    }
    if (!userData.blockedUsers.every((uid) => typeof uid === "string")) {
      return res
        .status(400)
        .json({ error: "All blocked user IDs must be strings" });
    }
  }

  return null;
};

export { validateUserData };
