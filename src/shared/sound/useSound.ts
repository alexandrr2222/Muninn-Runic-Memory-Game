import { useSettingsContext } from "../settings/useSettingsContext";

function playSound(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function useSound() {
  const { settings } = useSettingsContext();
  return (sound: HTMLAudioElement) => {
    if (settings.soundOn) playSound(sound);
  };
}
