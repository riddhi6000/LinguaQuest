// array of question objects
const questions = [
    {
        type : "dragdrop",
        question : "Drag the English words on the left to match them with their correct Spanish meanings on the right :\n",
        pairs : [
            {left : "Tea", right : "Té"},
            {left : "Coffee", right : "Café"},
            {left : "Water", right : "Agua"},
            {left : "Juice", right : "Jugo"}
        ]
    },

    {
        type : "fill",
        question : 'Fill in the blank : "_______ por el café.\n"',
        translation : 'Translation : "Thank you for the coffee."\n',
        answer : "Gracias"
    },

    {
        type : "mcq",
        question : "How do you say 'Please' in Spanish?\n",
        options : ["Pan", "Gracias", "Agua", "Por favor"],
        answer : "Por favor"
    },

    {
        type : "mcq",
        question : "What means 'Water' in Spanish?\n",
        options : ["Leche", "Pan", "Agua", "Jugo"],
        answer : "Agua"
    },

    {
        type : "dragdrop",
        question : "Match the following English words to their correct Spanish meanings :\n",
        pairs : [
            {left : "Please", right : "Por favor"},
            {left : "Thank you", right : "Gracias"},
            {left : "Bread", right : "Pan"},
            {left : "Milk", right : "Leche"}
        ]
    },

    {
        type : "mcq",
        question : "What does 'Té' mean?\n",
        options : ["Water", "Milk", "Tea", "Coffee"],
        answer : "Tea"
    },

    {
        type : "fill",
        question : "Leche y ___, por favor.\n",
        translation : 'Translation : "Milk and bread, please."\n',
        answer : "Pan"
    },
];

//shuffling the questions
let shuffledQuestions = [...questions]
for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
}

//audio
const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

//defining variables
const container = document.getElementById("question-container");
let ques_index = 0;
let check_button = document.getElementById("check-btn");
let next_button = document.getElementById("next-btn");
let feedback = document.getElementById("feedback");
let popup = document.getElementById("popup");
popup.style.display = "none";
let ques_count = 0;

// function to show the popup after completing a lesson
function showPopup() {
  document.getElementById("popup").style.display = "";
}

//disabling the check button until user selects an answer
check_button.disabled = true;
//hiding the next button until user answers the current question
next_button.style.display = "none";

const mcq_ques = (curr_ques) => {

    let ques_display = document.getElementById("ques_display");
    ques_display.innerHTML = curr_ques.question;

    let options_container = document.createElement("div");
    options_container.classList.add("options-container");
    ques_display.appendChild(options_container);

    curr_ques.options.forEach((option) => {
        let op = document.createElement("button");
        op.innerText = option;
        options_container.appendChild(op);
        op.classList.add("mcq-options");

        const all_options = document.querySelectorAll(".mcq-options");

        //ensuring that only one option can be selected
        all_options.forEach(btn => {
            btn.addEventListener("click", () => {
                all_options.forEach(b => {
                    b.classList.remove("selected");
                })
                btn.classList.add("selected");

                check_button.disabled = false;
            })
        })
    })

    //check button function
    check_button.onclick = () => {
        const selected = document.querySelector(".mcq-options.selected");
        if(selected.innerText === curr_ques.answer) {
            feedback.innerText = "Correct Answer! ✅";
            correctSound.currentTime = 0;
            correctSound.play();
        }
        else {
            feedback.innerHTML = `Wrong Answer ❌<br>The correct answer is <u>${curr_ques.answer}</u>`;
            wrongSound.currentTime = 0;
            wrongSound.play();
        }

        if(ques_count==questions.length) {
            next_button.innerHTML = "Finish"
        }
        next_button.style.display = "";

        //disabling the options and check button after user clicks check button once
        check_button.disabled = true;
        const all_options = document.querySelectorAll(".mcq-options");
        all_options.forEach(btn => {
            btn.disabled = true;
        });
    }
}

const fill_ques = (curr_ques) => {
    let ques_display = document.getElementById("ques_display");

    //creating a span for the translation text
    ques_display.innerHTML = `${curr_ques.question}<br><span class="translation-text">${curr_ques.translation}</span><br>`;

    //creating an input box for user to type answer
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your answer";
    ques_display.appendChild(input);
    input.classList.add("fill-input");
    input.focus();

    //checks the input box and disables the check button if its empty
    input.addEventListener("input", () => {
        check_button.disabled = input.value.trim() === "";
    });

    check_button.onclick = () => {
        let userAnswer = input.value;
        if(userAnswer.toLowerCase() === curr_ques.answer.toLowerCase()) {
            feedback.innerText = "Correct Answer! ✅";
            correctSound.currentTime = 0;
            correctSound.play();
        }
        else {
            feedback.innerHTML = `Wrong Answer ❌<br>The correct answer is <u>${curr_ques.answer}</u>`;
            wrongSound.currentTime = 0;
            wrongSound.play();
        }

        if(ques_count==questions.length) {
            next_button.innerHTML = "Finish"
        }
        
        next_button.style.display = "";
        input.disabled = true;
        check_button.disabled = true;
    }
}

const dragdrop_ques = (curr_ques) => {

    //displaying the question
    let ques_display = document.getElementById("ques_display");
    ques_display.innerHTML = curr_ques.question;

    //creating 2 divs for drag and drop elements
    let dragContainer = document.createElement("div")
    let dropContainer = document.createElement("div");
    dragContainer.classList.add("dragContainer");
    dropContainer.classList.add("dropContainer");

    //creating a container div and appending all created divs
    let drag_drop_cont = document.createElement("div");
    drag_drop_cont.id = "drag_drop_cont";
    ques_display.appendChild(drag_drop_cont);
    drag_drop_cont.appendChild(dragContainer);
    drag_drop_cont.appendChild(dropContainer);

    const leftItems = curr_ques.pairs.map(p => p.left);
    const rightItems = curr_ques.pairs.map(p => p.right);

    const shuffle = (arr) => {
        for (let i=arr.length-1; i>0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    shuffle(leftItems);
    shuffle(rightItems);

    leftItems.forEach(left => {
        //creating drag item
        let drag = document.createElement("div");
        drag.innerHTML = left;
        drag.classList.add("dragOptions");
        drag.setAttribute("draggable", "true");
        
        drag.setAttribute("data-left", left); //creating an attribute called data-left and assigning its value to pair.left
        
        drag.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.getAttribute("data-left"));
        }) //adding an event listener to the drag item to transfer the text that it holds to the dropzone where the user drops it
        
        dragContainer.appendChild(drag);
    })
    
    rightItems.forEach(right => {
        //wrapper div to hold dropzone and label
        let wrapper = document.createElement("div");
        wrapper.classList.add("dropzone_wrapper");

        //creating drop zone
        let dropZone = document.createElement("div");
        dropZone.classList.add("dropOptions");
        dropZone.setAttribute("data-right", right);
        dropZone.setAttribute("data-current", "");
        dropZone.id = "dropZone";

        //drop event handlers
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");

            const draggedItem = document.querySelector(`[data-left = "${data}"]`);

            //prevents dropping more than one item to a dropzone
            if(e.target.children.length > 0) {
                return;
            }

            const previousZone = draggedItem.parentElement;
            if (previousZone.classList.contains("dropOptions") && previousZone!==e.target) {
                previousZone.style.backgroundColor = "";
                previousZone.innerHTML = "";
            }

            e.target.innerHTML = "";
            e.target.appendChild(draggedItem);
            e.target.style.backgroundColor = "white";
            draggedItem.style.border = "none";
            e.target.setAttribute("data-current", data);

            let allFilled = true;
            document.querySelectorAll(".dropOptions").forEach(dropzone => {
                if(dropzone.children.length === 0) {
                    allFilled = false;
                }
            })

            if(allFilled) {
                check_button.disabled = false;
            }
        })

        //labels for right side options
        let label = document.createElement("div");
        label.innerText = right;
        label.classList.add("label");

        wrapper.appendChild(dropZone);
        wrapper.appendChild(label);
        dropContainer.appendChild(wrapper);
    })

    check_button.onclick = () => {
        let score = 0;
        let total = curr_ques.pairs.length;

        const allDropZones = document.querySelectorAll(".dropOptions");

        allDropZones.forEach(zone => {
            let correct = zone.getAttribute("data-right");
            let user = zone.getAttribute("data-current");

            let correctPair = curr_ques.pairs.find(p => p.right === correct);

            if(correctPair.left === user) {
                score++;
                zone.style.border = "2px solid green";
            }
            else {
                zone.style.border = "2px solid red";
            }
        })
        
        if(score === total) {
            correctSound.currentTime = 0;
            correctSound.play();
        } else {
            wrongSound.currentTime = 0;
            wrongSound.play();  
        }

        if(ques_count==questions.length) {
            next_button.innerHTML = "Finish"
        }

        feedback.innerText = `You got ${score} out of ${total} correct.`;
        check_button.disabled = true;
        next_button.style.display = "";
    }
}

//function to traverse the questions array
function display_question() {
    ques_count++;
    if(ques_index < shuffledQuestions.length) {
        let curr_ques = shuffledQuestions[ques_index];
        if(curr_ques.type == "mcq") {
            mcq_ques(curr_ques);
        }
        else if(curr_ques.type == "fill") {
            fill_ques(curr_ques);
        }
        else if(curr_ques.type == "dragdrop") {
            dragdrop_ques(curr_ques);
        }
        ques_index++;
    }
    else {
        console.log("end of lesson");
    }
}

display_question();

next_button.addEventListener("click", () => {
    if(ques_count==questions.length) {
        showPopup();
        correctSound.currentTime = 0;
        correctSound.play();
    }
    else {
        ques_display.innerHTML = "";
        feedback.innerHTML = "";
        display_question();
        next_button.style.display = "none";
    }
})



