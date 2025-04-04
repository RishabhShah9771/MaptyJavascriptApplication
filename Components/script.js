'use strict';
import {
  form,
  inputDistance,
  inputCadence,
  inputDuration,
  inputElevation,
  inputType,
} from './domElements.js';
import { Running } from './runningClass.js';
import { Cycling } from './cyclingClass.js';
import { Workout } from './workoutClass.js';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// APPLICATION ARCHITECTURE
class App {
  // Private fields
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        () => {
          alert('Sorry, we could not get your location.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by this browser!');
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 15);
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField(e) {
    e.preventDefault();
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // Helper function to check if the input is Valid number or not
    const validInput = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    // Helper function to check if the input is positive number or not
    const allPositive = (...inputs) => inputs.every(input => input > 0);

    e.preventDefault();

    // Get Data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // check if the data is valid

    // if activity is running, create a running object

    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check if the data is valid
      if (
        !validInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('please enter a valid number!!!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if activity is cycling, create a cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Check if the data is valid
      if (
        !validInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('please enter a valid number!!!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // Add the object to the workout array
    this.#workouts.push(workout);

    // Render the workout om the map as a marker
    this.renderWorkOutMarker(workout);

    // Render the workout on the list

    // Hide the form  + clear the input fields

    inputDistance.value =
      inputCadence.value =
      inputElevation.value =
      inputDuration.value =
      inputType.value =
        '';
  }

  renderWorkOutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          closeOnClick: false,
          autoClose: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.distance)
      .openPopup();
  }
}

const app = new App();
