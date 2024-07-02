import { MESSAGES, CONFIRM_TEXT } from './constants.js';

export class AlarmDialog {
  constructor(alarmSound, startCallback, pauseCallback) {
    this.alarmSound = alarmSound;
    this.startCallback = startCallback;
    this.pauseCallback = pauseCallback;
  }

  show(isWorkTime) {
    const { message, confirmText, cancelText } = this.getDialogTexts(isWorkTime);
    const result = confirm(message);

    if (result) {
      this.alarmSound.reset();
      this.startCallback();
    } else {
      this.pauseCallback();
    }
  }

  getDialogTexts(isWorkTime) {
    if (isWorkTime) {
      return {
        message: MESSAGES.WORK_OVER,
        confirmText: CONFIRM_TEXT.START_BREAK,
        cancelText: CONFIRM_TEXT.CONTINUE_WORK
      };
    } else {
      return {
        message: MESSAGES.BREAK_OVER,
        confirmText: CONFIRM_TEXT.START_WORK,
        cancelText: CONFIRM_TEXT.CONTINUE_BREAK
      };
    }
  }
}
