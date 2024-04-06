// Function to toggle theme
function toggleTheme() {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateButtonContent(newTheme);
}

function updateButtonContent(theme) {
  const toggleButton = document.getElementById("toggleTheme");
  if (theme === "dark") {
    toggleButton.textContent = "🌙"; // moon emoji for dark mode
  } else {
    toggleButton.textContent = "☀️"; // sun emoji for light mode
  }
}

// Check for stored theme preference
let storedTheme = localStorage.getItem("theme");

// Check for user's system preference
const userPrefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (storedTheme) {
  // Use stored theme if present
  document.documentElement.setAttribute("data-theme", storedTheme);
  updateButtonContent(storedTheme);
} else if (userPrefersDark) {
  // Otherwise fallback to system preference
  document.documentElement.setAttribute("data-theme", "dark");
  updateButtonContent("dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
  updateButtonContent("light");
}

// Attach event listener to toggle button
document.getElementById("toggleTheme").addEventListener("click", toggleTheme);
