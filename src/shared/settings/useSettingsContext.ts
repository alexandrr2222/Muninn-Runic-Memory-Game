import { useContext } from "react";
import { SettingsContext } from "./settingsContext";

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettingsContext must be used inside Settings Provider");
  return ctx;
}
