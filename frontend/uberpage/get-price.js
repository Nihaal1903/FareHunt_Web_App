// script.js
import { getSelectedLocations } from '../map/map-functionality';

// Function to fetch Uber API access token
async function fetchAccessToken(clientId, clientSecret) {
  const response = await fetch('https://login.uber.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=ride_estimates`,
  });
  const data = await response.json();
  return data.access_token;
}

// Function to fetch price estimates
async function fetchPriceEstimates(pickup, dropoff) {
  const clientId = 'LMJuNfwV0TDXvrEYpznAZWj07F19PprV';
  const clientSecret = 'tPugUGAtvFTZwggIvxZCHbnAA5rdA8Dtya-8NNIJ';
  const token = await fetchAccessToken(clientId, clientSecret);

  const url = `https://api.uber.com/v1.2/estimates/price?start_latitude=${pickup.latitude}&start_longitude=${pickup.longitude}&end_latitude=${dropoff.latitude}&end_longitude=${dropoff.longitude}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  updatePrices(data.prices);
}

// Function to update UI prices
function updatePrices(prices) {
  prices.forEach((price) => {
    let cardId;
    switch (price.display_name) {
      case 'Auto':
        cardId = 'auto-card';
        break;
      case 'Mini':
        cardId = 'mini-card';
        break;
      case 'Sedan':
        cardId = 'sedan-card';
        break;
      case 'Prime':
        cardId = 'prime-card';
        break;
    }
    if (cardId) {
      document.querySelector(`#${cardId} .price`).textContent = `$${price.estimate}`;
    }
  });
}

// Event listener for fetching price estimates
document.getElementById('fetch-prices').addEventListener('click', async () => {
  const locations = await getSelectedLocations();
  fetchPriceEstimates(locations.pickup, locations.dropoff);
});
