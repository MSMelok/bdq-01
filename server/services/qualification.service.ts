import { googleMapsService } from "./google-maps.service";
import { censusService } from "./census.service";
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

    const schedule = weekdayText.map((dayText) => {
      const parts = dayText.split(": ");
      const day = parts[0];
      const hours = parts[1] || "Closed";
      const isOpen = hours.toLowerCase() !== "closed";

      let hoursCount = 0;
      if (isOpen && hours !== "Open 24 hours") {
        const timeRanges = hours.split(", ");
        for (const range of timeRanges) {
          const times = range.split(/\s*[–−-]\s*/);
          if (times.length === 2) {
            const start = this.parseTime(times[0].trim());
            const end = this.parseTime(times[1].trim());
            if (start !== null && end !== null) {
              if (end > start) {
                hoursCount += end - start;
              } else {
                hoursCount += 24 - start + end;
              }
            }
          }
        }
      } else if (hours === "Open 24 hours") {
        hoursCount = 24;
      }

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

    const [populationDensity, nearbyBTMs] = await Promise.all([
      censusService.getPopulationDensity(geocodeResult.zipCode),
      googleMapsService.searchNearbyBTMs(
        geocodeResult.location.lat,
        geocodeResult.location.lng,
        settings.searchRadiusMiles
      ),
    ]);

    const businessClassification = this.classifyBusinessType(
      placeDetails.name,
      placeDetails.types
    );

    const storeHours = this.parseStoreHours(placeDetails.openingHours?.weekdayText);
    const btmProximity = this.analyzeBTMProximity(nearbyBTMs);

    const populationCheck = {
      zipCode: geocodeResult.zipCode,
      density: populationDensity,
      threshold: settings.minimumPopulationDensity,
      meetsRequirement: populationDensity >= settings.minimumPopulationDensity,
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

    const qualified =
      populationCheck.meetsRequirement &&
      btmProximity.meetsRequirement &&
      businessCheck.meetsRequirement &&
      storeHours.meetsRequirements;

    let summary = "";
    if (qualified) {
      summary = `This location meets all requirements for Bitcoin ATM placement. ${businessCheck.tier === "tier1" ? "Tier 1" : "Tier 2"} business with ${populationCheck.density.toLocaleString()} people per sq mi, no existing Bitcoin Depot ATMs nearby, and adequate operating hours.`;
    } else {
      const reasons = [];
      if (!populationCheck.meetsRequirement) {
        reasons.push("insufficient population density");
      }
      if (!btmProximity.meetsRequirement) {
        reasons.push("existing Bitcoin Depot ATM nearby");
      }
      if (!businessCheck.meetsRequirement) {
        reasons.push("business type not qualified");
      }
      if (!storeHours.meetsRequirements) {
        reasons.push("inadequate store hours");
      }
      summary = `This location does not qualify due to: ${reasons.join(", ")}.`;
    }

    return {
      qualified,
      address,
      formattedAddress: geocodeResult.formattedAddress,
      location: geocodeResult.location,
      populationDensity: populationCheck,
      btmProximity,
      businessType: businessCheck,
      storeHours,
      summary,
      timestamp: new Date().toISOString(),
    };
  }
}

export const qualificationService = new QualificationService();
