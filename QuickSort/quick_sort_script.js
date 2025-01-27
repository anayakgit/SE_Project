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
}

function renderArray() {
  const barContainer = document.getElementById("bar-container");
  barContainer.innerHTML = "";
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value}px`;
    bar.textContent = value;

    // Highlight sorted sections
    if (subarrayStack.some(({ left, right }) => index >= left && index <= right)) {
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
      document.getElementById("question-text").textContent = "Array is sorted! Great job!";
    } else {
      document.getElementById("question-text").textContent = "Sorting complete, but something went wrong!";
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

  document.getElementById("question-text").textContent = `What is the pivot value for the current subarray?`;
}

function handleAnswer(selectedValue, pivotValue) {
  const feedback = document.getElementById("feedback");

  if (selectedValue === pivotValue) {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
    correct++;
    partition();
  } else {
    feedback.textContent = `Incorrect! The correct pivot is ${pivotValue}`;
    feedback.style.color = "red";
    incorrect++;
  }

  document.getElementById("next-button").disabled = false;
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
  document.getElementById("score-text").textContent = `Correct: ${correct} | Incorrect: ${incorrect}`;
}

function isArraySorted() {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) return false;
  }
  return true;
}

document.getElementById("next-button").onclick = () => {
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").disabled = true;
  askQuestion();
};

// Initialize the game when the page loads
initializeGame();
