const validateSuggestionData = (suggestionData, res) => {
  if (!suggestionData.userId || typeof suggestionData.userId !== "string") {
    return res
      .status(400)
      .json({ error: "User ID is required and must be a string" });
  }

  if (
    !suggestionData.suggestedUserId ||
    typeof suggestionData.suggestedUserId !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Suggested user ID is required and must be a string" });
  }

  if (suggestionData.userId === suggestionData.suggestedUserId) {
    return res.status(400).json({ error: "Cannot suggest the same user" });
  }

  if (!suggestionData.reason || typeof suggestionData.reason !== "string") {
    return res
      .status(400)
      .json({ error: "Reason is required and must be a string" });
  }

  return null; // No validation errors
};

export { validateSuggestionData };
