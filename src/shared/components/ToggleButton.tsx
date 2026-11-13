import { commonIconStyle } from "../styles";
import { sounds } from "../sound/sounds";
import { useSound } from "../sound/useSound";
export function ToggleButton({
  pressed,
  onToggle,
  label,
  OnIcon,
  OffIcon,
}: {
  pressed: boolean;
  onToggle: () => void;
  label: string;
  OnIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  OffIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const playSound = useSound();
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      className="inline-grid opacity-85 transition-[opacity,scale] duration-150 hover:opacity-100 active:scale-90"
      onClick={() => {
        if (pressed) playSound(sounds.toggleOnSound);
        else playSound(sounds.toggleOffSound);
        onToggle();
      }}
    >
      <OnIcon
        aria-hidden="true"
        className={`${commonIconStyle} col-start-1 row-start-1 transition-[opacity,scale] duration-200 ${pressed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      />
      <OffIcon
        aria-hidden="true"
        className={`${commonIconStyle} col-start-1 row-start-1 transition-[opacity,scale] duration-200 ${pressed ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      />
    </button>
  );
}
