import { googleMapsService } from "./google-maps.service";
import { censusService } from "./census.service";
import { qualificationRulesService } from "./qualification-rules.service";
import type {
  QualificationResult,
  BusinessTier,
  StoreHours,
  Settings,
} from "@shared/schema";

const TIER_1_TYPES = [
  "supermarket",
  "grocery_or_supermarket",
  "grocery",
  "convenience_store",
];

const TIER_2_TYPES = [
  "liquor_store",
  "store",
  "pharmacy",
  "drugstore",
  "casino",
  "hotel",
  "lodging",
  "jewelry_store",
  "shopping_mall",
  "restaurant",
  "cafe",
  "meal_takeaway",
  "meal_delivery",
  "laundry",
  "car_repair",
  "hardware_store",
  "sporting_goods_store",
  "clothing_store",
  "shoe_store",
  "electronics_store",
  "home_goods_store",
];

const TIER_2_KEYWORDS = [
  "smoke",
  "wireless",
  "cell phone",
  "check cashing",
  "money transfer",
  "pawn",
  "dollar",
  "discount",
  "gun",
  "fast food",
  "deli",
  "auto",
  "bowling",
  "thrift",
  "shipping",
  "sneaker",
  "bingo",
];

export class QualificationService {
  private classifyBusinessType(
    name: string,
    types: string[]
  ): { tier: BusinessTier; tierAmount: number | null; category: string } {
    const nameLower = name.toLowerCase();
    const typesLower = types.map((t) => t.toLowerCase());

    for (const tier1Type of TIER_1_TYPES) {
      if (typesLower.includes(tier1Type)) {
        return {
          tier: "tier1",
          tierAmount: 300,
          category: this.formatCategory(tier1Type),
        };
      }
    }

    for (const keyword of TIER_2_KEYWORDS) {
      if (nameLower.includes(keyword)) {
        return {
          tier: "tier2",
          tierAmount: 200,
          category: this.formatCategory(keyword),
        };
      }
    }

    for (const tier2Type of TIER_2_TYPES) {
      if (typesLower.includes(tier2Type)) {
        return {
          tier: "tier2",
          tierAmount: 200,
          category: this.formatCategory(tier2Type),
        };
      }
    }

    return {
      tier: "unqualified",
      tierAmount: null,
      category: types.length > 0 ? this.formatCategory(types[0]) : "Unknown",
    };
  }

  private formatCategory(type: string): string {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private parseStoreHours(weekdayText?: string[]): StoreHours {
    if (!weekdayText || weekdayText.length === 0) {
      return {
        daysOpen: 0,
        averageHoursPerDay: 0,
        meetsRequirements: false,
        weeklySchedule: this.getDefaultSchedule(),
      };
    }

    console.log("Parsing store hours from weekdayText:", weekdayText);

    const schedule = weekdayText.map((dayText) => {
      const parts = dayText.split(": ");
      const day = parts[0];
      const hours = parts[1] || "Closed";
      const isOpen = hours.toLowerCase() !== "closed";

      let hoursCount = 0;
      if (isOpen && hours !== "Open 24 hours") {
        const timeRanges = hours.split(", ");
        console.log(`${day}: Processing time ranges:`, timeRanges);

        for (const range of timeRanges) {
          const times = range.split(/\s*[–−—-]\s*/);
          if (times.length === 2) {
            const start = this.parseTime(times[0].trim());
            const end = this.parseTime(times[1].trim());
            console.log(`  Range "${range}" -> start: ${start}, end: ${end}`);

            if (start !== null && end !== null) {
              let rangeHours = 0;
              if (end > start) {
                rangeHours = end - start;
              } else {
                rangeHours = 24 - start + end;
              }
              console.log(`  Calculated hours for this range: ${rangeHours}`);
              hoursCount += rangeHours;
            } else {
              console.warn(`  Failed to parse times: start=${start}, end=${end}`);
            }
          } else {
            console.warn(`  Invalid range format: "${range}", split result:`, times);
          }
        }
      } else if (hours === "Open 24 hours") {
        hoursCount = 24;
      }

      console.log(`${day}: Total hours = ${hoursCount}`);

      return {
        day,
        hours,
        isOpen,
        hoursCount,
      };
    });

    const daysOpen = schedule.filter((s) => s.isOpen).length;
    const totalHours = schedule.reduce((sum, s) => sum + s.hoursCount, 0);
    const averageHoursPerDay = daysOpen > 0 ? totalHours / daysOpen : 0;
    const meetsRequirements = daysOpen >= 5 && averageHoursPerDay >= 9;

    console.log(`Summary: ${daysOpen} days open, ${totalHours} total hours, ${averageHoursPerDay.toFixed(2)} avg hours/day`);

    return {
      daysOpen,
      averageHoursPerDay,
      meetsRequirements,
      weeklySchedule: schedule,
    };
  }

  private parseTime(timeStr: string): number | null {
    const trimmed = timeStr.trim();

    const match = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) {
      const simpleMatch = trimmed.match(/(\d{1,2})\s*(AM|PM)/i);
      if (simpleMatch) {
        let hours = parseInt(simpleMatch[1]);
        const period = simpleMatch[2].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return hours;
      }
      return null;
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours + minutes / 60;
  }

  private getDefaultSchedule() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map((day) => ({
      day,
      hours: "Hours not available",
      isOpen: false,
      hoursCount: 0,
    }));
  }

  private analyzeBTMProximity(nearbyBTMs: Array<{ name: string; types: string[] }>) {
    const nameLower = (name: string) => name.toLowerCase();

    const bitcoinDepotCount = nearbyBTMs.filter(
      (btm) =>
        nameLower(btm.name).includes("bitcoin depot") ||
        nameLower(btm.name).includes("bitcoindepot")
    ).length;

    const competitors = [
      { name: "CoinFlip", keywords: ["coinflip", "coin flip"] },
      { name: "RockItCoin", keywords: ["rockitcoin", "rockit coin"] },
      { name: "CoinCloud", keywords: ["coincloud", "coin cloud"] },
      { name: "Athena Bitcoin", keywords: ["athena"] },
      { name: "Bitcoin of America", keywords: ["bitcoin of america", "boa"] },
      { name: "Byte Federal", keywords: ["byte federal", "bytefederal"] },
      { name: "LibertyX", keywords: ["libertyx", "liberty x"] },
    ];

    const competitorCounts = competitors
      .map((competitor) => {
        const count = nearbyBTMs.filter((btm) =>
          competitor.keywords.some((keyword) => nameLower(btm.name).includes(keyword))
        ).length;
        return { name: competitor.name, count };
      })
      .filter((c) => c.count > 0);

    const totalCompetitors = competitorCounts.reduce((sum, c) => sum + c.count, 0);

    return {
      bitcoinDepotCount,
      competitors: competitorCounts,
      totalCompetitors,
      meetsRequirement: bitcoinDepotCount === 0,
    };
  }

  async qualifyLocation(address: string, settings: Settings): Promise<QualificationResult> {
    const geocodeResult = await googleMapsService.geocodeAddress(address);
    const placeDetails = await googleMapsService.getPlaceDetails(geocodeResult.placeId);

    const populationDensityResult = await censusService.getPopulationDensity(geocodeResult.zipCode);
    const populationDensity = populationDensityResult.density;

    const [nearbyBTMs, autoRejectedStates, proximityRule, kioskDensityRule, populationRule, ignoredCompetitors] = await Promise.all([
      googleMapsService.searchNearbyBTMs(
        geocodeResult.location.lat,
        geocodeResult.location.lng,
        1.0
      ),
      qualificationRulesService.getAutoRejectedStates(),
      qualificationRulesService.getProximityRuleForDensity(populationDensity),
      qualificationRulesService.getKioskDensityRuleForDensity(populationDensity),
      qualificationRulesService.getPopulationRuleForState(geocodeResult.stateCode),
      qualificationRulesService.getIgnoredCompetitors(),
    ]);

    const businessClassification = this.classifyBusinessType(
      placeDetails.name,
      placeDetails.types
    );

    const storeHours = this.parseStoreHours(placeDetails.openingHours?.weekdayText);

    const reasons: string[] = [];

    console.log(`\n=== Qualification Check for ${geocodeResult.formattedAddress} ===`);
    console.log(`State: ${geocodeResult.stateCode} (${geocodeResult.stateName})`);
    console.log(`Population Density: ${populationDensity} people/sq mi`);

    // Check 1: Auto-rejected states
    if (autoRejectedStates.has(geocodeResult.stateCode)) {
      const rejectedState = autoRejectedStates.get(geocodeResult.stateCode);
      console.log(`REJECTED: State is in auto-rejected list`);
      reasons.push(`This state (${geocodeResult.stateName}) does not allow Bitcoin Depot kiosks`);
    }

    // Check 2: Population density and population minimums
    if (populationRule) {
      let effectiveDensityMin = populationRule.density_minimum;

      if (qualificationRulesService.canUseLowerDensityMinimum(geocodeResult.stateCode, populationDensity, populationRule)) {
        effectiveDensityMin = 300;
        console.log(`Density minimum reduced to 300 for state with sufficient population`);
      }

      if (populationDensity < effectiveDensityMin) {
        console.log(`REJECTED: Density ${populationDensity} below minimum ${effectiveDensityMin}`);
        reasons.push(`population density too low (${populationDensity} vs ${effectiveDensityMin} required)`);
      } else {
        console.log(`PASS: Density meets minimum`);
      }
    }

    // Check 3: Business type
    if (businessClassification.tier === "unqualified") {
      console.log(`REJECTED: Business type not qualified`);
      reasons.push("business type not qualified");
    } else {
      console.log(`PASS: Business tier ${businessClassification.tier} is qualified`);
    }

    // Check 4: Store hours
    if (!storeHours.meetsRequirements) {
      console.log(`REJECTED: Store hours do not meet requirements (${storeHours.daysOpen} days, ${storeHours.averageHoursPerDay.toFixed(2)} hours/day)`);
      reasons.push(`insufficient store hours (${storeHours.daysOpen} days open, ${storeHours.averageHoursPerDay.toFixed(1)} hrs/day vs 5+ days, 9+ hrs/day required)`);
    } else {
      console.log(`PASS: Store hours meet requirements`);
    }

    // Check 5: Bitcoin Depot Proximity (based on dynamic distance rule)
    let requiredProximityDistance = 1.0;
    if (proximityRule) {
      requiredProximityDistance = qualificationRulesService.getRequiredProximityDistance(
        proximityRule,
        geocodeResult.stateCode
      );
      console.log(`Bitcoin Depot proximity requirement: ${requiredProximityDistance} miles`);
    }

    const bitcoinDepotNearby = nearbyBTMs.some(
      (btm) => this.isNearbyBitcoinDepot(btm) && this.calculateDistance(geocodeResult.location, btm.coords) < requiredProximityDistance
    );

    if (bitcoinDepotNearby) {
      console.log(`REJECTED: Bitcoin Depot found within ${requiredProximityDistance} miles`);
      reasons.push(`existing Bitcoin Depot kiosk within ${requiredProximityDistance} miles`);
    } else {
      console.log(`PASS: No Bitcoin Depot kiosks within ${requiredProximityDistance} miles`);
    }

    // Check 6: Competitor in same store
    const competitorInStore = nearbyBTMs.some(
      (btm) => this.isCompetitorInStore(btm, ignoredCompetitors) && this.calculateDistance(geocodeResult.location, btm.coords) < 0.01
    );

    if (competitorInStore) {
      console.log(`REJECTED: Competitor kiosk in same store`);
      reasons.push("competitor kiosk already in same store");
    } else {
      console.log(`PASS: No competitor kiosks in same store`);
    }

    // Check 7: Kiosk density (total kiosks within 1 mile)
    let maxKiosks = 2;
    if (kioskDensityRule) {
      maxKiosks = qualificationRulesService.getMaxKioskDensity(
        kioskDensityRule,
        geocodeResult.stateCode
      );
      console.log(`Max kiosks allowed within 1 mile: ${maxKiosks}`);
    }

    const totalKiosksWithinMile = nearbyBTMs.filter(
      (btm) => this.calculateDistance(geocodeResult.location, btm.coords) < 1.0
    ).length;

    if (totalKiosksWithinMile > maxKiosks) {
      console.log(`REJECTED: ${totalKiosksWithinMile} kiosks within 1 mile exceeds limit of ${maxKiosks}`);
      reasons.push(`too many kiosks nearby (${totalKiosksWithinMile} found, max ${maxKiosks} allowed within 1 mile)`);
    } else {
      console.log(`PASS: ${totalKiosksWithinMile} kiosks within 1 mile (limit ${maxKiosks})`);
    }

    const qualified = reasons.length === 0;

    const btmProximity = this.analyzeBTMProximity(nearbyBTMs);

    const populationCheck = {
      zipCode: geocodeResult.zipCode,
      population: populationDensityResult.population,
      density: populationDensity,
      threshold: settings.minimumPopulationDensity,
      meetsRequirement: !reasons.some(r => r.includes("density too low")),
    };

    const businessCheck = {
      name: placeDetails.name,
      category: businessClassification.category,
      tier: businessClassification.tier,
      tierAmount: businessClassification.tierAmount,
      meetsRequirement: businessClassification.tier !== "unqualified",
      detectedTypes: placeDetails.types
        .map((t) => this.formatCategory(t))
        .slice(0, 5),
    };

    let summary = "";
    if (qualified) {
      summary = `This location meets all requirements for Bitcoin ATM placement. ${businessCheck.tier === "tier1" ? "Tier 1" : "Tier 2"} business with ${populationCheck.density.toLocaleString()} people per sq mi, no Bitcoin Depot competition within ${requiredProximityDistance} miles, and adequate operating hours.`;
    } else {
      summary = `This location does not qualify due to: ${reasons.join(", ")}.`;
    }

    return {
      qualified,
      address,
      formattedAddress: geocodeResult.formattedAddress,
      stateCode: geocodeResult.stateCode,
      stateName: geocodeResult.stateName,
      location: geocodeResult.location,
      populationDensity: populationCheck,
      btmProximity,
      businessType: businessCheck,
      storeHours,
      summary,
      timestamp: new Date().toISOString(),
    };
  }

  private isNearbyBitcoinDepot(btm: any): boolean {
    const nameLower = btm.name.toLowerCase();
    return nameLower.includes("bitcoin depot") || nameLower.includes("bitcoindepot");
  }

  private isCompetitorInStore(btm: any, ignoredCompetitors: Set<string>): boolean {
    const nameLower = btm.name.toLowerCase();
    if (ignoredCompetitors.has(nameLower)) {
      return false;
    }
    return btm.types?.some((type: string) => type.toLowerCase().includes("atm")) ?? false;
  }

  private calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ): number {
    const R = 3959;
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const qualificationService = new QualificationService();
