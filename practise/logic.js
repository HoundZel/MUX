// Function to draw line above letter
function drawLineAboveLetter(letter) {
    return letter + '\u0304';
}

// Logic gate functions
function AND(x, y) {
    return String(Number(x) & Number(y));
}

function OR(x, y) {
    return String(Number(x) | Number(y));
}

function XOR(x, y) {
    return String(Number(x) ^ Number(y));
}

function XNOR(x, y) {
    return String(1 - (Number(x) ^ Number(y)));
}

function NAND(x, y) {
    return String(1 - (Number(x) & Number(y)));
}

function NOR(x, y) {
    return String(1 - (Number(x) | Number(y)));
}

function initializeMux() {
    // Initiated multiplexer config
    const num_of_input = [4, 8][Math.floor(Math.random() * 2)];
    const num_of_select = Math.log2(num_of_input);

    let inputs = {};
    let select = [];

    for (let i = 0; i < num_of_input; i++) {
        inputs["I" + i] = 0;
    }

    for (let j = 0; j < num_of_select; j++) {
        select.push("S" + j);
    }

    let z = {
        "A": ['a', drawLineAboveLetter('a')],
        "B": ['b', drawLineAboveLetter('b')],
        "C": ['c', drawLineAboveLetter('c')],
        "binary": ['0', '1']
    };

    if (num_of_input === 8) {
        z["D"] = ['d', drawLineAboveLetter('d')];
    }

    let z_track = JSON.parse(JSON.stringify(z));
    z_track["gate"] = ['AND', 'OR', 'XOR', 'XNOR', 'NAND', 'NOR'];

    for (let i in inputs) {
        if (Object.keys(z_track).length === 0) {
            inputs[i] = z[Object.keys(z)[Math.floor(Math.random() * Object.keys(z).length)]][Math.floor(Math.random() * 2)];
        } else {
            let temp = Object.keys(z_track)[Math.floor(Math.random() * Object.keys(z_track).length)];
            if (temp === "gate") {
                let first_choice = z[Object.keys(z)[Math.floor(Math.random() * Object.keys(z).length)]][Math.floor(Math.random() * 2)];
                let second_choice = first_choice;
                while (second_choice === first_choice) {
                    second_choice = z[Object.keys(z)[Math.floor(Math.random() * Object.keys(z).length)]][Math.floor(Math.random() * 2)];
                }
                inputs[i] = first_choice + " " + z_track[temp][Math.floor(Math.random() * z_track[temp].length)] + " " + second_choice;
                delete z_track[temp];
            } else {
                inputs[i] = z_track[temp][Math.floor(Math.random() * z_track[temp].length)];
                delete z_track[temp];
            }
        }
    }

    for (let j of select) {
        inputs[j] = z[Object.keys(z)[Math.floor(Math.random() * Object.keys(z).length)]][Math.floor(Math.random() * 2)];
    }

    console.log("randomly generated MUX: " + JSON.stringify(inputs));

    // Size of kmap determined by the number of variables in z eg.z(a,b,c,d) = 2**4 = 16
    let kmap = [];

    // Binary counter matching size of Inputs(I)
    function binary_counter(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            result.push(i.toString(2).padStart(Math.log2(n), '0'));
        }
        return result;
    }

    let truth_table = binary_counter(num_of_input);

    // Solving min/maxterm given MUX
    // Step1: loop kmap in binary (abcd)
    // Step2: deep copy input dictionary and assign values to the unknown variables in select and input
    // Step3: use truth table to find output based off current mux variables in select and input
    // Step4: append output to kmap array
    // Step5: discover the min and max term

    let kmap_bin = binary_counter(2 ** (Object.keys(z).length - 1));

    let gate_names = ['AND', 'OR', 'XOR', 'XNOR', 'NAND', 'NOR'];
    let gate_pattern = new RegExp('\\b(' + gate_names.join('|') + ')\\b');

    for (let kmap_index of kmap_bin) {
        let curr_input = JSON.parse(JSON.stringify(inputs));
        let abcd = {};

        for (let i = 0; i < kmap_index.length; i++) {
            abcd[String.fromCharCode(97 + i)] = kmap_index[i];
            if (kmap_index[i] === '0') {
                abcd[drawLineAboveLetter(String.fromCharCode(97 + i))] = '1';
            } else {
                abcd[drawLineAboveLetter(String.fromCharCode(97 + i))] = '0';
            }
        }

        for (let j in curr_input) {
            if (gate_pattern.test(curr_input[j])) {
                let parts = curr_input[j].split(" ");
                let value_1 = abcd[parts[0]] || parts[0];
                let gate = parts[1];
                let value_2 = abcd[parts[2]] || parts[2];

                // Retrieve the function object from the function name
                let gate_function = eval(gate);

                // Call the function with the arguments
                let result = gate_function(value_1, value_2);
                curr_input[j] = result;
            }

            if (abcd[curr_input[j]]) {
                curr_input[j] = abcd[curr_input[j]];
            }
        }

        let selector_combi = Object.keys(curr_input).filter(key => key.startsWith('S')).sort().reverse().map(key => curr_input[key]).join('');

        for (let k = 0; k < truth_table.length; k++) {
            if (selector_combi === truth_table[k]) {
                kmap.push(curr_input['I' + k]);
            }
        }
    }

    console.log("kmap is: " + JSON.stringify(kmap));

    let minterm = [];
    let maxterm = [];

    for (let i = 0; i < kmap.length; i++) {
        if (kmap[i] === '1') {
            minterm.push(i);
        } else if (kmap[i] === '0') {
            maxterm.push(i);
        }
    }

    console.log("minterm is: " + JSON.stringify(minterm));
    console.log("maxterm is: " + JSON.stringify(maxterm));

    // Check if minterm or maxterm is empty and call initializeMux again if true
    if (minterm.length === 0 || maxterm.length === 0) {
        console.log("Empty minterm or maxterm detected. Regenerating MUX configuration.");
        return initializeMux();
    }

    // Return the generated values
    return { inputs, minterm, maxterm, kmap };
}

// Function to generate the question and options
function qn_generator() {
    // Initialize the MUX and get the generated values
    const { inputs, minterm, maxterm, kmap } = initializeMux();

    // Randomly decide between minterm and maxterm
    let answerType = Math.random() < 0.5 ? "minterm" : "maxterm";

    // Determine the correct answer based on the random choice
    let correctAnswer = answerType === "minterm" ? minterm : maxterm;

    // Check if the correct answer is empty
    if (correctAnswer.length === 0) {
        alert(`The ${answerType} is empty. Generating a new question.`);
        qn_generator(); // Generate a new question
        return;
    }

    // Set the question
    document.getElementById('question').innerText = `Find the ${answerType} for the following MUX configuration: ${JSON.stringify(inputs)}`;

    // Generate 3 other wrong unique answers of the same length
    let wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
        let wrongAnswer = new Set();
        while (wrongAnswer.size < correctAnswer.length) {
            let randomValue = Math.floor(Math.random() * kmap.length);
            wrongAnswer.add(randomValue);
        }
        wrongAnswer = Array.from(wrongAnswer).sort((a, b) => a - b);
        if (!correctAnswer.includes(wrongAnswer) && !wrongAnswers.has(wrongAnswer.toString())) {
            wrongAnswers.add(wrongAnswer.toString());
        }
    }

    // Combine correct answer and wrong answers
    let options = [correctAnswer, ...Array.from(wrongAnswers).map(ans => ans.split(',').map(Number))];

    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);

    // Set the options
    let optionButtons = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        optionButtons[index].innerText = JSON.stringify(option);
        optionButtons[index].onclick = () => checkAnswer(optionButtons[index], option, correctAnswer);
    });
}

// Function to check if the selected answer is correct
function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    let correctOption = JSON.stringify(correctAnswer);

    // Highlight the correct option in green
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach(button => {
        if (button.innerText === correctOption) {
            button.style.backgroundColor = "green";  // Highlight correct option
        }
        button.disabled = true;  // Disable all option buttons
    });

    // Highlight the selected option based on whether it's correct or not
    if (selectedButton.innerText === correctOption) {
        selectedButton.style.backgroundColor = "green";  // Correct answer
    } else {
        selectedButton.style.backgroundColor = "red";  // Incorrect answer
    }

    // Show the "Next Question" button
    document.getElementById('next-btn').classList.remove('hidden');
}

// Call the qn_generator function to generate the first question
qn_generator();

// Add event listener to the next button to generate a new question
document.getElementById('next-btn').addEventListener('click', () => {
    // Reset the background color and enable the option buttons
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach(button => {
        button.style.backgroundColor = "";  // Reset background color
        button.disabled = false;  // Enable button
    });

    // Hide the "Next Question" button
    document.getElementById('next-btn').classList.add('hidden');

    qn_generator();
});



// other functions
// DOMcontentloaded event listener for animated background 
document.addEventListener('DOMContentLoaded', function() {
    const animatedBackground = document.getElementById('animated-background');
  
    function playVideo() {
        animatedBackground.style.display = 'block';
        animatedBackground.play();
        animatedBackground.onended = function() {
            setTimeout(() => {
                animatedBackground.currentTime = 0; // Reset video to start
                playVideo();
            }, 30000); // Stay at the last frame for 30 seconds
        };
    }
  
    // Play the video once when the page loads
    playVideo();
  });
  
  // DOMcontentloaded event listener hamburger(mobile menu)
  document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const navE1 = document.querySelector('.nav');
    const hamburgerE1 = document.querySelector('.hamburger');
    const mediaQuery = window.matchMedia('(max-width: 650px)');
  
    const isHeaderSticky = () => {
        return header.getBoundingClientRect().top === 0;
    };
  
    const toggleHamburgerVisibility = () => {
        if (isHeaderSticky() && mediaQuery.matches) {
            hamburgerE1.classList.add('visible');
            hamburgerE1.style.pointerEvents = 'auto'; // Enable interaction
        } else {
            hamburgerE1.classList.remove('visible');
            hamburgerE1.style.pointerEvents = 'none'; // Disable interaction
            navE1.classList.remove("nav--open"); // Automatically close nav
            hamburgerE1.classList.remove("hamburger--open"); // Automatically close hamburger
        }
    };
  
    // Check visibility on scroll and media query change
    window.addEventListener('scroll', toggleHamburgerVisibility);
    mediaQuery.addEventListener('change', toggleHamburgerVisibility);
    // Initial check
    toggleHamburgerVisibility();
  
    hamburgerE1.addEventListener('click', () => {
        if (isHeaderSticky()) {
            console.log('Hamburger clicked while header is sticky');
            navE1.classList.toggle("nav--open");
            hamburgerE1.classList.toggle("hamburger--open");
        } else {
            console.log('Hamburger clicked while header is not sticky');
        }
    });
  
    navE1.addEventListener('click', () => {
        if (isHeaderSticky()) {
            console.log('Nav clicked while header is sticky');
            navE1.classList.remove("nav--open");
            hamburgerE1.classList.remove("hamburger--open");
        } else {
            console.log('Nav clicked while header is not sticky');
        }
    });
  });