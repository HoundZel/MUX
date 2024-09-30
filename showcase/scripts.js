document.addEventListener('DOMContentLoaded', (event) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const container = document.getElementById('multiplexer-container');
    const select = document.getElementById('multiplexer-select');
    const truthTable = document.querySelector('.truth_table table');

    function drawMultiplexer(inputs) {
        // Clear existing SVG
        container.innerHTML = '';

        // Calculate height based on number of inputs
        const baseHeight = 50;
        const spacing = inputs === 16 ? 15 : 10; // Increase spacing for 16 inputs
        const rectHeight = baseHeight + inputs * spacing;
        const svgHeight = rectHeight + 150; // Increase SVG height to accommodate selectors
        const rectWidth = 150; // Widen the rectangle to accommodate selectors

        // Calculate number of selector inputs
        const selectorInputs = Math.log2(inputs);

        // Create the SVG element
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", `0 0 250 ${svgHeight}`);
        svg.style.position = "relative"; // Ensure the SVG is positioned relative to its container

        // Draw the multiplexer body
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "50");
        rect.setAttribute("y", "50");
        rect.setAttribute("width", rectWidth);
        rect.setAttribute("height", rectHeight);
        rect.setAttribute("fill", "gray");
        rect.setAttribute("stroke", "black");
        svg.appendChild(rect);

        // Draw the input lines, labels, and switches
        for (let i = 0; i < inputs; i++) {
            const y = 60 + i * (rectHeight / inputs);
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", "30");
            line.setAttribute("y1", y);
            line.setAttribute("x2", "50");
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "black");
            svg.appendChild(line);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", "55"); // Position inside the box
            text.setAttribute("y", y + 5);
            text.textContent = `I${i}`;
            svg.appendChild(text);

            const foreignObject = document.createElementNS(svgNS, "foreignObject");
            foreignObject.setAttribute("x", "10");
            foreignObject.setAttribute("y", y - 10);
            foreignObject.setAttribute("width", "20");
            foreignObject.setAttribute("height", "20");

            const button = document.createElement("button");
            button.textContent = "0";
            button.style.width = "20px";
            button.style.height = "20px";

            // Add a class to the button to identify it as an input button
            button.classList.add("input-button");

            button.addEventListener("click", () => {
                button.textContent = button.textContent === "0" ? "1" : "0";
                line.setAttribute("stroke", button.textContent === "1" ? "red" : "black");
            });

            foreignObject.appendChild(button);
            svg.appendChild(foreignObject);
        }

        // Draw the output line and label
        const outputLine = document.createElementNS(svgNS, "line");
        outputLine.setAttribute("x1", 50 + rectWidth);
        outputLine.setAttribute("y1", 50 + rectHeight / 2);
        outputLine.setAttribute("x2", 70 + rectWidth);
        outputLine.setAttribute("y2", 50 + rectHeight / 2);
        outputLine.setAttribute("stroke", "black");
        svg.appendChild(outputLine);

        const outputText = document.createElementNS(svgNS, "text");
        outputText.setAttribute("x", 30 + rectWidth); // Move leftwards to be inside the box
        outputText.setAttribute("y", 55 + rectHeight / 2);
        outputText.textContent = "Y";
        svg.appendChild(outputText);
        
        // Create the placeholder for default "0"
        const defaultPlaceholder = document.createElementNS(svgNS, "text");
        defaultPlaceholder.setAttribute("x", 75 + rectWidth);
        defaultPlaceholder.setAttribute("y", 55 + rectHeight / 2);
        defaultPlaceholder.textContent = "hehe";
        defaultPlaceholder.setAttribute("id", "default-placeholder");
        svg.appendChild(defaultPlaceholder);

        // Draw the selector inputs, labels, and switches
        const selectorSpacing = 20; // Spacing between selector inputs
        const selectorStartX = 50 + (rectWidth - (selectorInputs - 1) * selectorSpacing) / 2; // Center the selectors

        for (let i = 0; i < selectorInputs; i++) {
            const x = selectorStartX + i * selectorSpacing;
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", 50 + rectHeight);
            line.setAttribute("x2", x);
            line.setAttribute("y2", 50 + rectHeight + 20);
            line.setAttribute("stroke", "black");
            svg.appendChild(line);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", x - 5);
            text.setAttribute("y", 10 + rectHeight + 35);
            text.textContent = `S${selectorInputs - i - 1}`; // Less significant bit on the right
            svg.appendChild(text);

            const foreignObject = document.createElementNS(svgNS, "foreignObject");
            foreignObject.setAttribute("x", x - 10);
            foreignObject.setAttribute("y", 20 + rectHeight + 40);
            foreignObject.setAttribute("width", "20");
            foreignObject.setAttribute("height", "20");

            const button = document.createElement("button");
            button.textContent = "0";
            button.style.width = "20px";
            button.style.height = "20px";

            // Add a class to the button to identify it as a selector button
            button.classList.add("selector-button");

            button.addEventListener("click", () => {
                button.textContent = button.textContent === "0" ? "1" : "0";
                line.setAttribute("stroke", button.textContent === "1" ? "red" : "black");
            });

            foreignObject.appendChild(button);
            svg.appendChild(foreignObject);
        }

        // Append the SVG to the container
        container.appendChild(svg);
    }

    // Initial draw
    drawMultiplexer(4);

    // Event listener for dropdown change
    select.addEventListener('change', (event) => {
        const value = event.target.value;
        let inputs;
        switch (value) {
            case '2-to-1':
                inputs = 2;
                break;
            case '4-to-1':
                inputs = 4;
                break;
            case '8-to-1':
                inputs = 8;
                break;
            case '16-to-1':
                inputs = 16;
                break;
            default:
                inputs = 4;
        }
        drawMultiplexer(inputs);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const multiplexerSelect = document.getElementById("multiplexer-select");
    const truthTableDiv = document.querySelector(".truth_table");

    function createTruthTable(selectorCount) {
        // Clear the previous table
        truthTableDiv.innerHTML = "";

        // Create the table element
        const table = document.createElement("table");
        table.style.width = "90%";
        table.style.backgroundColor = "paleyellow";
        table.style.borderCollapse = "collapse";

        const headerRow = document.createElement("tr");

        // Create header cells for selectors
        for (let i = selectorCount - 1; i >= 0; i--) {
            const th = document.createElement("th");
            th.textContent = `S${i}`;
            th.style.borderBottom = "2px solid black";
            headerRow.appendChild(th);
        }

        // Create header cell for output
        const thOutput = document.createElement("th");
        thOutput.textContent = "Y";
        thOutput.style.borderBottom = "2px solid black";
        thOutput.style.borderLeft = "2px solid black";
        headerRow.appendChild(thOutput);

        table.appendChild(headerRow);

        // Create rows for truth table
        const rowCount = Math.pow(2, selectorCount);
        for (let i = 0; i < rowCount; i++) {
            const row = document.createElement("tr");

            // Create cells for selector values
            for (let j = selectorCount - 1; j >= 0; j--) {
                const td = document.createElement("td");
                td.textContent = (i >> j) & 1;
                td.style.border = "1px solid black";
                row.appendChild(td);
            }

            // Create cell for output value
            const tdOutput = document.createElement("td");
            tdOutput.textContent = "0"; // Default output value
            tdOutput.style.border = "1px solid black";
            tdOutput.style.borderLeft = "2px solid black";
            row.appendChild(tdOutput);

            table.appendChild(row);
        }

        truthTableDiv.appendChild(table);
        
        const firstRow = table.querySelector("tr:nth-child(2)"); // First row after the header
        firstRow.style.backgroundColor = "pink";
    }

    function highlightRowBasedOnSelectors() {
        const table = truthTableDiv.querySelector("table");
        const rows = table.querySelectorAll("tr");
    
        // Reset all rows' background color
        rows.forEach((row, index) => {
            if (index > 0) { // Skip header row
                row.style.backgroundColor = "";
            }
        });
    
        // Calculate the row index based on the selector buttons' values
        let rowIndex = 1; // Default to the first row
        const selectorButtons = document.querySelectorAll(".selector-button");
        selectorButtons.forEach((button, index) => {
            // Reverse the index to process MSB as the highest index
            const reversedIndex = selectorButtons.length - 1 - index;
            if (button.textContent === "1") {
                rowIndex += Math.pow(2, reversedIndex);
            }
        });

        // Highlight the corresponding row
        const targetRow = rows[rowIndex];
        if (targetRow) {
            targetRow.style.backgroundColor = "pink";
            const outputCell = targetRow.querySelector("td:last-child");
            const defaultPlaceholder = document.getElementById("default-placeholder");
            defaultPlaceholder.textContent = outputCell.textContent;
        }
    }

    function updateTruthTable() {
        const selectedValue = multiplexerSelect.value;
        let selectorCount;

        switch (selectedValue) {
            case "2-to-1":
                selectorCount = 1;
                break;
            case "4-to-1":
                selectorCount = 2;
                break;
            case "8-to-1":
                selectorCount = 3;
                break;
            case "16-to-1":
                selectorCount = 4;
                break;
            default:
                selectorCount = 2;
        }

        createTruthTable(selectorCount);

        // Add event listeners to input-button and update the truth table values
        document.querySelectorAll(".input-button").forEach((button, index) => {
            button.addEventListener("click", () => {
                // Update the corresponding row in the truth table
                const table = truthTableDiv.querySelector("table");
                const rows = table.querySelectorAll("tr");
                const outputCell = rows[index + 1].querySelector("td:last-child");
                outputCell.textContent = button.textContent;

                // Update the default placeholder text
                const defaultPlaceholder = document.getElementById("default-placeholder");
                if (outputCell.parentNode.style.backgroundColor === "pink") {
                    defaultPlaceholder.textContent = button.textContent;
                }
            });
        });
    
        // Add event listeners to selector buttons and highlight the corresponding row
        document.querySelectorAll(".selector-button").forEach((button) => {
            button.addEventListener("click", () => {
                highlightRowBasedOnSelectors();
            });
        });

        // Highlight the first row by default
        highlightRowBasedOnSelectors();
    }

    multiplexerSelect.addEventListener("change", updateTruthTable);

    // Initial table creation
    updateTruthTable();
});