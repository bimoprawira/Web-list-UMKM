// Tunggu hingga seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {

    // Global variables
    let map;
    let userLocation;
    let userMarker;
    let routingControl = null;

    // Tentukan lokasi default
    const defaultLocation = [-7.6293, 110.8039];

    // Inisialisasi peta Leaflet
    map = L.map('map').setView(defaultLocation, 14);

    // Tambahkan 'tile layer' dari OpenStreetMap ke peta
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fungsi untuk mendapatkan lokasi pengguna
    function locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setView(userLocation, 15);
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }
                    userMarker = L.marker(userLocation).addTo(map)
                        .bindPopup('<b>Lokasi Anda Saat Ini</b>')
                        .openPopup();
                },
                () => {
                    alert("Akses lokasi ditolak. Menampilkan rute dari lokasi default.");
                    userLocation = { lat: defaultLocation[0], lng: defaultLocation[1] };
                }
            );
        } else {
            alert("Browser Anda tidak mendukung geolokasi. Rute akan ditampilkan dari lokasi default.");
            userLocation = { lat: defaultLocation[0], lng: defaultLocation[1] };
        }
    }

    // Fungsi untuk menambahkan event click pada setiap kartu UMKM
    function addCardListeners() {
        const umkmCards = document.querySelectorAll('.umkm-card');
        umkmCards.forEach(card => {
            card.addEventListener('click', () => {
                if (!userLocation) {
                    alert("Tidak dapat menemukan lokasi Anda. Mohon izinkan akses lokasi pada browser Anda dan coba lagi.");
                    return;
                }
                umkmCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const destination = L.latLng(
                    parseFloat(card.dataset.lat),
                    parseFloat(card.dataset.lng)
                );
                if (routingControl !== null) {
                    map.removeControl(routingControl);
                    routingControl = null;
                }
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLocation.lat, userLocation.lng),
                        destination
                    ],
                    routeWhileDragging: true,
                    createMarker: function() { return null; }
                }).addTo(map);
            });
        });
    }

    // Jalankan fungsi-fungsi utama
    locateUser();
    addCardListeners();

    // --- LOGIKA MENU HAMBURGER (KODE BARU) ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    // --- AKHIR LOGIKA MENU HAMBURGER ---

    // --- LOGIKA PENCARIAN UMKM ---
    const searchInput = document.getElementById('umkm-search');
    const umkmCards = document.querySelectorAll('.umkm-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        umkmCards.forEach(card => {
            const umkmName = card.querySelector('.card-info h3').textContent.toLowerCase();
            if (umkmName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
    // --- AKHIR LOGIKA PENCARIAN ---
});