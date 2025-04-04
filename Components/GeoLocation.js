export const geoLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const coords = [latitude, longitude];
        const map = L.map('map').setView(coords, 17);

        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution:
            '&copy; <a href="https://maps.google.com">Google Maps</a>',
        }).addTo(map);

        L.marker(coords)
          .addTo(map)
          .bindPopup('A pretty CSS popup.<br> Easily customizable.')
          .openPopup();
      },
      () => {
        alert('Sorry, we could not get your location.');
      },
      {}
    );
  }
};
