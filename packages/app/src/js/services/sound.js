const audio = new Audio('/static/sound.mp3');
audio.volume = 0.5;
export const play = () => {
  if (audio.paused) {
    audio.currentTime = 0;
    audio.play();
  }
};
