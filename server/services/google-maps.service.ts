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

      if (response.data.status !== "OK" || !response.data.results.length) {
        throw new Error("Address not found");
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      const zipCodeComponent = result.address_components.find((component: any) =>
        component.types.includes("postal_code")
      );

      return {
        formattedAddress: result.formatted_address,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        zipCode: zipCodeComponent?.long_name || "",
        placeId: result.place_id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error_message || "Geocoding failed");
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
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

      if (response.data.status !== "OK") {
        throw new Error("Place details not found");
      }

      const result = response.data.result;
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
    } catch (error) {
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
  ): Promise<Array<{ name: string; types: string[] }>> {
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
        }));
      }

      return [];
    } catch (error) {
      return [];
    }
  }
}

export const googleMapsService = new GoogleMapsService();
