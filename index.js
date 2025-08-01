// Tunggu hingga seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {

    // Global variables
    let map;
    let userLocation;
    let userMarker;
    let routingControl = null;

    // Tentukan lokasi default (misal, Alun-alun Grogol, Sukoharjo sebagai fallback)
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
                    
                    // Pusatkan peta ke lokasi pengguna
                    map.setView(userLocation, 15);

                    // Tambahkan penanda untuk lokasi pengguna
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }
                    userMarker = L.marker(userLocation).addTo(map)
                        .bindPopup('<b>Lokasi Anda Saat Ini</b>')
                        .openPopup();
                },
                () => {
                    // Gagal mendapatkan lokasi, gunakan default
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
                // Cek jika lokasi pengguna sudah didapatkan
                if (!userLocation) {
                    alert("Tidak dapat menemukan lokasi Anda. Mohon izinkan akses lokasi pada browser Anda dan coba lagi.");
                    return;
                }

                // Hapus kelas 'active' dari semua kartu
                umkmCards.forEach(c => c.classList.remove('active'));
                // Tambahkan kelas 'active' ke kartu yang diklik
                card.classList.add('active');

                // Ambil koordinat tujuan dari atribut data-*
                const destination = L.latLng(
                    parseFloat(card.dataset.lat),
                    parseFloat(card.dataset.lng)
                );
                
                // Hapus rute sebelumnya jika ada
                if (routingControl !== null) {
                    map.removeControl(routingControl);
                    routingControl = null;
                }

                // Buat rute baru
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLocation.lat, userLocation.lng), // Titik awal (pengguna)
                        destination // Titik tujuan (UMKM)
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

    // --- LOGIKA PENCARIAN UMKM (KODE BARU DITAMBAHKAN DI SINI) ---
    const searchInput = document.getElementById('umkm-search');
    const umkmCards = document.querySelectorAll('.umkm-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        umkmCards.forEach(card => {
            // Mengambil nama UMKM dari tag <h3> di dalam kartu
            const umkmName = card.querySelector('.card-info h3').textContent.toLowerCase();

            // Memeriksa apakah nama UMKM mengandung teks pencarian
            if (umkmName.includes(searchTerm)) {
                card.style.display = 'flex'; // Tampilkan kartu jika cocok
            } else {
                card.style.display = 'none'; // Sembunyikan kartu jika tidak cocok
            }
        });
    });
    // --- AKHIR LOGIKA PENCARIAN ---

});