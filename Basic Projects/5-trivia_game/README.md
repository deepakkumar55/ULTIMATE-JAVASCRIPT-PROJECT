# BrainWave Trivia Game

## Overview

BrainWave Trivia is a feature-rich, interactive quiz application built with JavaScript, HTML, and CSS. Test your knowledge across various categories with this engaging trivia game that offers a seamless user experience and modern design.

![BrainWave Trivia Game](https://raw.githubusercontent.com/yourusername/trivia-game/main/screenshot.png)

## Features

### Core Gameplay
- **Multiple Categories**: Choose from a variety of categories including General Knowledge, Science, History, Geography, Entertainment, Sports, Technology, and Movies
- **Difficulty Levels**: Select easy, medium, hard, or mixed difficulty to customize your challenge
- **Timed Questions**: Answer against the clock with dynamic timers adjusted to question difficulty
- **Score Tracking**: Advanced scoring system that rewards quick answers and answer streaks
- **Game Statistics**: View detailed stats about your performance (accuracy, average time, best streak)

### Enhanced User Experience
- **Theme Switcher**: Toggle between light and dark modes to suit your preference
- **Sound Effects**: Audio feedback for correct/incorrect answers and victory celebrations
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Visual Feedback**: Animations and visual effects make the experience engaging
- **High Score System**: Your best scores are saved locally and displayed for each category

### Technical Features
- **No External APIs**: All questions are included locally for faster loading
- **Smooth Animations**: Polished transitions between questions and game states
- **Accessibility**: Built with accessibility in mind, including keyboard navigation and ARIA attributes
- **Performance Optimized**: Fast loading and efficient resource usage
- **Local Storage**: Game preferences and high scores persist between sessions

## How to Play

1. **Select Your Quiz Settings**:
   - Choose a category of questions
   - Select a difficulty level
   - Choose the number of questions (5, 10, 15, or 20)

2. **Answer Questions**:
   - Read each question carefully
   - Select an answer before the timer runs out
   - Get bonus points for quick answers and consecutive correct answers

3. **View Your Results**:
   - See your final score and detailed statistics
   - Check if you earned a medal based on your performance
   - Share your results with friends
   - Try to beat your high score!

## Setup

### Option 1: Direct Download
1. Clone or download this repository
2. Open `index.html` in your browser

### Option 2: Using a Local Server
For the best experience, especially on Chrome, run the game using a local server:

```bash
# Using Python
python -m http.server

# Using Node.js
npx serve
```

Then open `http://localhost:8000` or `http://localhost:3000` in your browser.

## Customization

Want to add your own questions? You can modify the `triviaDummyData` object in `script.js` to add more categories or questions.

## Technical Implementation

- **Vanilla JavaScript**: No frameworks needed, pure JavaScript for all functionality
- **CSS Animations**: Smooth transitions and feedback animations using CSS
- **LocalStorage API**: Persistent data storage for user preferences and high scores
- **Web Audio API**: Sound effects handling with volume control
- **Modern CSS**: Flexbox and Grid for responsive layouts
- **ES6+ Features**: Modern JavaScript features for cleaner code

## Credits

- Fonts: Google Fonts (Montserrat, Poppins, Roboto Mono)
- Icons: SVG Icons
- Sound Effects: Mixkit

## License

This project is open source and available under the [MIT License](LICENSE).
