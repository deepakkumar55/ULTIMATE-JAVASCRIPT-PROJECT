import { STORAGE_KEYS, DEFAULT_SETTINGS, TIME_CONVERSION } from './constants.js';
import { $ } from './domUtils.js';

export class Settings {
  constructor(onSettingsChange) {
    this.onSettingsChange = onSettingsChange;
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.POMODORO_SETTINGS);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.workTime = settings.workTime;
      this.breakTime = settings.breakTime;
      this.longBreakTime = settings.longBreakTime;
      this.cyclesBeforeLongBreak = settings.cyclesBeforeLongBreak;
    } else {
      this.setDefaultSettings();
    }
  }

  setDefaultSettings() {
    this.workTime = DEFAULT_SETTINGS.WORK_TIME;
    this.breakTime = DEFAULT_SETTINGS.BREAK_TIME;
    this.longBreakTime = DEFAULT_SETTINGS.LONG_BREAK_TIME;
    this.cyclesBeforeLongBreak = DEFAULT_SETTINGS.CYCLES_BEFORE_LONG_BREAK;
  }

  saveSettings() {
    const settings = {
      workTime: this.workTime,
      breakTime: this.breakTime,
      longBreakTime: this.longBreakTime,
      cyclesBeforeLongBreak: this.cyclesBeforeLongBreak
    };
    localStorage.setItem(STORAGE_KEYS.POMODORO_SETTINGS, JSON.stringify(settings));
  }

  initModal() {
    MicroModal.init();

    const workTimeInput = $('#workTime');
    const breakTimeInput = $('#breakTime');
    const longBreakTimeInput = $('#longBreakTime');
    const cyclesBeforeLongBreakInput = $('#cyclesBeforeLongBreak');
    const openSettingButton = $('#openSetting');

    workTimeInput.value = this.workTime / TIME_CONVERSION.SECONDS_IN_MINUTE;
    breakTimeInput.value = this.breakTime / TIME_CONVERSION.SECONDS_IN_MINUTE;
    longBreakTimeInput.value = this.longBreakTime / TIME_CONVERSION.SECONDS_IN_MINUTE;
    cyclesBeforeLongBreakInput.value = this.cyclesBeforeLongBreak;

    $('.modal__btn-primary').addEventListener('click', () => {
      this.workTime = workTimeInput.value * TIME_CONVERSION.SECONDS_IN_MINUTE;
      this.breakTime = breakTimeInput.value * TIME_CONVERSION.SECONDS_IN_MINUTE;
      this.longBreakTime = longBreakTimeInput.value * TIME_CONVERSION.SECONDS_IN_MINUTE;
      this.cyclesBeforeLongBreak = parseInt(cyclesBeforeLongBreakInput.value);

      this.saveSettings();

      if (this.onSettingsChange) {
        this.onSettingsChange({
          workTime: this.workTime,
          breakTime: this.breakTime,
          longBreakTime: this.longBreakTime,
          cyclesBeforeLongBreak: this.cyclesBeforeLongBreak
        });
      }

      MicroModal.close('modal-settings');
    });

    openSettingButton.addEventListener('click', () => {
      MicroModal.show('modal-settings');
    });
  }
}
