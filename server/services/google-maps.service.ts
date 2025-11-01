import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface GeocodeResult {
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  zipCode: string;
  placeId: string;
  stateCode: string;
  stateName: string;
}

interface PlaceDetails {
  name: string;
  types: string[];
  openingHours?: {
    weekdayText: string[];
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
}

export class GoogleMapsService {
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is not configured. Please add GOOGLE_MAPS_API_KEY to your .env file.");
    }

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status === "REQUEST_DENIED") {
        throw new Error("Google Maps API key is invalid or restricted. Please check your API key configuration.");
      }

      if (response.data.status !== "OK" || !response.data.results.length) {
        throw new Error("Address not found. Please enter a valid address.");
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      const zipCodeComponent = result.address_components.find((component: any) =>
        component.types.includes("postal_code")
      );

      const stateComponent = result.address_components.find((component: any) =>
        component.types.includes("administrative_area_level_1")
      );

      if (!zipCodeComponent?.long_name) {
        throw new Error("Could not determine ZIP code from address. Please include a ZIP code in your search.");
      }

      if (!stateComponent?.short_name) {
        throw new Error("Could not determine state from address.");
      }

      return {
        formattedAddress: result.formatted_address,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        zipCode: zipCodeComponent.long_name,
        placeId: result.place_id,
        stateCode: stateComponent.short_name,
        stateName: stateComponent.long_name,
      };
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error(error.response?.data?.error_message || "Failed to geocode address. Please try again.");
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is not configured");
    }

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            fields: "name,types,opening_hours",
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status === "REQUEST_DENIED") {
        throw new Error("Google Maps API key is invalid or restricted");
      }

      if (response.data.status !== "OK") {
        console.warn("Place details not found, using defaults");
      }

      const result = response.data.result || {};
      return {
        name: result.name || "Unknown Business",
        types: result.types || [],
        openingHours: result.opening_hours
          ? {
              weekdayText: result.opening_hours.weekday_text || [],
              periods: result.opening_hours.periods,
            }
          : undefined,
      };
    } catch (error: any) {
      if (error.message?.includes("API key")) {
        throw error;
      }
      console.warn("Failed to fetch place details, using defaults:", error.message);
      return {
        name: "Unknown Business",
        types: [],
        openingHours: undefined,
      };
    }
  }

  async searchNearbyBTMs(
    lat: number,
    lng: number,
    radiusMiles: number
  ): Promise<Array<{ name: string; types: string[]; coords: { lat: number; lng: number } }>> {
    try {
      const radiusMeters = radiusMiles * 1609.34;
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${lat},${lng}`,
            radius: radiusMeters,
            keyword: "bitcoin atm",
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status === "OK" && response.data.results) {
        return response.data.results.map((place: any) => ({
          name: place.name || "",
          types: place.types || [],
          coords: {
            lat: place.geometry?.location?.lat || 0,
            lng: place.geometry?.location?.lng || 0,
          },
        }));
      }

      return [];
    } catch (error) {
      return [];
    }
  }
}

export const googleMapsService = new GoogleMapsService();
