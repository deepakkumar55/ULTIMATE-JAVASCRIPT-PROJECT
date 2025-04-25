/**
 * ChronoSphere - Advanced Clock Application
 * Featuring analog clock, digital clock, stopwatch, and timer functionality
 * with performance optimizations and enhanced error handling
 */
document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization - Cache frequently accessed DOM elements
  const elements = {
    body: document.querySelector('body'),
    modeSwitch: document.getElementById('mode-switch'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Analog clock elements
    hourHand: document.querySelector('.hour'),
    minuteHand: document.querySelector('.minute'),
    secondHand: document.querySelector('.second'),
    dateDisplay: document.getElementById('date-display'),
    timeDisplay: document.getElementById('time-display'),
    
    // Digital clock elements
    digitalTime: document.getElementById('digital-time'),
    digitalDate: document.getElementById('digital-date'),
    digitalSeconds: document.getElementById('digital-seconds'),
    formatToggle: document.getElementById('format-toggle'),
    showSecondsToggle: document.getElementById('show-seconds-toggle'),
    
    // Stopwatch elements
    stopwatchDisplay: document.getElementById('stopwatch-display'),
    stopwatchStart: document.getElementById('stopwatch-start'),
    stopwatchLap: document.getElementById('stopwatch-lap'),
    stopwatchReset: document.getElementById('stopwatch-reset'),
    lapList: document.getElementById('lap-list'),
    
    // Timer elements
    hoursInput: document.getElementById('hours'),
    minutesInput: document.getElementById('minutes'),
    secondsInput: document.getElementById('seconds'),
    timerDisplay: document.getElementById('timer-display'),
    timerStart: document.getElementById('timer-start'),
    timerPause: document.getElementById('timer-pause'),
    timerReset: document.getElementById('timer-reset'),
    timerProgressBar: document.getElementById('timer-progress-bar')
  };
  
  // App State with improved organization and defaults
  const state = {
    theme: localStorage.getItem('clockTheme') || 'light',
    digitalFormat: localStorage.getItem('digitalFormat') || '24h',
    showSeconds: localStorage.getItem('showSeconds') === 'true' || false,
    activeTab: localStorage.getItem('activeTab') || 'analog-clock',
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    stopwatch: {
      running: false,
      startTime: 0,
      elapsedTime: 0,
      lapTimes: [],
      lapCounter: 0,
      bestLapIndex: -1,
      worstLapIndex: -1,
      animationFrameId: null
    },
    
    timer: {
      running: false,
      paused: false,
      duration: 0,
      remaining: 0,
      startTime: 0,
      originalDuration: 0,
      soundOption: localStorage.getItem('timerSound') || 'beep',
      notificationEnabled: false,  // Will be updated after permission check
      animationFrameId: null,
      audioContext: null
    }
  };
  
  /**
   * Logger utility for better debugging and error tracking
   */
  const logger = {
    log: (message, data) => {
      if (window.debugMode) {
        console.log(`[ChronoSphere] ${message}`, data || '');
      }
    },
    error: (message, error) => {
      console.error(`[ChronoSphere] ${message}`, error || '');
      // Could be extended to report to an error tracking service
    }
  };
  
  /**
   * Safe DOM manipulation helper functions
   */
  const dom = {
    // Safely updates element text content
    setText: (element, text) => {
      if (element) element.textContent = text;
    },
    
    // Safely updates element attribute
    setAttr: (element, attr, value) => {
      if (element) element.setAttribute(attr, value);
    },
    
    // Safely toggles element class
    toggleClass: (element, className, force) => {
      if (element) element.classList.toggle(className, force);
    },
    
    // Safely adds click event handler with error catching
    onClick: (element, handler) => {
      if (!element) return;
      element.addEventListener('click', (e) => {
        try {
          handler(e);
        } catch (err) {
          logger.error('Error in click handler', err);
        }
      });
    }
  };
  
  /**
   * Initialize application
   */
  function init() {
    try {
      initTheme();
      initDigitalFormat();
      initShowSeconds();
      initTabNavigation();
      initStopwatchControls();
      initTimerControls();
      initDigitalClockControls();
      initKeyboardShortcuts();
      
      // Check notification permission
      checkNotificationPermission();
      
      // Start the clocks
      startClocks();
      
      // Create ARIA announcements for accessibility
      createAriaAnnouncements();
      
      // Set the active tab (must come after all inits)
      setActiveTab(state.activeTab);
      
      // Setup timer input controls
      setupTimerInputs();
      
      // Log initialization success
      logger.log('Initialization complete');
    } catch (error) {
      logger.error('Error during initialization', error);
      // Display fallback content if critical error
      handleCriticalError();
    }
  }
  
  /**
   * Apply saved theme
   */
  function initTheme() {
    try {
      if (state.theme === 'dark') {
        elements.body.classList.add('dark');
        if (elements.modeSwitch) elements.modeSwitch.textContent = 'Light Mode';
      }
    } catch (error) {
      logger.error('Error initializing theme', error);
    }
  }
  
  /**
   * Apply saved digital clock format
   */
  function initDigitalFormat() {
    try {
      if (elements.formatToggle && state.digitalFormat === '12h') {
        elements.formatToggle.classList.add('active');
        elements.formatToggle.setAttribute('aria-pressed', 'true');
      }
    } catch (error) {
      logger.error('Error initializing digital format', error);
    }
  }
  
  /**
   * Apply saved seconds display setting
   */
  function initShowSeconds() {
    try {
      if (elements.showSecondsToggle && state.showSeconds) {
        elements.showSecondsToggle.classList.add('active');
        elements.showSecondsToggle.setAttribute('aria-pressed', 'true');
      }
    } catch (error) {
      logger.error('Error initializing seconds display', error);
    }
  }
  
  /**
   * Set up tab navigation
   */
  function initTabNavigation() {
    try {
      elements.tabButtons.forEach(btn => {
        dom.onClick(btn, () => {
          const tabId = btn.getAttribute('aria-controls');
          if (tabId) setActiveTab(tabId);
        });
      });
    } catch (error) {
      logger.error('Error initializing tab navigation', error);
    }
  }
  
  /**
   * Set active tab and update UI
   */
  function setActiveTab(tabId) {
    try {
      // Update tabs
      elements.tabButtons.forEach(btn => {
        const controls = btn.getAttribute('aria-controls');
        const isActive = controls === tabId;
        dom.toggleClass(btn, 'active', isActive);
        dom.setAttr(btn, 'aria-selected', isActive.toString());
      });
      
      // Update panes
      elements.tabPanes.forEach(pane => {
        const isActive = pane.id === tabId;
        dom.toggleClass(pane, 'active', isActive);
      });
      
      // Save state
      state.activeTab = tabId;
      localStorage.setItem('activeTab', tabId);
      
      // Announce tab change for screen readers
      announceTabChange(tabId);
    } catch (error) {
      logger.error('Error setting active tab', error);
    }
  }
  
  /**
   * Announce tab change for screen readers
   */
  function announceTabChange(tabId) {
    const liveRegion = document.getElementById('a11y-announcer');
    if (!liveRegion) return;
    
    let tabName = '';
    elements.tabButtons.forEach(btn => {
      if (btn.getAttribute('aria-controls') === tabId) {
        tabName = btn.querySelector('span')?.textContent || '';
      }
    });
    
    liveRegion.textContent = `${tabName} tab selected`;
  }
  
  /**
   * Create ARIA announcements element for accessibility
   */
  function createAriaAnnouncements() {
    const announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
    
    // Add sr-only style if not already in CSS
    if (!document.querySelector('style#sr-only-style')) {
      const style = document.createElement('style');
      style.id = 'sr-only-style';
      style.textContent = `
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Check notification permission
   */
  async function checkNotificationPermission() {
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          state.timer.notificationEnabled = true;
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          state.timer.notificationEnabled = permission === 'granted';
        }
      }
    } catch (error) {
      logger.error('Error checking notification permission', error);
      state.timer.notificationEnabled = false;
    }
  }
  
  /**
   * Start the clocks and setup animation loops
   */
  function startClocks() {
    try {
      // Update initial clock display
      updateAnalogClock();
      updateDigitalClock();
      
      // Setup performance optimized animation loop
      if (window.requestAnimationFrame) {
        const updateAllClocks = (timestamp) => {
          updateAnalogClock();
          updateDigitalClock();
          requestAnimationFrame(updateAllClocks);
        };
        requestAnimationFrame(updateAllClocks);
      } else {
        // Fallback for browsers without requestAnimationFrame
        setInterval(() => {
          updateAnalogClock();
          updateDigitalClock();
        }, 1000);
      }
    } catch (error) {
      logger.error('Error starting clocks', error);
    }
  }
  
  /**
   * Update analog clock
   */
  function updateAnalogClock() {
    try {
      const now = new Date();
      
      // Update date and time display
      if (elements.dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dom.setText(elements.dateDisplay, now.toLocaleDateString(undefined, options));
      }
      
      if (elements.timeDisplay) {
        const timeOptions = { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: state.digitalFormat === '12h' 
        };
        dom.setText(elements.timeDisplay, now.toLocaleTimeString(undefined, timeOptions));
      }
      
      // Calculate hand rotations with smooth transitions
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      
      // Add milliseconds for smoother second hand (unless reduced motion is preferred)
      const secondDegrees = state.prefersReducedMotion ? 
        (seconds / 60) * 360 : 
        ((seconds + (milliseconds / 1000)) / 60) * 360;
      
      // Add seconds for smoother minute hand
      const minuteDegrees = ((minutes + (seconds / 60)) / 60) * 360;
      
      // Add minutes for smoother hour hand
      const hourDegrees = ((hours + (minutes / 60)) / 12) * 360;
      
      // Apply rotations using hardware-accelerated transforms
      if (elements.hourHand) elements.hourHand.style.transform = `rotate(${hourDegrees}deg)`;
      if (elements.minuteHand) elements.minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
      if (elements.secondHand) elements.secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    } catch (error) {
      logger.error('Error updating analog clock', error);
    }
  }
  
  /*** DIGITAL CLOCK ***/
  
  function updateDigitalClock() {
    const now = new Date();
    
    // Update date
    if (elements.digitalDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      elements.digitalDate.textContent = now.toLocaleDateString(undefined, options);
    }
    
    // Update time
    if (elements.digitalTime && elements.digitalSeconds) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      let displayHours = hours;
      let ampm = '';
      
      if (state.digitalFormat === '12h') {
        displayHours = hours % 12 || 12;
        ampm = hours < 12 ? ' AM' : ' PM';
      }
      
      elements.digitalTime.textContent = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${state.showSeconds ? '' : ampm}`;
      
      if (state.showSeconds) {
        elements.digitalSeconds.textContent = `${String(seconds).padStart(2, '0')}${ampm}`;
        elements.digitalSeconds.style.display = 'block';
      } else {
        elements.digitalSeconds.style.display = 'none';
      }
    }
  }
  
  if (elements.formatToggle) {
    elements.formatToggle.addEventListener('click', () => {
      elements.formatToggle.classList.toggle('active');
      state.digitalFormat = elements.formatToggle.classList.contains('active') ? '12h' : '24h';
      localStorage.setItem('digitalFormat', state.digitalFormat);
      updateDigitalClock();
    });
  }
  
  if (elements.showSecondsToggle) {
    elements.showSecondsToggle.addEventListener('click', () => {
      elements.showSecondsToggle.classList.toggle('active');
      state.showSeconds = elements.showSecondsToggle.classList.contains('active');
      localStorage.setItem('showSeconds', state.showSeconds);
      updateDigitalClock();
    });
  }
  
  /*** STOPWATCH ***/
  
  function formatStopwatchTime(ms) {
    const totalMs = ms % 1000;
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(totalMs / 10)).padStart(2, '0')}`;
  }
  
  function updateStopwatch() {
    if (!elements.stopwatchDisplay) return;
    
    const now = Date.now();
    const elapsed = now - state.stopwatch.startTime + state.stopwatch.elapsedTime;
    elements.stopwatchDisplay.textContent = formatStopwatchTime(elapsed);
  }
  
  function startStopwatch() {
    if (!elements.stopwatchStart || !elements.stopwatchLap || !elements.stopwatchReset) return;
    
    const stopwatchContainer = elements.stopwatchDisplay?.closest('.stopwatch');
    
    if (!state.stopwatch.running) {
      // Start stopwatch
      state.stopwatch.running = true;
      state.stopwatch.startTime = Date.now();
      state.stopwatch.intervalId = setInterval(updateStopwatch, 10);
      
      // Update UI
      elements.stopwatchStart.textContent = 'Stop';
      elements.stopwatchStart.classList.add('stop');
      elements.stopwatchLap.disabled = false;
      elements.stopwatchReset.disabled = true;
      if (stopwatchContainer) stopwatchContainer.classList.add('stopwatch-running');
    } else {
      // Stop stopwatch
      state.stopwatch.running = false;
      clearInterval(state.stopwatch.intervalId);
      state.stopwatch.elapsedTime += (Date.now() - state.stopwatch.startTime);
      
      // Update UI
      elements.stopwatchStart.textContent = 'Start';
      elements.stopwatchStart.classList.remove('stop');
      elements.stopwatchLap.disabled = true;
      elements.stopwatchReset.disabled = false;
      if (stopwatchContainer) stopwatchContainer.classList.remove('stopwatch-running');
    }
  }
  
  function resetStopwatch() {
    if (!elements.stopwatchDisplay || !elements.stopwatchStart || !elements.stopwatchLap || !elements.stopwatchReset) return;
    
    const stopwatchContainer = elements.stopwatchDisplay.closest('.stopwatch');
    
    // Reset state
    state.stopwatch.running = false;
    state.stopwatch.startTime = 0;
    state.stopwatch.elapsedTime = 0;
    state.stopwatch.lapTimes = [];
    state.stopwatch.lapCounter = 0;
    state.stopwatch.bestLapIndex = -1;
    state.stopwatch.worstLapIndex = -1;
    clearInterval(state.stopwatch.intervalId);
    
    // Update UI
    elements.stopwatchDisplay.textContent = '00:00:00.00';
    elements.lapList.innerHTML = '';
    elements.stopwatchStart.textContent = 'Start';
    elements.stopwatchStart.classList.remove('stop');
    elements.stopwatchLap.disabled = true;
    elements.stopwatchReset.disabled = true;
    if (stopwatchContainer) stopwatchContainer.classList.remove('stopwatch-running');
  }
  
  function recordLap() {
    if (!state.stopwatch.running || !elements.lapList) return;
    
    state.stopwatch.lapCounter++;
    const now = Date.now();
    const totalElapsed = now - state.stopwatch.startTime + state.stopwatch.elapsedTime;
    
    const previousLapTime = state.stopwatch.lapTimes.length > 0 
      ? state.stopwatch.lapTimes[state.stopwatch.lapTimes.length - 1].totalTime 
      : 0;
    
    const lapTime = totalElapsed - previousLapTime;
    
    const lap = {
      number: state.stopwatch.lapCounter,
      lapTime,
      totalTime: totalElapsed
    };
    
    state.stopwatch.lapTimes.push(lap);
    
    // Find best and worst laps (ignoring first lap)
    if (state.stopwatch.lapTimes.length > 1) {
      // Initialize if these are the first two laps
      if (state.stopwatch.bestLapIndex === -1) {
        state.stopwatch.bestLapIndex = 1;
        state.stopwatch.worstLapIndex = 1;
      } else {
        // Compare with existing best/worst
        const bestLapTime = state.stopwatch.lapTimes[state.stopwatch.bestLapIndex].lapTime;
        const worstLapTime = state.stopwatch.lapTimes[state.stopwatch.worstLapIndex].lapTime;
        
        if (lapTime < bestLapTime) {
          state.stopwatch.bestLapIndex = state.stopwatch.lapTimes.length - 1;
        }
        
        if (lapTime > worstLapTime) {
          state.stopwatch.worstLapIndex = state.stopwatch.lapTimes.length - 1;
        }
      }
    }
    
    // Update UI - regenerate all lap items to apply best/worst classes
    updateLapList();
  }
  
  function updateLapList() {
    if (!elements.lapList) return;
    
    elements.lapList.innerHTML = '';
    
    state.stopwatch.lapTimes.forEach((lap, index) => {
      const lapItem = document.createElement('div');
      lapItem.className = 'lap-item';
      
      // Add best/worst classes
      if (index === state.stopwatch.bestLapIndex) {
        lapItem.classList.add('best');
      }
      if (index === state.stopwatch.worstLapIndex) {
        lapItem.classList.add('worst');
      }
      
      lapItem.innerHTML = `
        <span class="lap-number">${lap.number}</span>
        <span class="lap-time">${formatStopwatchTime(lap.lapTime)}</span>
        <span class="lap-total">${formatStopwatchTime(lap.totalTime)}</span>
      `;
      
      elements.lapList.prepend(lapItem);
    });
  }
  
  if (elements.stopwatchStart) elements.stopwatchStart.addEventListener('click', startStopwatch);
  if (elements.stopwatchReset) elements.stopwatchReset.addEventListener('click', resetStopwatch);
  if (elements.stopwatchLap) elements.stopwatchLap.addEventListener('click', recordLap);
  
  /*** TIMER ***/
  
  function formatTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  function updateTimerDisplay() {
    if (!elements.timerDisplay || !elements.timerProgressBar) return;
    
    elements.timerDisplay.textContent = formatTimerDisplay(state.timer.remaining);
    
    // Update progress bar
    const progressPercentage = (state.timer.remaining / state.timer.originalDuration) * 100;
    elements.timerProgressBar.style.width = `${progressPercentage}%`;
    
    // Change color based on remaining time
    const timerContainer = elements.timerDisplay.closest('.timer');
    
    if (progressPercentage < 20) {
      elements.timerProgressBar.style.background = 'var(--accent-color)';
      if (timerContainer) timerContainer.classList.add('timer-ending');
    } else {
      elements.timerProgressBar.style.background = 'var(--primary-color)';
      if (timerContainer) timerContainer.classList.remove('timer-ending');
    }
  }
  
  function updateTimer() {
    if (state.timer.paused) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - state.timer.startTime) / 1000);
    state.timer.remaining = Math.max(0, state.timer.duration - elapsed);
    
    updateTimerDisplay();
    
    if (state.timer.remaining <= 0) {
      // Timer complete
      clearInterval(state.timer.intervalId);
      state.timer.running = false;
      state.timer.paused = false;
      
      playTimerCompleteSound();
      notifyTimerComplete();
      
      // Reset UI
      const timerContainer = elements.timerDisplay?.closest('.timer');
      if (elements.timerStart) elements.timerStart.textContent = 'Start';
      if (elements.timerStart) elements.timerStart.disabled = false;
      if (elements.timerPause) elements.timerPause.disabled = true;
      if (elements.timerReset) elements.timerReset.disabled = false;
      if (timerContainer) timerContainer.classList.remove('timer-running', 'timer-ending');
    }
  }
  
  function startTimer() {
    if (!elements.timerStart || !elements.timerPause || !elements.timerReset) return;
    
    if (!state.timer.running) {
      // Get timer duration
      const hours = parseInt(elements.hoursInput?.value) || 0;
      const minutes = parseInt(elements.minutesInput?.value) || 0;
      const seconds = parseInt(elements.secondsInput?.value) || 0;
      
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      if (totalSeconds <= 0) {
        alert('Please set a valid time');
        return;
      }
      
      // Set up timer
      state.timer.duration = totalSeconds;
      state.timer.remaining = totalSeconds;
      state.timer.originalDuration = totalSeconds;
      state.timer.startTime = Date.now();
      state.timer.running = true;
      state.timer.paused = false;
      
      // Start countdown
      state.timer.intervalId = setInterval(updateTimer, 1000);
      
      // Update UI
      elements.timerStart.textContent = 'Start New';
      elements.timerPause.textContent = 'Pause';
      elements.timerPause.disabled = false;
      elements.timerReset.disabled = false;
      
      const timerContainer = elements.timerDisplay?.closest('.timer');
      if (timerContainer) timerContainer.classList.add('timer-running');
      
      updateTimerDisplay();
    } else {
      // Start a new timer
      clearInterval(state.timer.intervalId);
      
      // Reset UI to input state
      elements.timerStart.textContent = 'Start';
      elements.timerPause.disabled = true;
      elements.timerReset.disabled = true;
      
      const timerContainer = elements.timerDisplay?.closest('.timer');
      if (timerContainer) timerContainer.classList.remove('timer-running', 'timer-ending');
      
      state.timer.running = false;
      state.timer.paused = false;
      state.timer.duration = 0;
      state.timer.remaining = 0;
      
      if (elements.timerDisplay) elements.timerDisplay.textContent = formatTimerDisplay(0);
      if (elements.timerProgressBar) elements.timerProgressBar.style.width = '0%';
    }
  }
  
  function pauseTimer() {
    if (!elements.timerPause) return;
    
    if (state.timer.running && !state.timer.paused) {
      // Pause timer
      clearInterval(state.timer.intervalId);
      state.timer.paused = true;
      
      // Calculate remaining time precisely
      const now = Date.now();
      const elapsed = Math.floor((now - state.timer.startTime) / 1000);
      state.timer.duration = Math.max(0, state.timer.duration - elapsed);
      
      // Update UI
      elements.timerPause.textContent = 'Resume';
    } else if (state.timer.running && state.timer.paused) {
      // Resume timer
      state.timer.startTime = Date.now();
      state.timer.paused = false;
      state.timer.intervalId = setInterval(updateTimer, 1000);
      
      // Update UI
      elements.timerPause.textContent = 'Pause';
    }
  }
  
  function resetTimer() {
    if (!elements.timerStart || !elements.timerPause || !elements.timerReset) return;
    
    // Reset state
    clearInterval(state.timer.intervalId);
    state.timer.running = false;
    state.timer.paused = false;
    state.timer.duration = 0;
    state.timer.remaining = 0;
    
    // Reset UI
    if (elements.hoursInput) elements.hoursInput.value = '0';
    if (elements.minutesInput) elements.minutesInput.value = '0';
    if (elements.secondsInput) elements.secondsInput.value = '0';
    if (elements.timerDisplay) elements.timerDisplay.textContent = '00:00:00';
    if (elements.timerProgressBar) elements.timerProgressBar.style.width = '0%';
    elements.timerStart.textContent = 'Start';
    elements.timerStart.disabled = false;
    elements.timerPause.disabled = true;
    elements.timerPause.textContent = 'Pause';
    elements.timerReset.disabled = true;
    
    const timerContainer = elements.timerDisplay?.closest('.timer');
    if (timerContainer) timerContainer.classList.remove('timer-running', 'timer-ending');
  }
  
  function setTimerPreset(hours, minutes, seconds) {
    if (!elements.hoursInput || !elements.minutesInput || !elements.secondsInput) return;
    
    elements.hoursInput.value = hours;
    elements.minutesInput.value = minutes;
    elements.secondsInput.value = seconds;
  }
  
  function playTimerCompleteSound() {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to play beep
    const playBeep = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      
      // Play pattern: on for 0.3s, off for 0.2s, repeat 3 times
      setTimeout(() => {
        oscillator.stop();
        setTimeout(() => {
          playBeep2();
        }, 200);
      }, 300);
    };
    
    const playBeep2 = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 1000;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        setTimeout(() => {
          playBeep3();
        }, 200);
      }, 300);
    };
    
    const playBeep3 = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 1200;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
      }, 500);
    };
    
    // Start the sequence
    playBeep();
  }
  
  function notifyTimerComplete() {
    // Check if browser supports notifications and we have permission
    if (state.timer.notificationEnabled) {
      new Notification('Timer Complete', {
        body: 'Your timer has finished!',
        icon: 'https://icons8.com/icon/12336/clock'
      });
    }
  }
  
  // Timer input controls - allow up/down arrow keys to change values
  function setupTimerInputs() {
    if (!elements.hoursInput || !elements.minutesInput || !elements.secondsInput) return;
    
    const inputs = [elements.hoursInput, elements.minutesInput, elements.secondsInput];
    
    inputs.forEach(input => {
      // Add spinner buttons
      const spinnerContainer = document.createElement('div');
      spinnerContainer.className = 'time-spinners';
      
      const upBtn = document.createElement('button');
      upBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      upBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 0;
        const max = parseInt(input.max);
        input.value = (currentValue + 1) % (max + 1);
      });
      
      const downBtn = document.createElement('button');
      downBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
      downBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 0;
        const max = parseInt(input.max);
        input.value = currentValue === 0 ? max : currentValue - 1;
      });
      
      spinnerContainer.appendChild(upBtn);
      spinnerContainer.appendChild(downBtn);
      
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(spinnerContainer);
      
      // Handle keyboard input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentValue = parseInt(input.value) || 0;
          const max = parseInt(input.max);
          input.value = (currentValue + 1) % (max + 1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentValue = parseInt(input.value) || 0;
          const max = parseInt(input.max);
          input.value = currentValue === 0 ? max : currentValue - 1;
        }
      });
    });
    
    // Add timer presets section
    const timerContainer = elements.timerDisplay?.closest('.timer');
    if (!timerContainer) return;
    
    const presetSection = document.createElement('div');
    presetSection.className = 'timer-presets';
    presetSection.innerHTML = `
      <button class="preset-btn" data-preset="5min">5 Min</button>
      <button class="preset-btn" data-preset="10min">10 Min</button>
      <button class="preset-btn" data-preset="15min">15 Min</button>
      <button class="preset-btn" data-preset="30min">30 Min</button>
      <button class="preset-btn" data-preset="1hr">1 Hour</button>
    `;
    
    // Insert after timer setup
    const timerSetup = timerContainer.querySelector('.timer-setup');
    if (timerSetup) {
      timerSetup.after(presetSection);
    }
    
    // Add event listeners to preset buttons
    presetSection.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        
        switch (preset) {
          case '5min':
            setTimerPreset(0, 5, 0);
            break;
          case '10min':
            setTimerPreset(0, 10, 0);
            break;
          case '15min':
            setTimerPreset(0, 15, 0);
            break;
          case '30min':
            setTimerPreset(0, 30, 0);
            break;
          case '1hr':
            setTimerPreset(1, 0, 0);
            break;
        }
      });
    });
  }
  
  // Add sound options for timer
  function setupTimerSoundOptions() {
    const timerContainer = elements.timerDisplay?.closest('.timer');
    if (!timerContainer) return;
    
    const soundSection = document.createElement('div');
    soundSection.className = 'timer-sound';
    soundSection.innerHTML = `
      <label for="sound-select">Alert Sound:</label>
      <select id="sound-select">
        <option value="beep" selected>Beep</option>
        <option value="chime">Chime</option>
        <option value="bell">Bell</option>
        <option value="none">None</option>
      </select>
    `;
    
    // Add after timer controls
    const timerControls = timerContainer.querySelector('.timer-controls');
    if (timerControls) {
      timerControls.after(soundSection);
    }
    
    // Add event listener
    const soundSelect = soundSection.querySelector('#sound-select');
    if (soundSelect) {
      soundSelect.value = state.timer.soundOption;
      
      soundSelect.addEventListener('change', () => {
        state.timer.soundOption = soundSelect.value;
        localStorage.setItem('timerSound', state.timer.soundOption);
      });
    }
  }
  
  // Keyboard shortcuts for tab navigation
  document.addEventListener('keydown', (e) => {
    // Alt + 1-4 for tabs
    if (e.altKey && e.key === '1') {
      setActiveTab('analog-clock');
    } else if (e.altKey && e.key === '2') {
      setActiveTab('digital-clock');
    } else if (e.altKey && e.key === '3') {
      setActiveTab('stopwatch');
    } else if (e.altKey && e.key === '4') {
      setActiveTab('timer');
    }
    
    // Keyboard shortcuts for stopwatch
    if (state.activeTab === 'stopwatch') {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        startStopwatch();
      } else if (e.key === 'l' || e.key === 'L') {
        if (state.stopwatch.running) {
          recordLap();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (!state.stopwatch.running) {
          resetStopwatch();
        }
      }
    }
    
    // Keyboard shortcuts for timer
    if (state.activeTab === 'timer') {
      if (e.key === 'Enter') {
        e.preventDefault();
        startTimer();
      } else if (e.key === ' ') {
        e.preventDefault();
        pauseTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        resetTimer();
      }
    }
  });
  
  /*** Initialize all clocks ***/
  
  // Update clocks initially and every frame for smooth animation
  updateAnalogClock();
  updateDigitalClock();
  
  function updateAllClocks() {
    updateAnalogClock();
    updateDigitalClock();
    requestAnimationFrame(updateAllClocks);
  }
  
  requestAnimationFrame(updateAllClocks);
  
  // Initialize timer input controls
  setupTimerInputs();
  setupTimerSoundOptions();
  
  // Update stopwatch display initially
  if (elements.stopwatchDisplay) {
    elements.stopwatchDisplay.textContent = '00:00:00.00';
  }
  
  // Update timer display initially
  if (elements.timerDisplay) {
    elements.timerDisplay.textContent = '00:00:00';
  }
  
  // Create message about keyboard shortcuts
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.textAlign = 'center';
    shortcutsInfo.style.marginTop = '1rem';
    shortcutsInfo.style.fontSize = '0.9rem';
    shortcutsInfo.style.color = 'var(--text-muted)';
    shortcutsInfo.innerHTML = `
      <p>Keyboard Shortcuts: Alt+1-4 for tabs | Space/Enter to start/stop | R to reset</p>
    `;
    appContainer.appendChild(shortcutsInfo);
  }
  
  // Initialize the application
  init();
});
