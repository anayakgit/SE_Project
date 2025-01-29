const barContainer = document.getElementById("bar-container");
const switchBtn = document.getElementById("switch-btn");
const dontSwitchBtn = document.getElementById("dont-switch-btn");
const resetBtn = document.getElementById("reset-btn");
const feedback = document.getElementById("feedback");
const rightCounter = document.getElementById("right-counter");
const wrongCounter = document.getElementById("wrong-counter");
const viewScoresBtn = document.getElementById("view-scores-btn");

let bars = [];
let array = [];
let i = 0,
  j = 0;
let rightAnswers = 0;
let wrongAnswers = 0;

// Generate random bars
function generateBars() {
  barContainer.innerHTML = "";
  bars = [];
  array = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1);
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.style.height = `${value * 2}px`;
    bar.classList.add("bar");
    bar.textContent = value;
    barContainer.appendChild(bar);
    bars.push(bar);
  });
}

// Highlight bars for comparison
function highlightBars() {
  if (j < array.length - i - 1) {
    bars[j].classList.add("highlight");
    bars[j + 1].classList.add("highlight");
  }
}

// Remove bar highlights
function removeHighlights() {
  bars.forEach((bar) => bar.classList.remove("highlight"));
}

// Update counters
function updateCounters(isCorrect) {
  if (isCorrect) {
    rightAnswers++;
    rightCounter.textContent = rightAnswers;
  } else {
    wrongAnswers++;
    wrongCounter.textContent = wrongAnswers;
  }
}

// Validate user's choice
function validateChoice(switchChoice) {
  const shouldSwitch = array[j] > array[j + 1];
  if (switchChoice === shouldSwitch) {
    feedback.textContent = "Good job! That's the correct choice.";
    feedback.style.color = "#FFFFFF";
    updateCounters(true);
  } else {
    feedback.textContent = shouldSwitch
      ? "Wrong! You should have switched. Performing the switch anyway."
      : "Wrong! You shouldn't switch. Moving to the next step.";
    feedback.style.color = "#e53935";
    updateCounters(false);
  }

  // Perform the switch if necessary
  if (array[j] > array[j + 1]) {
    [array[j], array[j + 1]] = [array[j + 1], array[j]];
    bars[j].style.height = `${array[j] * 2}px`;
    bars[j].textContent = array[j];
    bars[j + 1].style.height = `${array[j + 1] * 2}px`;
    bars[j + 1].textContent = array[j + 1];
  }

  // Move to the next comparison
  removeHighlights();
  j++;
  if (j >= array.length - i - 1) {
    j = 0;
    i++;
  }

  if (i >= array.length - 1) {
    feedback.textContent = "Sorting complete! Well done!";
    feedback.style.color = "#208cdc";
    switchBtn.disabled = true;
    dontSwitchBtn.disabled = true;

    // Submit score to the backend
    submitScore(rightAnswers);
  } else {
    highlightBars();
  }
}

// Function to send score to backend
function submitScore(score) {
  fetch("http://localhost:3000/top-scores/bubble-sort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Score submitted:", data))
    .catch((error) => console.error("Error submitting score:", error));
}

// Reset the game
function resetGame() {
  i = 0;
  j = 0;
  rightAnswers = 0;
  wrongAnswers = 0;
  rightCounter.textContent = 0;
  wrongCounter.textContent = 0;
  feedback.textContent = "";
  switchBtn.disabled = false;
  dontSwitchBtn.disabled = false;
  generateBars();
  highlightBars();
}

// Event listeners
switchBtn.addEventListener("click", () => validateChoice(true));
dontSwitchBtn.addEventListener("click", () => validateChoice(false));
resetBtn.addEventListener("click", resetGame);

// Handle "View Top Scores" button click
viewScoresBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/top-scores/bubble-sort")
    .then((response) => response.text())
    .then((data) => {
      // Display the EJS page content (you can modify this to show a modal or page)
      const win = window.open();
      win.document.write(data);
    })
    .catch((error) => console.error("Error fetching top scores:", error));
});

// Initialize game
generateBars();
highlightBars();
