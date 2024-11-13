// GSAP Animations for Step Cards

gsap.from("#step1", { opacity: 0, x: -200, duration: 1 });
gsap.from("#step2", { opacity: 0, x: -200, duration: 1, delay: 0.2 });
gsap.from("#step3", { opacity: 0, x: -200, duration: 1, delay: 0.4 });
gsap.from("#step4", { opacity: 0, x: -200, duration: 1, delay: 0.6 });
gsap.from("#step5", { opacity: 0, x: -200, duration: 1, delay: 0.8 });

// Dark Mode Toggle
const darkModeButton = document.getElementById("darkModeToggle");
const body = document.body;

darkModeButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  darkModeButton.textContent = body.classList.contains("dark-mode") ? "🌞" : "🌙";
});

// Simulate a progress bar animation
let progress = 0;
const progressBar = document.getElementById("progressBar");

const progressInterval = setInterval(() => {
  progress += 10;
  progressBar.style.width = `${progress}%`;
  if (progress === 100) {
    clearInterval(progressInterval);
  }
}, 500);

// Copy Command to Clipboard
function copyCommand(command) {
  navigator.clipboard.writeText(command).then(() => {
    alert('Command copied to clipboard!');
  });
}
