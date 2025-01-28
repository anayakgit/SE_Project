// Generate a random array of unique numbers
// Generate a random array of unique numbers
function generateRandomArray(size, min, max) {
  const numbers = new Set();
  while (numbers.size < size) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
}

// Generate the initial random array with a maximum value of 14
const array = generateRandomArray(8, 1, 14); // Array of 8 random numbers between 1 and 14
let currentArray = [...array];
let steps = [];
let currentStepIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// DOM Elements
const barContainer = document.getElementById("bar-container");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const correctCounter = document.getElementById("correct-counter");
const incorrectCounter = document.getElementById("incorrect-counter");
const resetButton = document.getElementById("reset-button"); // Add this line

// Generate merge steps
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

// Render the current step
function renderStep() {
  const step = steps[currentStepIndex];
  renderChart(currentArray, [...step.group1, ...step.group2]);
  questionText.textContent = `Compare the elements: ${step.group1} and ${step.group2}. Select the smallest.`;
  renderOptions([...step.group1, ...step.group2]);
}

// Render the bar chart
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

// Render the options
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
  nextButton.disabled = false;
}

// Handle the next step
nextButton.onclick = () => {
  currentStepIndex++;
  if (currentStepIndex < steps.length) {
    renderStep();
  } else {
    feedback.textContent = "Great job! The array is now sorted!";
    feedback.style.color = "#208cdc";
    renderChart(array.sort((a, b) => a - b));
  }
  nextButton.disabled = true;
};

// Initialize the game
steps = generateSteps(array);
renderStep();

// Handle Reset Button
resetButton.onclick = () => {
  // Generate a new random array with numbers between 1 and 14
  const newArray = generateRandomArray(8, 1, 14);

  // Reset the original array and regenerate the game state
  currentArray = [...newArray]; // New current array
  steps = generateSteps(newArray); // Regenerate steps
  currentStepIndex = 0; // Reset step index
  correctAnswers = 0; // Reset score
  incorrectAnswers = 0;

  // Reset DOM elements
  correctCounter.textContent = correctAnswers; // Reset counters
  incorrectCounter.textContent = incorrectAnswers;
  feedback.textContent = ""; // Clear feedback
  nextButton.disabled = true; // Disable the next button

  // Render the new state
  renderChart(currentArray); // Render the new array chart
  renderStep(); // Start from the first step
};


