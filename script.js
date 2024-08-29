// JavaScript for handling the multiplexer functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get references to input elements
    const input0 = document.getElementById("input0");
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const input3 = document.getElementById("input3");
    const selector0 = document.getElementById("selector0");
    const selector1 = document.getElementById("selector1");
    const output = document.getElementById("output");

    // Get references to SVG line elements for dynamic visualization
    const lineIn0 = document.getElementById("line-in0");
    const lineIn1 = document.getElementById("line-in1");
    const lineIn2 = document.getElementById("line-in2");
    const lineIn3 = document.getElementById("line-in3");
    const lineOut = document.getElementById("line-out");
    const outputIndicator = document.getElementById("output-indicator");

    // Function to update the output based on selected inputs
    function updateOutput() {
        // Determine the selector state (combines the states of selector0 and selector1 into a binary number)
        const selectorState = `${selector1.checked ? '1' : '0'}${selector0.checked ? '1' : '0'}`;

        // Reset line styles
        [lineIn0, lineIn1, lineIn2, lineIn3].forEach(line => line.classList.remove('active-line'));
        
        // Determine the output based on the selector state and highlight the corresponding line
        let outputValue;
        switch (selectorState) {
            case "00":
                outputValue = input0.checked ? '1' : '0';
                lineIn0.classList.add('active-line');
                break;
            case "01":
                outputValue = input1.checked ? '1' : '0';
                lineIn1.classList.add('active-line');
                break;
            case "10":
                outputValue = input2.checked ? '1' : '0';
                lineIn2.classList.add('active-line');
                break;
            case "11":
                outputValue = input3.checked ? '1' : '0';
                lineIn3.classList.add('active-line');
                break;
            default:
                outputValue = '0';
        }

        // Update the output display
        output.textContent = outputValue;

        // Update the color of the output line based on the output value
        if (outputValue === '1') {
            lineOut.classList.add('active-line');
            outputIndicator.setAttribute('fill', 'red');
        } else {
            lineOut.classList.remove('active-line');
            outputIndicator.setAttribute('fill', 'black');
        }
    }

    // Add event listeners to inputs and selectors
    [input0, input1, input2, input3, selector0, selector1].forEach(input => {
        input.addEventListener('change', updateOutput);
    });

    // Initialize the output
    updateOutput();
});
