# NeoCalc - Modern JavaScript Calculator

![NeoCalc Screenshot](screenshot.png)

## Description

NeoCalc is a sophisticated, modern calculator with an intuitive interface and advanced features. Built with HTML, CSS, and vanilla JavaScript, it showcases modern design principles while providing powerful functionality. This calculator goes beyond basic operations with a sleek UI, animations, and user-friendly features.

## Live Demo

Check out the live demo: [NeoCalc Demo](https://deepakkumar55.github.io/ULTIMATE-JAVASCRIPT-PROJECT/Basic%20Projects/2-calculator)

## Features

### Core Functionality
- **Basic Operations**: Addition, subtraction, multiplication, and division
- **Extended Operations**: Percentage calculations and sign toggling (±)
- **Error Handling**: Graceful handling of division by zero and other errors
- **Clear Functions**: Both AC (all clear) and DEL (delete last digit) functionality

### Advanced Features
- **Calculation History**: Track and revisit your previous calculations
- **Dark/Light Theme**: Toggle between themes for comfortable viewing in any environment
- **Responsive Design**: Perfect user experience on any device from mobile to desktop
- **Keyboard Support**: Use your keyboard for rapid calculations
- **Visual Feedback**: Subtle animations enhance the user experience
- **Local Storage**: Your calculation history and theme preference persist between sessions

### Design Features
- **Modern UI**: Clean, intuitive interface with a focus on usability
- **3D Effects**: Subtle shadows and hover effects create depth
- **Micro-interactions**: Responsive feedback for user actions
- **Accessibility**: High contrast and clear typography for better readability
- **Color Themes**: Carefully designed color schemes for both light and dark modes

## Technologies Used

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Advanced styling with custom properties, animations, and responsive design
- **JavaScript**: Modern ES6+ features with clean architecture
- **Font Awesome**: Icon library for visual elements
- **Google Fonts**: Custom typography with Poppins and Roboto Mono
- **LocalStorage API**: Client-side persistent storage

## Design Philosophy

NeoCalc was designed with these core principles:

1. **Beautiful Simplicity**: Clean interface with subtle depth and dimensionality
2. **Intuitive Interaction**: Natural user flow with visual and motion feedback
3. **Modern Aesthetics**: Contemporary design with attention to typography and color
4. **Responsive Adaptation**: Seamless experience across all device sizes
5. **Progressive Enhancement**: Core functionality works everywhere, with enhanced features where supported

## Setup

Follow these steps to set up and run the NeoCalc project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/deepakkumar55/ULTIMATE-JAVASCRIPT-PROJECT.git
   ```
   
2. **Navigate to the Project Directory**:
   ```bash
   cd ULTIMATE-JAVASCRIPT-PROJECT/Basic\ Projects/2-calculator
   ```

3. **Open `index.html` in Your Browser**:
   You can open the `index.html` file directly in your web browser by double-clicking on it or by using a live server extension in your code editor (like Live Server for VSCode).

4. **Customize the Application (Optional)**:
   - Modify the color scheme by updating CSS custom properties in the `:root` selector
   - Add additional calculator functions like square root, exponents, etc.
   - Extend the history functionality with export options

## Implementation Highlights

### CSS Architecture
The CSS uses modern practices with custom properties for theming:

```css
:root {
  --primary-color: #4361ee;
  --operator-color: #4361ee;
  /* Additional variables for consistent styling */
}
```

### JavaScript Architecture
The calculator uses a clean object-based architecture:

```javascript
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  // Additional properties for state management
};
```

## Docker Integration

NeoCalc includes Docker support for easy deployment and consistent environments:

```
# Steps to run the application with Docker
step 1: Pull the source code from repo.
step 2: Build the docker file with `docker build -t calculator .`
step 3: Run the container with `docker run -d -p 8080:80 --name calculator-app calculator:latest`
step 4: Access your app in browser at `http://localhost:8080`
```

## Contributing

We welcome contributions to enhance NeoCalc! Here's how you can contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Your Changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the Branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## Future Enhancements

- Scientific calculator mode with advanced functions
- Custom themes with color picker
- History export to CSV or PDF
- Memory functions (M+, M-, MR, MC)
- Currency conversion functionality
- Progressive Web App capabilities

## Get in Touch

If you have any questions or need assistance, feel free to open an issue on GitHub or contact us directly. Your feedback and contributions are highly appreciated!

---

Thank you for your interest in NeoCalc! Experience the perfect blend of form and function in a modern calculator.