import { supabase } from "../supabase";

export interface ProximityRule {
  density_min: number;
  density_max: number;
  standard_distance_miles: number;
  state_exceptions: Record<string, number>;
}

export interface KioskDensityRule {
  density_min: number;
  density_max: number;
  standard_kiosk_limit: number;
  state_exceptions: Record<string, number>;
}

export interface PopulationRule {
  state_code: string | null;
  population_minimum: number;
  density_minimum: number;
  special_conditions: string;
}

export class QualificationRulesService {
  async getAutoRejectedStates(): Promise<Map<string, any>> {
    const { data, error } = await supabase
      .from("auto_rejected_states")
      .select("*")
      .is("discontinued_date", null);

    if (error) {
      console.error("Error fetching auto-rejected states:", error);
      return new Map();
    }

    const stateMap = new Map();
    data?.forEach((state) => {
      stateMap.set(state.state_code, state);
    });
    return stateMap;
  }

  async getProximityRuleForDensity(density: number): Promise<ProximityRule | null> {
    const { data, error } = await supabase
      .from("proximity_rules")
      .select("*")
      .lte("density_min", density)
      .gte("density_max", density)
      .single();

    if (error || !data) {
      console.warn("Could not find proximity rule for density:", density);
      return null;
    }

    return {
      density_min: data.density_min,
      density_max: data.density_max,
      standard_distance_miles: data.standard_distance_miles,
      state_exceptions: data.state_exceptions || {},
    };
  }

  async getKioskDensityRuleForDensity(density: number): Promise<KioskDensityRule | null> {
    const { data, error } = await supabase
      .from("kiosk_density_rules")
      .select("*")
      .lte("density_min", density)
      .gte("density_max", density)
      .single();

    if (error || !data) {
      console.warn("Could not find kiosk density rule for density:", density);
      return null;
    }

    return {
      density_min: data.density_min,
      density_max: data.density_max,
      standard_kiosk_limit: data.standard_kiosk_limit,
      state_exceptions: data.state_exceptions || {},
    };
  }

  async getPopulationRuleForState(stateCode: string | null): Promise<PopulationRule | null> {
    const { data, error } = await supabase
      .from("population_minimum_rules")
      .select("*")
      .eq("state_code", stateCode)
      .single();

    if (!error && data) {
      return {
        state_code: data.state_code,
        population_minimum: data.population_minimum,
        density_minimum: data.density_minimum,
        special_conditions: data.special_conditions,
      };
    }

    const { data: defaultData, error: defaultError } = await supabase
      .from("population_minimum_rules")
      .select("*")
      .is("state_code", null)
      .single();

    if (defaultError || !defaultData) {
      console.warn("Could not find population rule for state:", stateCode);
      return null;
    }

    return {
      state_code: null,
      population_minimum: defaultData.population_minimum,
      density_minimum: defaultData.density_minimum,
      special_conditions: defaultData.special_conditions,
    };
  }

  async getIgnoredCompetitors(): Promise<Set<string>> {
    const { data, error } = await supabase
      .from("ignored_competitors")
      .select("competitor_name");

    if (error) {
      console.error("Error fetching ignored competitors:", error);
      return new Set();
    }

    return new Set(data?.map((row) => row.competitor_name.toLowerCase()) || []);
  }

  getRequiredProximityDistance(
    proximityRule: ProximityRule,
    stateCode: string
  ): number {
    const stateOverride = proximityRule.state_exceptions[stateCode];
    return stateOverride ?? proximityRule.standard_distance_miles;
  }

  getMaxKioskDensity(
    kioskDensityRule: KioskDensityRule,
    stateCode: string
  ): number {
    const stateOverride = kioskDensityRule.state_exceptions[stateCode];
    return stateOverride ?? kioskDensityRule.standard_kiosk_limit;
  }

  canUseLowerDensityMinimum(
    stateCode: string,
    zipPopulation: number,
    populationRule: PopulationRule
  ): boolean {
    if (stateCode === "AZ" || stateCode === "WA") {
      return zipPopulation >= 15000;
    }
    return false;
  }
}

export const qualificationRulesService = new QualificationRulesService();
