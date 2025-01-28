let text = '';  
let pattern = '';  
let currentStep = 0;  
let totalSteps = 0;  
let steps = [];  
let badCharTable = {};  

function initialize() {  
    text = document.getElementById('searchText').value;  
    pattern = document.getElementById('pattern').value;  
    currentStep = 0;  
    generateSteps();  
    updateVisualization();  
    updateControls();  
}  

function generateBadCharTable() {  
    badCharTable = {};  
    for (let i = 0; i < pattern.length - 1; i++) {  
        badCharTable[pattern[i]] = pattern.length - 1 - i;  
    }  
}  

function generateSteps() {  
    steps = [];  
    generateBadCharTable();  
    generateHorspoolSteps();  
    totalSteps = steps.length;  
    document.getElementById('progressSlider').max = totalSteps - 1;  
}  

function generateHorspoolSteps() {  
    let i = pattern.length - 1;  

    while (i < text.length) {  
        let step = {  
            position: i,  
            comparisons: [],  
            matches: [],  
            explanation: ''  
        };  

        let j;  
        for (j = pattern.length - 1; j >= 0; j--) {  
            const textIndex = i - (pattern.length - 1 - j);  
            step.comparisons.push(textIndex);  
            
            if (text[textIndex] === pattern[j]) {  
                step.matches.push(textIndex);  
                step.explanation += `Found match: '${pattern[j]}' equals '${text[textIndex]}' at position ${textIndex}. `;  
                
                if (j > 0) {  
                    step.explanation += `Moving left to compare next character. \n`;  
                }  
                
                if (j < pattern.length - 1) {  
                    steps.push({...step});  
                }  
            } else {  
                const shift = badCharTable[text[textIndex]] || pattern.length;  
                step.explanation = `Comparison failed: '${text[textIndex]}' does not match '${pattern[j]}' at position ${textIndex}. `;  
                step.explanation += `Based on bad character rule, shifting pattern by ${shift} positions. `;  
                steps.push({...step});  
                i += shift;  
                break;  
            }  
        }  

        if (j < 0) {  
            step.explanation = `Success! Complete pattern '${pattern}' found at position ${i - pattern.length + 1}. `;  
            step.explanation += `All ${pattern.length} characters matched: `;  
            for (let k = 0; k < pattern.length; k++) {  
                const pos = i - pattern.length + 1 + k;  
                step.explanation += `'${text[pos]}' `;  
            }  
            steps.push({...step});  
            break;  
        }  
    }  

    if (steps.length === 0 || !steps[steps.length - 1].explanation.includes('Success')) {  
        steps.push({  
            position: -1,  
            comparisons: [],  
            matches: [],  
            explanation: `No match found for pattern '${pattern}' in the text after checking all possible positions.`  
        });  
    }  
}  

function updateVisualization() {  
    const visualization = document.getElementById('visualization');  
    let html = '';  

    // Index row  
    html += '<div class="index-row">';  
    for (let i = 0; i < text.length; i++) {  
        html += `<span class="character">${i}</span>`;  
    }  
    html += '</div>';  

    // Text row  
    html += '<div class="text-row">';  
    for (let i = 0; i < text.length; i++) {  
        let classes = ['character'];  
        if (currentStep < steps.length) {  
            if (steps[currentStep].matches.includes(i)) {  
                classes.push('match');  
            }  
            if (steps[currentStep].comparisons.includes(i)) {  
                classes.push('current');  
            }  
        }  
        html += `<span class="${classes.join(' ')}">${text[i]}</span>`;  
    }  
    html += '</div>';  

    // Pattern row  
    html += '<div class="pattern-row">';  
    if (currentStep < steps.length) {  
        const pos = steps[currentStep].position;  
        const offset = pos - (pattern.length - 1);  
        for (let i = 0; i < text.length; i++) {  
            if (i >= offset && i < offset + pattern.length) {  
                html += `<span class="character">${pattern[i - offset]}</span>`;  
            } else {  
                html += '<span class="character"> </span>';  
            }  
        }  
    }  
    html += '</div>';  

    visualization.innerHTML = html;  
    document.getElementById('explanation').innerText = steps[currentStep]?.explanation || '';  
    updateStateTable();  
}  

function updateStateTable() {  
    const stateTable = document.getElementById('stateTable');  
    let html = '<table class="state-table">';  
    html += '<tr><th>Character</th><th>Shift</th></tr>';  

    for (const [char, shift] of Object.entries(badCharTable)) {  
        html += `<tr><td>${char}</td><td>${shift}</td></tr>`;  
    }  
    html += `<tr><td>*</td><td>${pattern.length}</td></tr>`;  

    html += '</table>';  
    stateTable.innerHTML = html;  
}  

function updateControls() {  
    document.getElementById('prevBtn').disabled = currentStep <= 0;  
    document.getElementById('nextBtn').disabled = currentStep >= totalSteps - 1;  
    document.getElementById('progressSlider').value = currentStep;  
}  

function previousStep() {  
    if (currentStep > 0) {  
        currentStep--;  
        updateVisualization();  
        updateControls();  
    }  
}  

function nextStep() {  
    if (currentStep < totalSteps - 1) {  
        currentStep++;  
        updateVisualization();  
        updateControls();  
    }  
}  

function toggleStateTable() {  
    const stateTable = document.getElementById('stateTable');  
    const btn = document.getElementById('toggleTableBtn');  
    if (stateTable.style.display === 'none') {  
        stateTable.style.display = 'block';  
        btn.textContent = 'Hide state table';  
    } else {  
        stateTable.style.display = 'none';  
        btn.textContent = 'Show state table';  
    }  
}  

// Event listeners  
document.getElementById('searchText').addEventListener('input', initialize);  
document.getElementById('pattern').addEventListener('input', initialize);  
document.getElementById('algorithm').addEventListener('change', initialize);  
document.getElementById('progressSlider').addEventListener('input', function() {  
    currentStep = parseInt(this.value);  
    updateVisualization();  
    updateControls();  
});  

// Initialize on page load  
initialize();