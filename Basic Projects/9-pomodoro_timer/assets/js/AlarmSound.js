export class AlarmSound {
  constructor(soundElement) {
    this.alarmSound = soundElement;
  }

  play() {
    this.alarmSound.play();
  }

  pause() {
    this.alarmSound.pause();
  }

  reset() {
    this.alarmSound.pause();
    this.alarmSound.currentTime = 0;
  }
}
