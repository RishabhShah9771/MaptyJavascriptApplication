'use strict';

// Importing required DOM elements and classes
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

//////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  // Private fields
  #map; // Map instance
  #mapEvent; // Map click event
  #workouts = []; // Array to store workout objects

  constructor() {
    // Get user's current position
    this._getPosition();

    // Attach event listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  // Get user's current position using Geolocation API
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // Success callback
        () => {
          alert('Sorry, we could not get your location.'); // Error callback
        },
        { enableHighAccuracy: true } // Options
      );
    } else {
      alert('Geolocation is not supported by this browser!');
    }
  }

  // Load the map using Leaflet.js
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    // Initialize the map and set the view to user's location
    this.#map = L.map('map').setView(coords, 15);

    // Add Google Maps tile layer
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    }).addTo(this.#map);

    // Add click event listener to the map
    this.#map.on('click', this._showForm.bind(this));
  }

  // Show the form when the map is clicked
  _showForm(mapE) {
    this.#mapEvent = mapE; // Store the map click event
    form.classList.remove('hidden'); // Show the form
    inputDistance.focus(); // Focus on the distance input field
  }

  // Hide the form and clear the input fields
  _hideForm() {
    // Clear input fields
    inputDistance.value =
      inputCadence.value =
      inputElevation.value =
      inputDuration.value =
      inputType.value =
        '';

    // Hide the form temporarily
    form.style.display = 'none';
    form.classList.add('hidden');

    // Reset form display after a short delay
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  // Toggle visibility of elevation and cadence fields based on activity type
  _toggleElevationField(e) {
    e.preventDefault();
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Handle new workout creation
  _newWorkout(e) {
    e.preventDefault();

    // Helper function to check if inputs are valid numbers
    const validInput = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    // Helper function to check if inputs are positive numbers
    const allPositive = (...inputs) => inputs.every(input => input > 0);

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If activity is running, create a Running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Validate input data
      if (
        !validInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Please enter a valid number!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If activity is cycling, create a Cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Validate input data
      if (
        !validInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Please enter a valid number!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add the workout object to the workouts array
    this.#workouts.push(workout);

    // Render the workout on the map as a marker
    this._renderWorkOutMarker(workout);

    // Render the workout on the list
    this._renderWorkout(workout);

    // Hide the form and clear the input fields
    this._hideForm();
  }

  // Render a workout marker on the map
  _renderWorkOutMarker(workout) {
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
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  // Render a workout on the list
  _renderWorkout(workout) {
    let html = `
                <li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
                        <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">${
                          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                        }</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>`;
    if (workout.type === 'running') {
      html += `
                        <div class="workout__details">
                             <span class="workout__icon">⚡️</span>
                             <span class="workout__value">${workout.pace.toFixed(
                               1
                             )}</span>
                             <span class="workout__unit">min/km</span>
                         </div>
                         <div class="workout__details">
                             <span class="workout__icon">🦶🏼</span>
                             <span class="workout__value">${
                               workout.cadence
                             }</span>
                             <span class="workout__unit">spm</span>
                        </div>
                    </li>`;
    }
    if (workout.type === 'cycling') {
      html += `
                        <div class="workout__details">
                                <span class="workout__icon">⚡️</span>
                                <span class="workout__value">${workout.speed.toFixed(
                                  1
                                )}</span>
                                <span class="workout__unit">km/h</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⛰</span>
                                <span class="workout__value">${
                                  workout.elevation
                                }</span>
                                <span class="workout__unit">m</span>
                            </div>
                </li> `;
    }
    form.insertAdjacentHTML('afterend', html); // Insert the workout HTML after the form
  }
}

// Instantiate the App class
const app = new App();
