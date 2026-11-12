import { useSettings } from "./useSettings";
import { SettingsContext } from "./settingsContext";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { settings, toggleSetting } = useSettings();
  return (
    <SettingsContext value={{ settings, toggleSetting }}>
      {children}
    </SettingsContext>
  );
}
