# Calculator

## Description

This is a simple and user-friendly calculator project designed to perform basic arithmetic operations. The calculator supports addition, subtraction, multiplication, and division. It's an excellent project for beginners to learn and practice JavaScript, HTML, and CSS.

## Features

- **Addition**: Perform addition of two or more numbers.
- **Subtraction**: Subtract one number from another.
- **Multiplication**: Multiply two or more numbers.
- **Division**: Divide one number by another.
- **Clear Function**: Reset the calculator to its initial state.
- **Responsive Design**: Adapts to different screen sizes for better usability.

## Technologies Used

- **JavaScript**: The core logic of the calculator.
- **HTML**: Structure of the calculator interface.
- **CSS**: Styling for the calculator to ensure a clean and modern look.

## Setup

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/deepakkumar55/ULTIMATE-JAVASCRIPT-PROJECT.git
   ```
   
2. **Navigate to the project directory**:
   ```bash
   cd Basic Projects/2-calculator
   ```

3. **Open `index.html` in your web browser**:
   You can open the `index.html` file directly in your web browser by double-clicking on it or by using a live server extension in your code editor (like Live Server for VSCode).

## Contribute

We welcome contributions to enhance the functionality and design of the calculator. Follow these steps to contribute:

1. **Fork the repository**: Click on the 'Fork' button at the top right corner of the repository page.

2. **Clone the forked repository**:
   ```bash
   git clone https://github.com/deepakkumar55/ULTIMATE-JAVASCRIPT-PROJECT.git
   ```

3. **Create a new branch**: Make sure your fork is up-to-date with the latest changes.
   ```bash
   git checkout -b feature-yourfeature
   ```

4. **Make your changes**: Implement your new feature or bug fix.

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

6. **Push to your branch**:
   ```bash
   git push origin feature-yourfeature
   ```

7. **Open a Pull Request**: Navigate to the original repository and open a pull request from your forked repository. Provide a detailed description of your changes and any relevant information.

## Get in Touch

If you have any questions or need further assistance, feel free to open an issue on GitHub or contact us directly. Your contributions and feedback are highly appreciated!

---

Thank you for your interest in the project. Together, we can build a more robust and feature-rich application. Happy coding!



## Docker 

- I have added Dockerfile which will help to run the calculator app inside container.

```
Steps to run the application
step 1:- pull the source code form repo.
step 2:- Build the docker file with `docker build -t calculator .`
Step 3:- Run the container with `docker run -d -p 8080:80 --name calculator-app calculator:latest`
Step 4:- check your app in browser with `http:localhost:8080`.
```