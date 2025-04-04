import { Workout } from './workoutClass.js';

class Running extends Workout {
  // Set the default type of the workout to 'running'
  type = 'running';

  /**
   * Constructor to initialize a Running workout instance
   * @param {Array} coords - Array containing latitude and longitude of the workout location
   * @param {number} distance - Distance covered during the workout (in kilometers)
   * @param {number} duration - Duration of the workout (in minutes)
   * @param {number} cadence - Number of steps per minute during the workout
   */
  constructor(coords, distance, duration, cadence) {
    // Call the parent class (Workout) constructor to initialize common properties
    super(coords, distance, duration);

    // Initialize the cadence property specific to Running workouts
    this.cadence = cadence;

    // Calculate the pace (time per kilometer) for the workout
    this.calcPace();

    // Set the type of the workout to 'running' (redundant here since it's already set above)
    this.type = 'running';

    // Generate a description for the workout (e.g., "Running on April 5")
    this._setDescription();
  }

  /**
   * Method to calculate the pace of the workout
   * Pace is defined as the duration (in minutes) per kilometer
   * @returns {number} - The calculated pace
   */
  calcPace() {
    // Calculate pace as duration divided by distance
    this.pace = this.duration / this.distance;

    // Return the calculated pace
    return this.pace;
  }
}

export { Running };
