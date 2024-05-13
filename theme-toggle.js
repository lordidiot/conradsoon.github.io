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

document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

//name spinner
const nameSpinner = document.getElementById("nameSpinner");

// Variables to track rotation and freewheeling effect
let rotationAngle = 0;
let isFreewheeling = false;
let freewheelVelocity = 0;
const damping = 0.9999; // Damping factor for velocity decay
const epsilon = 0.00001; // Threshold for stopping the rotation

// Add click event listener
nameSpinner.addEventListener("click", function () {
  if (!isFreewheeling) {
    // Single click, perform a normal spin
    rotationAngle += 360;
    this.style.transform = `rotate(${rotationAngle}deg)`;
  } else {
    // Freewheeling mode, add velocity
    freewheelVelocity += 180; // Adjust this value to control the added rotation speed
  }
});

// Update the rotation and freewheeling effect
function updateRotation() {
  if (isFreewheeling) {
    // Apply freewheeling effect
    rotationAngle += freewheelVelocity;
    nameSpinner.style.transform = `rotate(${rotationAngle}deg)`;

    freewheelVelocity *= damping;

    if (Math.abs(freewheelVelocity) < epsilon) {
      isFreewheeling = false;
      freewheelVelocity = 0;
    }
  }

  requestAnimationFrame(updateRotation);
}

updateRotation();

// Add event listener for freewheeling mode
let lastClickTime = 0;
const freewheelThreshold = 1000; // Threshold for entering freewheeling mode (in milliseconds)

nameSpinner.addEventListener("click", function () {
  const currentTime = new Date().getTime();
  const timeSinceLastClick = currentTime - lastClickTime;

  if (timeSinceLastClick < freewheelThreshold || isFreewheeling) {
    isFreewheeling = true;
  } else {
    isFreewheeling = false;
    freewheelVelocity = 0;
  }

  lastClickTime = currentTime;
});

// clown mode
const toggleStyleButton = document.getElementById("toggleStyle");
const body = document.body;
const youtubeVideoContainer = document.getElementById("youtubeVideoContainer");
let currentState = 0;
const maxStates = 5;
const clownEmojis = ["🤡", "🤪", "😜", "😂", "🥳"];
let player;

// Load the YouTube Embed API
function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Create the YouTube player
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubeVideoContainer", {
    height: "360",
    width: "640",
    videoId: "2XRXT8xZ62s", // Replace with the actual YouTube video ID
    events: {
      onReady: onPlayerReady,
    },
  });
}

// Autoplay the video when ready
function onPlayerReady(event) {
  if (currentState === 4) {
    event.target.playVideo();
  }
}
let originalContents = {};
let elementCounter = 0;

toggleStyleButton.addEventListener("click", function () {
  currentState = (currentState + 1) % maxStates;

  if (currentState === 0) {
    body.classList.remove("funStyle", "state2", "state3");
    body.style.backgroundColor = "";
    body.style.color = "";
    restoreOriginalContents();
    youtubeVideoContainer.style.display = "none";
    if (player) {
      player.stopVideo();
    }
  } else if (currentState === 1) {
    body.classList.add("funStyle");
  } else if (currentState === 2) {
    body.classList.add("state2");
    body.style.backgroundColor = "#ffccff";
    body.style.color = "#333";
  } else if (currentState === 3) {
    body.classList.add("state3");
    storeOriginalContents();
    document.querySelectorAll("p, li").forEach((el) => {
      randomCapsTextNodes(el);
    });
  } else if (currentState === 4) {
    if (confirm("engage clown mode? (this will play music)")) {
      youtubeVideoContainer.style.display = "block";
      if (player) {
        player.playVideo();
      }
    } else {
      currentState = 0; // If the user cancels, go back to State 0
    }
  }

  toggleStyleButton.textContent = clownEmojis[currentState];
});

function storeOriginalContents() {
  document.querySelectorAll("p, li").forEach((el) => {
    const elementId = `element-${elementCounter}`;
    el.setAttribute("data-element-id", elementId);
    originalContents[elementId] = el.innerHTML;
    elementCounter++;
  });
}

function restoreOriginalContents() {
  document.querySelectorAll("p, li").forEach((el) => {
    const elementId = el.getAttribute("data-element-id");
    if (elementId && originalContents.hasOwnProperty(elementId)) {
      el.innerHTML = originalContents[elementId];
    }
  });
  originalContents = {};
  elementCounter = 0;
}
function randomCaps(text) {
  return text
    .split("")
    .map((char) =>
      Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");
}

function randomCapsTextNodes(element) {
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = randomCaps(node.textContent);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      randomCapsTextNodes(node);
    }
  });
}

// Load the YouTube Embed API
loadYouTubeAPI();
