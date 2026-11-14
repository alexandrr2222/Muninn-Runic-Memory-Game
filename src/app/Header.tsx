import SpeakerOn from "./assets/headerUI/speaker.svg?react";
import SpeakerOff from "./assets/headerUI/speaker-off.svg?react";
import MusicOn from "./assets/headerUI/sound-on.svg?react";
import MusicOff from "./assets/headerUI/sound-off.svg?react";
import TooltipsOn from "./assets/headerUI/candle-on.svg?react";
import TooltipsOff from "./assets/headerUI/candle-off.svg?react";
import { ToggleButton } from "@/shared/components/ToggleButton";
import { shadow } from "@/shared/styles";
import { useSettingsContext } from "@/shared/settings/useSettingsContext";
import { sounds } from "@/shared/sound/sounds";
import { useSound } from "@/shared/sound/useSound";
export function Header() {
  const { settings, toggleSetting } = useSettingsContext();
  const playSound = useSound();
  return (
    <header
      className={`grid grid-cols-[1fr_auto_1fr] items-center sm:px-8 ${shadow}`}
    >
      <div className="justify-self-start self-start pt-2">
        <ToggleButton
          pressed={settings.tooltipsOn}
          onToggle={() => {
            if (!settings.tooltipsOn) playSound(sounds.toggleOnSound);
            else playSound(sounds.toggleOffSound);
            toggleSetting("tooltipsOn");
          }}
          label="Tooltips"
          OnIcon={TooltipsOn}
          OffIcon={TooltipsOff}
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-norse [text-shadow:0_2px_4px_rgba(0,0,0,0.6)]">
          Muninn
        </h1>
        <p className="text-sm sm:text-xl lg:text-2xl opacity-80 text-center [text-shadow:0_2px_4px_rgba(0,0,0,0.6)]">
          Norse Runes Memory Game
        </p>
      </div>

      <div className="justify-self-end self-start pt-2">
        <ToggleButton
          pressed={settings.soundOn}
          onToggle={() => {
            if (!settings.soundOn)
              playSound(sounds.toggleOnSound, { playDespiteMute: true });
            toggleSetting("soundOn");
          }}
          label="Sound"
          OnIcon={SpeakerOn}
          OffIcon={SpeakerOff}
        />
        <ToggleButton
          pressed={settings.musicOn}
          onToggle={() => {
            if (!settings.musicOn) playSound(sounds.toggleOnSound);
            else playSound(sounds.toggleOffSound);
            toggleSetting("musicOn");
          }}
          label="Music"
          OnIcon={MusicOn}
          OffIcon={MusicOff}
        />
      </div>
    </header>
  );
}
