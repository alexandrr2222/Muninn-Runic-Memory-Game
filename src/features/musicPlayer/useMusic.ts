import { useEffect } from "react";
import music from "./music_norse.mp3";

const MUSIC_VOLUME = 0.25;

const musicPlayer = new Audio(music);
musicPlayer.loop = true;
musicPlayer.volume = MUSIC_VOLUME;

export function useMusic(musicOn: boolean) {
  useEffect(() => {
    if (!musicOn) {
      musicPlayer.pause();
      return;
    }
    // tries to play and if browser blocks it(which it usually does)
    // starts it anyway on user interaction
    const start = () =>
      musicPlayer.play().catch(() => {
        console.warn("music did not load properly");
      });
    musicPlayer.play().catch(() => {
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
    });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [musicOn]);
}
