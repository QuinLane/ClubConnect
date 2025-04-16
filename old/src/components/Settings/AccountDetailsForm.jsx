/**
 * Displays a form to edit the user’s account details (first name, last name, school, program)
 *
 * Props:
 * -accountDetails: The user’s current account details (e.g., { firstName: "John", lastName: "Doe", school: "University of Calgary", program: "Computer Science" })
 * -onChange: A callback to handle changes to account details
 *
 * Functionality:
 * -Renders a form with fields for first name, last name, school, and program
 * -Updates local state as the user types
 * -Calls onChange with the updated account details when the user modifies a field
 *
 * State:
 * -formData: The current form values (e.g., { firstName, lastName, school, program })
 */
