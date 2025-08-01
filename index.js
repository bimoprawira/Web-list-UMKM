const UMKMS = [
  { name: "Rumah Makan Sederhana", lat: -7.565, lng: 110.823 },
  { name: "Bakso Enak", lat: -7.567, lng: 110.828 }
];

let map, directionsService, directionsRenderer;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: -7.566, lng: 110.825 }
  });

  directionsRenderer.setMap(map);
}

function showRoute(destination) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const origin = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const request = {
        origin: origin,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(result, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    }, () => {
      alert("Gagal mendapatkan lokasi Anda");
    });
  } else {
    alert("Browser tidak mendukung Geolocation");
  }
}
