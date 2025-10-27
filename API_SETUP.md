# API Configuration

This application requires two API keys to function properly:

## Required API Keys

### 1. Google Maps API Key
- **Environment Variable:** `GOOGLE_MAPS_API_KEY`
- **Purpose:** Used for geocoding addresses, getting place details, and searching for nearby Bitcoin ATMs
- **Get Your Key:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Required APIs:**
  - Geocoding API
  - Places API
  - Maps JavaScript API (optional, for future map features)

### 2. Census Bureau API Key
- **Environment Variable:** `CENSUS_API_KEY`
- **Purpose:** Used to retrieve population data for ZIP codes
- **Get Your Key:** [Census API Key Request](https://api.census.gov/data/key_signup.html)

## Setup Instructions

1. Copy the `.env` file if it doesn't exist
2. Add your API keys to the `.env` file:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
CENSUS_API_KEY=your_census_api_key_here
```

3. Restart the development server

## Testing Your Configuration

Try searching for an address like "1600 Amphitheatre Parkway, Mountain View, CA" to verify your API keys are working correctly.
