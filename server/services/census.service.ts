import axios from "axios";

const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

export class CensusService {
  async getPopulationDensity(zipCode: string): Promise<number> {
    try {
      const populationResponse = await axios.get(
        `https://api.census.gov/data/2021/acs/acs5`,
        {
          params: {
            get: "B01003_001E",
            for: `zip code tabulation area:${zipCode}`,
            key: CENSUS_API_KEY,
          },
        }
      );

      if (!populationResponse.data || populationResponse.data.length < 2) {
        throw new Error(`No population data found for ZIP code ${zipCode}`);
      }

      const population = parseInt(populationResponse.data[1][0]) || 0;
      if (population === 0) {
        throw new Error(`Zero population for ZIP code ${zipCode}`);
      }

      let landAreaSqMeters = 25899881.1;
      
      try {
        const geoResponse = await axios.get(
          `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2021/MapServer/8/query`,
          {
            params: {
              where: `ZCTA5='${zipCode}'`,
              outFields: "ALAND",
              f: "json",
            },
          }
        );

        if (geoResponse.data?.features?.[0]?.attributes?.ALAND) {
          landAreaSqMeters = geoResponse.data.features[0].attributes.ALAND;
        }
      } catch (geoError) {
        console.warn(`Could not fetch land area for ZIP ${zipCode}, using average`);
      }

      const landAreaSqMiles = landAreaSqMeters / 2_589_988.11;

      if (landAreaSqMiles === 0) {
        throw new Error(`Invalid land area for ZIP code ${zipCode}`);
      }

      const density = Math.round(population / landAreaSqMiles);
      return density;
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve population density for ZIP code ${zipCode}: ${error.message}`
      );
    }
  }
}

export const censusService = new CensusService();
