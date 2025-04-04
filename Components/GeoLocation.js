export const geoLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(latitude, longitude);

        const url = `https://www.google.ca/maps/@${latitude},${longitude}`;
        console.log(url);
        console.log(position);
      },
      () => {
        alert('Please enable location services');
      }
    );
  }
};
