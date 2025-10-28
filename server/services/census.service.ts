import axios from "axios";
import { supabase } from "../supabase";

const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

export class CensusService {
  async getPopulationDensity(zipCode: string): Promise<number> {
    if (!CENSUS_API_KEY) {
      throw new Error("Census API key is not configured. Please add CENSUS_API_KEY to your .env file.");
    }

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
        throw new Error(`No population data found for ZIP code ${zipCode}. Please verify the ZIP code is valid.`);
      }

      const population = parseInt(populationResponse.data[1][0]) || 0;
      if (population === 0) {
        throw new Error(`No population data available for ZIP code ${zipCode}`);
      }

      const { data: gazetteerData, error: gazetteerError } = await supabase
        .from('gazetteer')
        .select('ALAND_SQMI')
        .eq('GEOID', zipCode)
        .maybeSingle();

      let landAreaSqMiles = 10.0;

      if (gazetteerData?.ALAND_SQMI && gazetteerData.ALAND_SQMI > 0) {
        landAreaSqMiles = gazetteerData.ALAND_SQMI;
        console.log(`Using gazetteer land area for ${zipCode}: ${landAreaSqMiles} sq mi`);
      } else {
        console.warn(`No gazetteer data found for ${zipCode}, trying fallback methods`);
        if (gazetteerError) {
          console.error('Gazetteer query error:', gazetteerError);
        }
        const { data: cachedData } = await supabase
          .from('zip_code_land_areas')
          .select('land_area_sq_meters')
          .eq('zip_code', zipCode)
          .maybeSingle();

        let landAreaSqMeters = 25899881.1;

        if (cachedData?.land_area_sq_meters) {
          landAreaSqMeters = cachedData.land_area_sq_meters;
        } else {
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

              await supabase
                .from('zip_code_land_areas')
                .upsert({
                  zip_code: zipCode,
                  land_area_sq_meters: landAreaSqMeters,
                  updated_at: new Date().toISOString(),
                }, { onConflict: 'zip_code' });
            }
          } catch (geoError) {
            console.warn(`Could not fetch land area for ZIP ${zipCode}, using average`);
          }
        }

        landAreaSqMiles = landAreaSqMeters / 2_589_988.11;
      }

      if (landAreaSqMiles === 0) {
        throw new Error(`Invalid land area for ZIP code ${zipCode}`);
      }

      const density = Math.round(population / landAreaSqMiles);
      console.log(`Population density for ${zipCode}: ${population} people / ${landAreaSqMiles} sq mi = ${density} people/sq mi`);
      return density;
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve population density for ZIP code ${zipCode}: ${error.message}`
      );
    }
  }
}

export const censusService = new CensusService();
