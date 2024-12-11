// Handle CDN error
function handleCDNError(cdnName) {
    console.error(`${cdnName} failed to load.`);
    document.getElementById("loading").style.display = "none"; // Hide loading spinner
    document.getElementById("error-message").style.display = "block"; // Show error message
}

// Function to load CSS dynamically
function loadCSS(url, onErrorCallback) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => console.log(`${url} loaded successfully.`);
    link.onerror = () => onErrorCallback(url);
    document.head.appendChild(link);
}

// Function to load JS dynamically
function loadJS(url, onLoadCallback, onErrorCallback) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = onLoadCallback; // Call the onLoadCallback once the script is loaded
    script.onerror = () => onErrorCallback(url); // If an error occurs, call the error callback
    document.body.appendChild(script);
}

// Initialize map function
const initMap = () => {
    const map = L.map("map").setView([-6.402905, 106.778419], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([-6.402905, 106.778419]).addTo(map).bindPopup(`
                <h3>Depok</h3>
                <p><strong>Alamat:</strong> Kota Depok, Jawa Barat, Indonesia</p>
            `);

    fetchGeoJSONData(map);
};

// Fetch GeoJSON data
const fetchGeoJSONData = (map) => {
    document.getElementById("loading").style.display = "flex";
    document.getElementById("error-message").style.display = "none";

    fetch("../geojson/kampus.geojson")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load GeoJSON data");
            }
            return response.json();
        })
        .then((data) => {
            L.geoJSON(data, {
                pointToLayer: (feature, latLng) => L.marker(latLng),
                onEachFeature: (feature, layer) => {
                    const popupContent = `
                                <h3>${feature.properties.kampus}</h3>
                                <p><strong>Alamat:</strong> ${feature.properties.alamat}</p>
                            `;
                    layer.bindPopup(popupContent);
                },
            }).addTo(map);
            document.getElementById("loading").style.display = "none";
        })
        .catch((error) => {
            console.error("Error loading GeoJSON:", error);
            document.getElementById("loading").style.display = "none";
            document.getElementById("error-message").style.display = "block";
        });
};

// Window onload: Load the required resources
window.onload = () => {
    // Load the Leaflet CSS
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", handleCDNError);

    // Load the Leaflet JS dynamically and initialize the map after it's loaded
    loadJS(
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        () => {
            // Once the JS is loaded, call initMap()
            initMap();
        },
        handleCDNError
    );
};
