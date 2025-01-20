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

//get MUX variants and draw mux 
function getMuxVariants() {
    var selectors = document.getElementById('type').value;
    var inputs = 2**selectors;
    console.log(selectors);

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

    // Draw the multiplexer (example)
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", "40");
    rect.setAttribute("y", "5");
    rect.setAttribute("width", "40");
    rect.setAttribute("height", "80");
    rect.setAttribute("fill", "#B4E5A2");
    rect.setAttribute("stroke", "black");
    svg.appendChild(rect);

    // Append the SVG to the circuit div
    circuitDiv.appendChild(svg);

    //update input fields > call solving functions > create truth table 
}