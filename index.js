// Global variables
let map;
let directionsService;
let directionsRenderer;
let userLocation;

// Fungsi utama yang dipanggil oleh Google Maps API setelah script dimuat
function initMap() {
    // Inisialisasi layanan yang diperlukan
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Tentukan lokasi default (misal, pusat kota Solo sebagai fallback)
    const defaultLocation = { lat: -7.5562, lng: 110.8316 };

    // Buat peta
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Hubungkan renderer ke peta
    directionsRenderer.setMap(map);

    // Coba dapatkan lokasi pengguna
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Buat penanda untuk lokasi pengguna
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Lokasi Anda",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2,
                    },
                });
                
                // Pusatkan peta ke lokasi pengguna
                map.setCenter(userLocation);
            },
            () => {
                // Gagal mendapatkan lokasi, tetap gunakan default
                console.warn("Error: The Geolocation service failed.");
            }
        );
    } else {
        // Browser tidak mendukung Geolocation
        console.warn("Error: Your browser doesn't support geolocation.");
    }

    // Tambahkan event listener untuk setiap kartu UMKM
    addCardListeners();
}

// Fungsi untuk menambahkan event click pada setiap kartu UMKM
function addCardListeners() {
    const umkmCards = document.querySelectorAll('.umkm-card');

    umkmCards.forEach(card => {
        card.addEventListener('click', () => {
            // Cek jika lokasi pengguna sudah didapatkan
            if (!userLocation) {
                alert("Tidak dapat menemukan lokasi Anda. Mohon izinkan akses lokasi pada browser Anda.");
                return;
            }

            // Hapus kelas 'active' dari semua kartu
            umkmCards.forEach(c => c.classList.remove('active'));
            // Tambahkan kelas 'active' ke kartu yang diklik
            card.classList.add('active');

            // Ambil koordinat tujuan dari atribut data-*
            const destination = {
                lat: parseFloat(card.dataset.lat),
                lng: parseFloat(card.dataset.lng)
            };
            
            const destinationName = card.dataset.name;

            // Hitung dan tampilkan rute
            calculateAndDisplayRoute(userLocation, destination, destinationName);
        });
    });
}

// Fungsi untuk menghitung dan menampilkan rute di peta
function calculateAndDisplayRoute(origin, destination, destinationName) {
    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING // Bisa diganti DRIVING, WALKING, BICYCLING
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            
            // Opsional: berikan info tambahan
            console.log(`Menampilkan rute ke ${destinationName}`);
        } else {
            window.alert('Gagal menampilkan rute: ' + status);
        }
    });
}