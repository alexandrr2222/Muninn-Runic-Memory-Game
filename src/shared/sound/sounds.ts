const files = import.meta.glob<{ default: string }>("./assets/*", {
  eager: true,
});

const loseSound = new Audio(files["./assets/lose.mp3"].default);
const winSound = new Audio(files["./assets/win.mp3"].default);
const toggleOnSound = new Audio(files["./assets/toggle-on.wav"].default);
const toggleOffSound = new Audio(files["./assets/toggle-off.wav"].default);
const knockSoundArray: Array<HTMLAudioElement> = [];
for (let i = 1; i < 6; i++) {
  const knockSound = new Audio(files[`./assets/knock-${i}.wav`].default);
  knockSound.preservesPitch = false;
  knockSoundArray.push(knockSound);
}
function getRandomKnock() {
  return knockSoundArray[Math.floor(Math.random() * knockSoundArray.length)];
}
function getKnockRate({ progress }: { progress: number }) {
  const MAX_KNOCK_RATE = 1.23;
  return 1 + progress * (MAX_KNOCK_RATE - 1);
}

export const sounds = {
  loseSound,
  winSound,
  toggleOnSound,
  toggleOffSound,
  getRandomKnock,
  getKnockRate,
};
