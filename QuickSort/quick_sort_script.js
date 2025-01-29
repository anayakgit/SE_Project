let array = [];
let subarrayStack = [];
let correct = 0;
let incorrect = 0;

function initializeGame() {
  // Generate a random array
  array = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);

  // Initialize the stack with the full array range
  subarrayStack = [{ left: 0, right: array.length - 1 }];

  correct = 0;
  incorrect = 0;

  renderArray();
  askQuestion();
  updateScore();

  // Reset feedback and disable Next button initially
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").disabled = true;
}

function renderArray() {
  const barContainer = document.getElementById("bar-container");
  barContainer.innerHTML = "";
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value}px`;
    bar.textContent = value;

    // Highlight active or sorted sections
    if (
      subarrayStack.some(({ left, right }) => index >= left && index <= right)
    ) {
      bar.classList.add("active");
    } else {
      bar.classList.add("sorted");
    }
    barContainer.appendChild(bar);
  });
}

function askQuestion() {
  if (subarrayStack.length === 0) {
    if (isArraySorted()) {
      document.getElementById("question-text").textContent =
        "Array is sorted! Great job!";
    } else {
      document.getElementById("question-text").textContent =
        "Sorting complete, but something went wrong!";
    }
    document.getElementById("options-container").innerHTML = "";
    return;
  }

  const { left, right } = subarrayStack[subarrayStack.length - 1];
  const pivotIndex = right;
  const pivotValue = array[pivotIndex];

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  array.slice(left, right + 1).forEach((value) => {
    const button = document.createElement("button");
    button.textContent = value;
    button.onclick = () => handleAnswer(value, pivotValue);
    optionsContainer.appendChild(button);
  });

  document.getElementById(
    "question-text"
  ).textContent = `What is the pivot value for the current subarray?`;
}

function handleAnswer(selectedValue, pivotValue) {
  const feedback = document.getElementById("feedback");

  if (selectedValue === pivotValue) {
    feedback.textContent = "Correct!";
    feedback.style.color = "white";
    correct++;
    partition();
  } else {
    feedback.textContent = `Incorrect! The correct pivot is ${pivotValue}`;
    feedback.style.color = "red";
    incorrect++;
  }

  document.getElementById("next-button").disabled = false; // Enable Next button
  updateScore();
}

function partition() {
  const { left, right } = subarrayStack.pop();
  const pivotValue = array[right];
  let partitionIndex = left;

  for (let i = left; i < right; i++) {
    if (array[i] < pivotValue) {
      [array[i], array[partitionIndex]] = [array[partitionIndex], array[i]];
      partitionIndex++;
    }
  }

  [array[partitionIndex], array[right]] = [array[right], array[partitionIndex]];

  // Push left and right subarrays onto the stack
  if (partitionIndex - 1 > left) {
    subarrayStack.push({ left, right: partitionIndex - 1 });
  }
  if (partitionIndex + 1 < right) {
    subarrayStack.push({ left: partitionIndex + 1, right });
  }

  renderArray();
}

function updateScore() {
  document.getElementById("correct-counter").textContent = correct;
  document.getElementById("incorrect-counter").textContent = incorrect;
}

function isArraySorted() {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) return false;
  }
  return true;
}

// Add event listener for the Next button
document.getElementById("next-button").onclick = () => {
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").disabled = true; // Disable Next button after it's clicked
  askQuestion();
};

// Add event listener for the Reset button
document.getElementById("reset-button").onclick = () => {
  initializeGame(); // Reset the game
};

// Initialize the game when the page loads
initializeGame();

// Function to send the score to the backend
function submitScore(score) {
  fetch("http://localhost:3000/top-scores/quick-sort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Score submitted:", data))
    .catch((error) => console.error("Error submitting score:", error));
}

// Handle "View Top Scores" button click
document.getElementById("view-scores-btn").addEventListener("click", () => {
  fetch("http://localhost:3000/top-scores/quick-sort")
    .then((response) => response.text())
    .then((data) => {
      // Display the EJS page content (you can modify this to show a modal or page)
      const win = window.open();
      win.document.write(data);
    })
    .catch((error) => console.error("Error fetching top scores:", error));
});
