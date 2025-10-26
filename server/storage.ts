import { type Settings, DEFAULT_SETTINGS } from "@shared/schema";

export interface IStorage {
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private settings: Settings;

  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
  }

  async getSettings(): Promise<Settings> {
    return { ...this.settings };
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    this.settings = { ...settings };
    return { ...this.settings };
  }
}

export const storage = new MemStorage();
