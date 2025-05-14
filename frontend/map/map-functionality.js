mapboxgl.accessToken = "pk.eyJ1IjoibmloYWFsMTkwMyIsImEiOiJjbTFzdm00d3AwOWNyMmlzNmM2c3R5eGdpIn0.PV0B6e3t_BgfQyKyoE-vGw";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([77.5946, 12.9716]); // Default to Bangalore
}

async function reverseGeocode(lng, lat) {
  const accessToken = mapboxgl.accessToken;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0]?.place_name || "Unknown location";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Unknown location";
  }
}

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: center,
    zoom: 13,
  });

  map.addControl(new mapboxgl.NavigationControl());

  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: "metric",
    profile: "mapbox/driving",
  });

  map.addControl(directions, "top-left");

  map.on("styleimagemissing", function (e) {
    console.warn("Missing sprite image:", e.id); // Suppress "in-state-4" error
  });

  let pickupSet = false;
  let dropSet = false;

  let pickupCoords = null;
  let dropCoords = null;

  // Handle text input changes in the directions control
  directions.on("origin", async (e) => {
    if (e.feature) {
      const coords = e.feature.geometry.coordinates;
      const pickupName = await reverseGeocode(coords[0], coords[1]);
      
      // Remove existing pickup marker if any
      const existingMarker = document.querySelector('.pickup-marker');
      if (existingMarker) {
        existingMarker.remove();
      }

      // Add new pickup marker
      new mapboxgl.Marker({ color: "blue", className: 'pickup-marker' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setText("Pickup: " + pickupName))
        .addTo(map)
        .togglePopup();

      pickupCoords = coords;
      pickupSet = true;
    }
  });

  directions.on("destination", async (e) => {
    if (e.feature) {
      const coords = e.feature.geometry.coordinates;
      const dropName = await reverseGeocode(coords[0], coords[1]);
      
      // Remove existing drop marker if any
      const existingMarker = document.querySelector('.drop-marker');
      if (existingMarker) {
        existingMarker.remove();
      }

      // Add new drop marker
      new mapboxgl.Marker({ color: "red", className: 'drop-marker' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setText("Drop: " + dropName))
        .addTo(map)
        .togglePopup();

      dropCoords = coords;
      dropSet = true;

      // Send to parent
      const data = {
        pickup: await reverseGeocode(pickupCoords[0], pickupCoords[1]),
        drop: dropName,
        pickupLat: pickupCoords[1],
        pickupLng: pickupCoords[0],
        dropLat: coords[1],
        dropLng: coords[0],
      };

      try {
        window.parent.postMessage(data, window.location.origin);
      } catch (err) {
        console.error("Error sending data to parent:", err);
      }
    }
  });

  // Handle map clicks for manual selection
  map.on("click", async (e) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];

    if (!pickupSet) {
      pickupCoords = coords;
      const pickupName = await reverseGeocode(coords[0], coords[1]);

      if (pickupName === "Unknown location") {
        alert("Failed to fetch pickup location. Please try again.");
        return;
      }

      // Remove existing pickup marker if any
      const existingMarker = document.querySelector('.pickup-marker');
      if (existingMarker) {
        existingMarker.remove();
      }

      new mapboxgl.Marker({ color: "blue", className: 'pickup-marker' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setText("Pickup: " + pickupName))
        .addTo(map)
        .togglePopup();

      pickupSet = true;
    } else if (!dropSet) {
      dropCoords = coords;
      const dropName = await reverseGeocode(coords[0], coords[1]);

      if (dropName === "Unknown location") {
        alert("Failed to fetch drop location. Please try again.");
        return;
      }

      // Remove existing drop marker if any
      const existingMarker = document.querySelector('.drop-marker');
      if (existingMarker) {
        existingMarker.remove();
      }

      new mapboxgl.Marker({ color: "red", className: 'drop-marker' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setText("Drop: " + dropName))
        .addTo(map)
        .togglePopup();

      dropSet = true;

      // Send to parent
      const data = {
        pickup: await reverseGeocode(pickupCoords[0], pickupCoords[1]),
        drop: dropName,
        pickupLat: pickupCoords[1],
        pickupLng: pickupCoords[0],
        dropLat: coords[1],
        dropLng: coords[0],
      };

      try {
        window.parent.postMessage(data, window.location.origin);
      } catch (err) {
        console.error("Error sending data to parent:", err);
      }
    }
  });

  // Handle location searches via the Directions plugin
  directions.on("route", async (e) => {
    if (e.route && e.route[0]) {
      const waypoints = directions.getWaypoints();
      if (waypoints.length >= 2) {
        const pickupCoords = [waypoints[0].location[0], waypoints[0].location[1]];
        const dropCoords = [waypoints[1].location[0], waypoints[1].location[1]];
  
        const pickupName = await reverseGeocode(pickupCoords[0], pickupCoords[1]);
        const dropName = await reverseGeocode(dropCoords[0], dropCoords[1]);
  
        const data = {
          pickup: pickupName,
          drop: dropName,
          pickupLat: pickupCoords[1],
          pickupLng: pickupCoords[0],
          dropLat: dropCoords[1],
          dropLng: dropCoords[0],
        };
  
        console.log("Sending data to parent:", data); // Debugging log
  
        try {
          window.parent.postMessage(data, window.location.origin);
        } catch (err) {
          console.error("Error sending data to parent:", err);
        }
      }
    }
  });
}