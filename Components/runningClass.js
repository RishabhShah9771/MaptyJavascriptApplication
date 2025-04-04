import { Workout } from './workoutClass.js';
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    // min/Km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

export { Running };
