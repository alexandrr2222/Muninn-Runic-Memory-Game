import { useSettingsContext } from "../settings/useSettingsContext";

function playSound(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function useSound() {
  const { settings } = useSettingsContext();
  return (
    sound: HTMLAudioElement,
    {
      playDespiteMute = false,
      rateProgress = null,
      soundArray = [],
    }: {
      playDespiteMute?: boolean;
      rateProgress?: null | number;
      soundArray?: Array<HTMLAudioElement>;
    } = {},
  ) => {
    if (rateProgress !== null && settings.soundOn) {
      const rate = 1 + rateProgress * (1.23 - 1);
      const randomKnock: HTMLAudioElement =
        soundArray[Math.floor(Math.random() * soundArray.length)];
      randomKnock.playbackRate = rate;
      playSound(randomKnock);
    } else if (settings.soundOn || playDespiteMute) playSound(sound);
  };
}
