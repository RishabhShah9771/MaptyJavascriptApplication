class Workout {
  // Automatically set the current date when a new workout is created
  date = new Date();

  // Generate a unique ID for each workout based on the current timestamp
  id = (Date.now() + '').slice(-10);

  /**
   * Constructor to initialize a workout instance
   * @param {Array} coords - Array containing latitude and longitude [lat, lng]
   * @param {number} distance - Distance covered in the workout (in kilometers)
   * @param {number} duration - Duration of the workout (in minutes)
   */
  constructor(coords, distance, duration) {
    this.coords = coords; // Store the coordinates of the workout
    this.distance = distance; // Store the distance covered
    this.duration = duration; // Store the duration of the workout
  }

  /**
   * Private method to set a description for the workout
   * The description includes the type of workout (e.g., Running, Cycling)
   * and the date of the workout in a readable format (e.g., "Running on March 15").
   */
  _setDescription() {
    // Set the default type of the workout

    // Array of month names for formatting the date
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

// Export the Workout class so it can be used in other modules
export { Workout };
