export class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // Array of [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}
