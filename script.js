let array = [];  
let steps = [];  
let currentStepIndex = -1;  
let sorting = false;  

// Generate a new random array  
function generateArray() {  
    const size = parseInt(document.getElementById('sizeSlider').value);  
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);  
    steps = [];  
    currentStepIndex = -1;  
    sorting = false;  
    updateDisplay();  
    enableControls(true);  
    updateStatus('Generate an array and click "Start Sorting" to begin.');  
}  

// Update the visual display  
function updateDisplay() {  
    document.getElementById('arrayDisplay').textContent = `[${array.join(', ')}]`;  
    
    const container = document.getElementById('barsContainer');  
    container.innerHTML = '';  
    
    array.forEach((value, index) => {  
        const bar = document.createElement('div');  
        bar.className = 'bar';  
        bar.style.height = `${value * 2}px`;  
        
        const valueLabel = document.createElement('span');  
        valueLabel.className = 'bar-value';  
        valueLabel.textContent = value;  
        
        bar.appendChild(valueLabel);  
        container.appendChild(bar);  
    });  
}  

// Generate steps for quicksort  
function generateQuickSortSteps(arr, start = 0, end = arr.length - 1, steps = []) {  
    if (start >= end) return;  

    const pivot = arr[end];  
    let i = start - 1;  

    steps.push({  
        type: 'pivot',  
        message: `Selected <span class="highlight">${pivot}</span> as pivot element (in dark gray).`,  
        pivotIndex: end,  
        array: [...arr]  
    });  

    for (let j = start; j < end; j++) {  
        steps.push({  
            type: 'compare',  
            message: `Comparing element <span class="highlight">${arr[j]}</span> with pivot <span class="highlight">${pivot}</span>`,  
            compareIndex: j,  
            pivotIndex: end,  
            array: [...arr]  
        });  

        if (arr[j] < pivot) {  
            i++;  
            steps.push({  
                type: 'swap',  
                message: `${arr[j]} is smaller than pivot ${pivot}. Swapping elements at positions ${i} and ${j}.`,  
                swap: [i, j],  
                pivotIndex: end,  
                array: [...arr]  
            });  
            [arr[i], arr[j]] = [arr[j], arr[i]];  
        }  
    }  

    steps.push({  
        type: 'placePivot',  
        message: `Moving pivot ${pivot} to its final position at index ${i + 1}`,  
        swap: [i + 1, end],  
        pivotIndex: end,  
        array: [...arr]  
    });  

    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];  

    generateQuickSortSteps(arr, start, i, steps);  
    generateQuickSortSteps(arr, i + 2, end, steps);  

    return steps;  
}  

// Enable/disable controls  
function enableControls(enabled) {  
    document.getElementById('generateBtn').disabled = !enabled;  
    document.getElementById('startBtn').disabled = !enabled;  
    document.getElementById('nextBtn').disabled = !enabled;  
    document.getElementById('sizeSlider').disabled = !enabled;  
}  

// Update status message  
function updateStatus(message) {  
    document.getElementById('currentStep').innerHTML = message;  
}  

// Apply visual state based on current step  
function applyStep(step) {  
    array = [...step.array];  
    updateDisplay();  
    
    const bars = document.querySelectorAll('.bar');  
    bars.forEach(bar => bar.className = 'bar');  

    if (step.pivotIndex !== undefined) {  
        bars[step.pivotIndex].classList.add('pivot');  
    }  
    
    if (step.compareIndex !== undefined) {  
        bars[step.compareIndex].classList.add('active');  
    }  
    
    if (step.swap) {  
        bars[step.swap[0]].classList.add('active');  
        bars[step.swap[1]].classList.add('active');  
    }  

    updateStatus(step.message);  
}  

// Handle start button click  
function handleStart() {  
    steps = generateQuickSortSteps([...array]);  
    currentStepIndex = -1;  
    sorting = true;  
    document.getElementById('startBtn').disabled = true;  
    document.getElementById('generateBtn').disabled = true;  
    document.getElementById('nextBtn').disabled = false;  
    document.getElementById('sizeSlider').disabled = true;  
    updateStatus('Click "Next Step" to begin sorting.');  
}  

// Handle next step button click  
function handleNextStep() {  
    if (currentStepIndex < steps.length - 1) {  
        currentStepIndex++;  
        applyStep(steps[currentStepIndex]);  
    } else {  
        updateStatus('Sorting complete! Generate a new array to start over.');  
        document.getElementById('nextBtn').disabled = true;  
        document.getElementById('generateBtn').disabled = false;  

        // Mark all bars as sorted  
        const bars = document.querySelectorAll('.bar');  
        bars.forEach(bar => bar.classList.add('sorted'));  
    }  
}  

// Event listeners  
document.getElementById('generateBtn').addEventListener('click', generateArray);  
document.getElementById('startBtn').addEventListener('click', handleStart);  
document.getElementById('nextBtn').addEventListener('click', handleNextStep);  
document.getElementById('sizeSlider').addEventListener('input', function() {  
    document.getElementById('sizeValue').textContent = this.value;  
    generateArray();  
});  

// Initialize  
generateArray();