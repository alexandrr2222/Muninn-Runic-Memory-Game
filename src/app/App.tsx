import { Header } from "./Header";
import { CardGame } from "@/features/cardGame/CardGame";
import { useMusic } from "@/features/musicPlayer/useMusic";
import { useSettingsContext } from "@/shared/settings/useSettingsContext";

function App() {
  const { settings } = useSettingsContext();
  useMusic(settings.musicOn);
  return (
    <div className="px-3 py-4 sm:p-5 select-none w-full max-w-[1700px] mx-auto min-h-dvh flex flex-col">
      <Header />
      <CardGame />
    </div>
  );
}

export default App;
