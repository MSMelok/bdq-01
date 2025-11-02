import { z } from "zod";

// Location qualification request
export const qualificationRequestSchema = z.object({
  address: z.string().min(1, "Address is required"),
});

export type QualificationRequest = z.infer<typeof qualificationRequestSchema>;

// Competitor BTM data
export const competitorBtmSchema = z.object({
  name: z.string(),
  count: z.number(),
});

export type CompetitorBtm = z.infer<typeof competitorBtmSchema>;

// Business tier classification
export const businessTierSchema = z.enum(["tier1", "tier2", "unqualified"]);
export type BusinessTier = z.infer<typeof businessTierSchema>;

// Store hours data
export const storeHoursSchema = z.object({
  daysOpen: z.number(),
  averageHoursPerDay: z.number(),
  meetsRequirements: z.boolean(),
  weeklySchedule: z.array(z.object({
    day: z.string(),
    hours: z.string(),
    isOpen: z.boolean(),
    hoursCount: z.number(),
  })),
});

export type StoreHours = z.infer<typeof storeHoursSchema>;

// Population density data
export const populationDensitySchema = z.object({
  zipCode: z.string(),
  population: z.number(),
  density: z.number(),
  threshold: z.number(),
  meetsRequirement: z.boolean(),
});

export type PopulationDensity = z.infer<typeof populationDensitySchema>;

// BTM proximity data
export const btmProximitySchema = z.object({
  bitcoinDepotCount: z.number(),
  competitors: z.array(competitorBtmSchema),
  totalCompetitors: z.number(),
  meetsRequirement: z.boolean(),
});

export type BtmProximity = z.infer<typeof btmProximitySchema>;

// Business type data
export const businessTypeSchema = z.object({
  name: z.string(),
  category: z.string(),
  tier: businessTierSchema,
  tierAmount: z.number().nullable(),
  meetsRequirement: z.boolean(),
  detectedTypes: z.array(z.string()),
});

export type BusinessType = z.infer<typeof businessTypeSchema>;

// Complete qualification result
export const qualificationResultSchema = z.object({
  qualified: z.boolean(),
  address: z.string(),
  formattedAddress: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  stateCode: z.string(),
  stateName: z.string(),
  populationDensity: populationDensitySchema,
  btmProximity: btmProximitySchema,
  businessType: businessTypeSchema,
  storeHours: storeHoursSchema,
  summary: z.string(),
  timestamp: z.string(),
});

export type QualificationResult = z.infer<typeof qualificationResultSchema>;

// Settings schema
export const settingsSchema = z.object({
  minimumPopulationDensity: z.number().min(0),
  searchRadiusMiles: z.number().min(0.1).max(10),
});

export type Settings = z.infer<typeof settingsSchema>;

export const insertSettingsSchema = settingsSchema;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  minimumPopulationDensity: 1000,
  searchRadiusMiles: 1,
};
