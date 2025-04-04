// Import the Workout class from the workoutClass.js file
import { Workout } from './workoutClass.js';

// Define the Cycling class that extends the Workout class
class Cycling extends Workout {
  // Set the default type of the workout to 'cycling'
  type = 'cycling';

  /**
   * Constructor for the Cycling class
   * @param {Array} coords - Array containing latitude and longitude of the workout location
   * @param {number} distance - Distance covered during the workout (in kilometers)
   * @param {number} duration - Duration of the workout (in minutes)
   * @param {number} elevation - Elevation gain during the workout (in meters)
   */
  constructor(coords, distance, duration, elevation) {
    // Call the parent class (Workout) constructor with common properties
    super(coords, distance, duration);

    // Set the elevation gain specific to cycling
    this.elevation = elevation;

    // Calculate the speed of the cycling workout
    this.calcSpeed();

    // Ensure the type is explicitly set to 'cycling'
    this.type = 'cycling';

    // Set a description for the workout (method inherited from the parent class)
    this._setDescription();
  }

  /**
   * Calculate the speed of the cycling workout
   * Speed is calculated as distance (in km) divided by duration (in hours)
   * @returns {number} - The calculated speed (in km/h)
   */
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // Convert duration from minutes to hours
    return this.speed;
  }
}

// Export the Cycling class for use in other modules
export { Cycling };
