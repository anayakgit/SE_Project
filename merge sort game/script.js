const barContainer = document.getElementById("bar-container");
const nextBtn = document.getElementById("next-button");
const resetBtn = document.getElementById("reset-button");
const feedback = document.getElementById("feedback");
const correctCounter = document.getElementById("correct-counter");
const incorrectCounter = document.getElementById("incorrect-counter");
const viewScoresBtn = document.getElementById("view-scores-btn");

let steps = [];
let currentStepIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentArray = [];

// Generate a random array of unique numbers
function generateRandomArray(size, min, max) {
  const numbers = new Set();
  while (numbers.size < size) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
}

// Generate the steps for merge sort
function generateSteps(array) {
  const steps = [];
  let groups = array.map((n) => [n]);

  while (groups.length > 1) {
    const newGroups = [];
    for (let i = 0; i < groups.length; i += 2) {
      if (i + 1 < groups.length) {
        steps.push({
          group1: groups[i],
          group2: groups[i + 1],
        });
        newGroups.push([...groups[i], ...groups[i + 1]].sort((a, b) => a - b));
      } else {
        newGroups.push(groups[i]);
      }
    }
    groups = newGroups;
  }

  return steps;
}

// Render the chart for the current array
function renderChart(array, highlight = []) {
  barContainer.innerHTML = "";
  array.forEach((num) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${num * 20}px`;
    bar.textContent = num;
    if (highlight.includes(num)) bar.classList.add("highlight");
    barContainer.appendChild(bar);
  });
}

// Render the options for the current step
function renderOptions(options) {
  optionsContainer.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = option;
    button.onclick = () => handleAnswer(option);
    optionsContainer.appendChild(button);
  });
}

// Render the current step
function renderStep() {
  const step = steps[currentStepIndex];
  renderChart(currentArray, [...step.group1, ...step.group2]);
  feedback.textContent = `Compare the elements: ${step.group1} and ${step.group2}. Select the smallest.`;
  renderOptions([...step.group1, ...step.group2]);
}

// Handle the answer
function handleAnswer(selected) {
  const step = steps[currentStepIndex];
  const correct = Math.min(...[...step.group1, ...step.group2]);

  if (selected === correct) {
    feedback.textContent = "Correct! Well done.";
    feedback.style.color = "#FFFFFF";
    correctAnswers++;
  } else {
    feedback.textContent = `Wrong! The correct answer was ${correct}.`;
    feedback.style.color = "#e53935";
    incorrectAnswers++;
  }

  // Update array with merged groups
  currentArray = currentArray.map((n) =>
    step.group1.includes(n) || step.group2.includes(n) ? null : n
  );
  currentArray = currentArray.filter((n) => n !== null);
  currentArray.push(...[...step.group1, ...step.group2].sort((a, b) => a - b));

  correctCounter.textContent = correctAnswers;
  incorrectCounter.textContent = incorrectAnswers;
  nextBtn.disabled = false;
}

// Handle the next step
function moveToNextStep() {
  currentStepIndex++;
  if (currentStepIndex < steps.length) {
    renderStep();
  } else {
    feedback.textContent = "Great job! The array is now sorted!";
    feedback.style.color = "#208cdc";
    renderChart(currentArray.sort((a, b) => a - b));

    // Submit score to backend
    submitScore(correctAnswers);
  }
  nextBtn.disabled = true;
}

// Reset the game
function resetGame() {
  const newArray = generateRandomArray(8, 1, 14);
  currentArray = [...newArray];
  steps = generateSteps(newArray);
  currentStepIndex = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;

  correctCounter.textContent = correctAnswers;
  incorrectCounter.textContent = incorrectAnswers;
  feedback.textContent = "";
  nextBtn.disabled = true;
  renderChart(currentArray);
  renderStep();
}

// Submit the score to the backend
function submitScore(score) {
  fetch("http://localhost:3000/top-scores/merge-sort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Score submitted:", data))
    .catch((error) => console.error("Error submitting score:", error));
}

// View the top scores
function viewTopScores() {
  fetch("http://localhost:3000/top-scores/merge-sort")
    .then((response) => response.text())
    .then((data) => {
      const win = window.open();
      win.document.write(data);
    })
    .catch((error) => console.error("Error fetching top scores:", error));
}

// Event Listeners
nextBtn.addEventListener("click", moveToNextStep);
resetBtn.addEventListener("click", resetGame);
viewScoresBtn.addEventListener("click", viewTopScores);

// Initialize the game
const array = generateRandomArray(8, 1, 14);
currentArray = [...array];
steps = generateSteps(currentArray);
renderStep();
