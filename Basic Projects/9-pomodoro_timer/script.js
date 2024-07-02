import { PomodoroTimer } from './assets/js/PomodoroTimer.js';
import { $ } from './assets/js/domUtils.js';
import { ALERT_MESSAGES } from './assets/js/constants.js';

function initializePomodoroTimer() {
  setTimeout(() => new PomodoroTimer(), 500);
}

function checkAudioPermission(audioElement) {
  audioElement.play()
    .catch(error => {
      if (error.name === 'NotAllowedError') {
        MicroModal.show('modalaudio');
      }
    })
    .then(() => {
      setTimeout(() => {
        audioElement.pause();
        audioElement.currentTime = 0;
      }, 1000);
    });
}

function handleEnableAudioButtonClick(audioElement) {
  $('#enableAudioButton').addEventListener('click', () => {
    audioElement.play()
      .then(() => {
        setTimeout(() => {
          audioElement.pause();
          audioElement.currentTime = 0;
        }, 1000);
        MicroModal.close('modalaudio');
      })
      .catch(error => {
        console.error('Error attempting to play audio:', error);
        alert(ALERT_MESSAGES.AUDIO_PLAY_ERROR);
        MicroModal.close('modalaudio');
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const audioElement = $('#alarmSound');
  initializePomodoroTimer();
  checkAudioPermission(audioElement);
  handleEnableAudioButtonClick(audioElement);
});
