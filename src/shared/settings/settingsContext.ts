import { createContext } from "react";
import type { SettingsType } from "./settings";
export const SettingsContext = createContext<{
  settings: SettingsType;
  toggleSetting: (settingsItem: keyof SettingsType) => void;
} | null>(null);
