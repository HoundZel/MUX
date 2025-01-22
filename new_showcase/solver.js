//initialise the page
document.addEventListener('DOMContentLoaded', (event) => {
    // Call getMuxVariants when the page loads
    getMuxVariants();
});

function parseBooleanEquation(equation, variableValues) {
    const precedence = {
        '(': 0,  // Lowest precedence for brackets
        '+': 1,  // OR
        '⊕': 2,  // XOR
        '⊖': 2,  // XNOR
        '•': 3,  // AND (implicitly represented as consecutive variables)
        "'": 4   // NOT
    };

    // Convert equation to tokens
    function tokenize(eq) {
        const tokens = [];
        let i = 0;
        while (i < eq.length) {
            if (/\s/.test(eq[i])) {  // Skip spaces
                i++;
            } else if ("()⊕+•⊖'".includes(eq[i])) {  // Operators
                tokens.push(eq[i]);
                i++;
            } else if (/\w/.test(eq[i])) {  // Variables
                let start = i;
                while (i < eq.length && /\w/.test(eq[i])) {
                    i++;
                }
                tokens.push(eq.slice(start, i));
            } else {
                throw new Error(`Unexpected character: ${eq[i]}`);
            }
        }
        return tokens;
    }

    // Convert infix expression to postfix using shunting-yard algorithm
    function infixToPostfix(tokens) {
        const output = [];
        const stack = [];
        tokens.forEach(token => {
            if (/\w/.test(token)) {
                output.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                let topToken = stack.pop();
                while (topToken !== '(') {
                    output.push(topToken);
                    topToken = stack.pop();
                }
                if (stack.length && stack[stack.length - 1] === "'") {
                    output.push(stack.pop());
                }
            } else {
                while (stack.length && precedence[stack[stack.length - 1]] >= precedence[token]) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        });
        while (stack.length) {
            output.push(stack.pop());
        }
        return output;
    }

    // Evaluate the postfix expression
    function evaluatePostfix(postfix, variableValues) {
        const stack = [];
        postfix.forEach(token => {
            if (/\w/.test(token)) {
                stack.push(variableValues[token]);
            } else if (token === "'") {
                const a = stack.pop();
                stack.push(!a);
            } else if (token === '•') {  // AND
                const b = stack.pop(), a = stack.pop();
                stack.push(a && b);
            } else if (token === '+') {  // OR
                const b = stack.pop(), a = stack.pop();
                stack.push(a || b);
            } else if (token === '⊕') {  // XOR
                const b = stack.pop(), a = stack.pop();
                stack.push(a !== b);
            } else if (token === '⊖') {  // XNOR
                const b = stack.pop(), a = stack.pop();
                stack.push(a === b);
            }
        });
        return stack[0] ? 1 : 0;
    }

    // Tokenize, convert to postfix, and evaluate
    const tokens = tokenize(equation);
    const postfix = infixToPostfix(tokens);
    const result = evaluatePostfix(postfix, variableValues);

    return { postfix, result };
}

// Example Usage
const equation = "C ⊖ (A • (B + C))' ⊕ D";  // Input equation
const variableValues = { 'A': 1, 'B': 0, 'C': 1, 'D': 1 };  // Example variable assignments

// Parse and evaluate the equation
const { postfix, result } = parseBooleanEquation(equation, variableValues);
console.log(`Input Equation: ${equation}`);
console.log(`Postfix Notation: ${postfix.join(' ')}`);
console.log(`Evaluation Result: ${result}`);

//get MUX variants and draw mux and create input fields
function getMuxVariants() {
    var selectors = document.getElementById('type').value;
    var selplus1 = Number(selectors)+1;
    var inputs = 2**selectors;
    var inputplus1 = Number(inputs)+1;
    // console.log(selectors);

    const circuitDiv = document.getElementById('circuit');

    //Draw MUX 
    // Clear any existing SVG
    circuitDiv.innerHTML = '';

    // Create the SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";

    var width = selectors*10.5+10.5
    var x = 50 - width/2
    var height = selectors*17+17
    var y = 50 - height/2 -5.5
    // Draw the multiplexer (example)
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#B4E5A2");
    rect.setAttribute("stroke", "black");
    svg.appendChild(rect);

    // Draw the Y output line 
    var xforY = 50 + width/2
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", xforY+10);
    line.setAttribute("y1", "42.5");
    line.setAttribute("x2", xforY);
    line.setAttribute("y2", "42.5");
    line.setAttribute("stroke", "black");
    svg.appendChild(line);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", xforY+14);
    text.setAttribute("y", "44");
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "4");
    text.textContent = `Y`;
    svg.appendChild(text);

    // console.log("test selector: " + selectors)
    // console.log("test selector+1: " + selplus1)

    // Draw the S input lines
    for (let i = 0; i < selectors; i++) {
        var sel_pos = 50 + width/2 - ((width/selplus1)*(i+1))
        var base = 50 + height/2 -5.5
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", sel_pos);
        line.setAttribute("y1", base);
        line.setAttribute("x2", sel_pos);
        line.setAttribute("y2", base + 5);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", sel_pos +2);
        text.setAttribute("y", base + 9);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size", "4");
        text.textContent = `S${i}`;
        svg.appendChild(text);
    }

    //Draw the I input lines
    for (let i = 0; i < inputs; i++) {
        var input_pos = 50 - height/2 + ((height/inputplus1)*(i+1)) - 5.5
        var left = 50 - width/2
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", left);
        line.setAttribute("y1", input_pos);
        line.setAttribute("x2", left -5);
        line.setAttribute("y2", input_pos);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", left - 7);
        text.setAttribute("y", input_pos + 2);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size", "4");
        text.textContent = `I${i}`;
        svg.appendChild(text);
    }
    // Append the SVG to the circuit div
    circuitDiv.appendChild(svg);

    //update input fields > call solving functions > create truth table 
    const inputContainer = document.getElementById('inputss');
    inputContainer.innerHTML = '';

    // Create header for inputs
const inputsHeader = document.createElement("div");
const inputsHeaderText = document.createElement("span");
inputsHeaderText.textContent = "Inputs";
inputsHeaderText.style.fontWeight = "bold";
inputsHeaderText.style.textDecoration = "underline";
inputsHeader.appendChild(inputsHeaderText);
inputContainer.appendChild(inputsHeader);

// Create text input fields for inputs
for (let i = 0; i < inputs; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    const label = document.createElement("label");
    label.setAttribute("for", `input-${i}`);
    label.textContent = `I${i + 1}: `;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Input ${i + 1}`;
    input.id = `input-${i}`;
    input.addEventListener("input", function() {
        validateInput(this, /^[01]$/); // Example regex to allow only 0 or 1
    });

    inputGroup.appendChild(label); // Append label to input-group
    inputGroup.appendChild(input); // Append input to input-group
    inputContainer.appendChild(inputGroup); // Append input-group to input-container
}

// Create header for selectors
const selectorsHeader = document.createElement("div");
const selectorsHeaderText = document.createElement("span");
selectorsHeaderText.textContent = "Select";
selectorsHeaderText.style.fontWeight = "bold";
selectorsHeaderText.style.textDecoration = "underline";
selectorsHeader.appendChild(selectorsHeaderText);
inputContainer.appendChild(selectorsHeader);

// Create text input fields for selectors
for (let i = 0; i < selectors; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    const label = document.createElement("label");
    label.setAttribute("for", `selector-input-${i}`);
    label.textContent = `S${i + 1}: `;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Selector ${i + 1}`;
    input.id = `selector-input-${i}`;
    input.addEventListener("input", function() {
        validateInput(this, /^[01]$/); // Example regex to allow only 0 or 1
    });

    inputGroup.appendChild(label); // Append label to input-group
    inputGroup.appendChild(input); // Append input to input-group
    inputContainer.appendChild(inputGroup); // Append input-group to input-container
}
}

// Function to validate input using regex
function validateInput(input, regex) {
    if (!regex.test(input.value)) {
        input.setCustomValidity("Invalid input");
        input.reportValidity();
    } else {
        input.setCustomValidity("");
    }
}

let focusedInput = null;

// Event listener to track the focused input field
document.addEventListener('focusin', (event) => {
    if (event.target.tagName === 'INPUT' && event.target.type === 'text') {
        focusedInput = event.target;
    }
});

// Function to insert a symbol into the focused input field
function insertSymbol(symbol) {
    if (focusedInput) {
        const start = focusedInput.selectionStart;
        const end = focusedInput.selectionEnd;
        const value = focusedInput.value;
        focusedInput.value = value.slice(0, start) + symbol + value.slice(end);
        focusedInput.selectionStart = focusedInput.selectionEnd = start + symbol.length;
        focusedInput.focus();
    }
}

// Function to handle submit button click
function submit() {
    // Your submit logic here
    console.log("Submit button clicked");
}