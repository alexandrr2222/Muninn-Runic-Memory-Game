import { Header } from "./Header";
import { useSettings } from "@/shared/settings/useSettings";
import { CardGame } from "@/features/cardGame/CardGame";
import { useMusic } from "@/features/musicPlayer/useMusic";

function App() {
  const { settings, toggleSetting } = useSettings();
  useMusic(settings.musicOn);
  return (
    <div className="px-3 py-4 sm:p-5 select-none w-full max-w-[1700px] mx-auto min-h-dvh flex flex-col">
      <Header toggleSetting={toggleSetting} settings={settings} />
      <CardGame settings={settings} />
    </div>
  );
}

export default App;

// REFINEMENTS
// fix runes
// redo win/lose audio
// audio api
