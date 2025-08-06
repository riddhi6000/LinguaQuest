const questions = [
    {
        type : "mcq",
        question : "How do you say 'Hello' in Spanish?\n",
        options : ["Hola", "Aloha", "Hallo", "Bonjour"],
        answer : "Hola"
    },

    {
        type : "fill",
        question : "_______ means 'Thank you' in Spanish.\n",
        answer : "Gracias"
    },

    {
        type : "dragdrop",
        question : "Match the following :\n",
        pairs : [
            {left : "Hello", right : "Hola"},
            {left : "Thank you", right : "Gracias"},
            {left : "Goodbye", right : "Adiós"},
            {left : "Good Morning", right : "Buen Día"}
        ]
    }
];

const container = document.getElementById("question-container");
let ques_index = 0;
let next_button = document.getElementById("next-btn");

const mcq_ques = (curr_ques) => {
    let ques_display = document.createElement("div");
    ques_display.innerText = curr_ques.question;
    container.appendChild(ques_display);
    ques_display.classList.add("mcq-questions");

    curr_ques.options.forEach((option) => {
        let op = document.createElement("button");
        op.innerText = option;
        ques_display.appendChild(op);
        op.classList.add("mcq-options");

        op.addEventListener("click", () => {
            const all_options = document.querySelectorAll(".mcq-options");
            all_options.forEach((option) => {
                option.disabled = true;
            })
            if(op.innerText === curr_ques.answer) {
                op.classList.add("correct");
            }
            else {
                op.classList.add("wrong");
            }
        })
    })
}

const fill_ques = (curr_ques) => {
    let ques_display = document.createElement("div");
    ques_display.innerText = curr_ques.question;
    container.appendChild(ques_display);
    ques_display.classList.add("fill-questions");

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "enter your answer";
    ques_display.appendChild(input);

    let checkBtn = document.createElement("button");
    checkBtn.innerText = "Check Answer";
    ques_display.appendChild(checkBtn);

    checkBtn.addEventListener("click", () => {
        let userAnswer = input.value;
        if(userAnswer.toLowerCase() === curr_ques.answer.toLowerCase()) {
            input.classList.add("correct");
        }
        else {
            input.classList.add("wrong");
        }
        checkBtn.disabled = true;
        input.disabled = true;
    })
}

const dragdrop_ques = (curr_ques) => {
    let ques_display = document.createElement("div");
    ques_display.innerText = curr_ques.question;
    container.appendChild(ques_display);
    ques_display.classList.add("dragdrop-questions");

    let leftDiv = document.createElement("div");
    let rightdiv = document.createElement("div");
    leftDiv.classList.add("drag-items");
    rightdiv.classList.add("drop-zones");

    ques_display.appendChild(leftDiv);
    ques_display.appendChild(rightdiv);

    let pairs = curr_ques.pairs.sort(() => Math.random() - 0.5);

    pairs.forEach(pair => {
        let dragItem = document.createElement("div");
        dragItem.innerText = pair.left;
        dragItem.classList.add("drag-item");
        dragItem.setAttribute("draggable", "true");

        dragItem.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", pair.left);
        })

        leftDiv.appendChild(dragItem);
    })

    pairs.forEach(pair => {
        let dropZone = document.createElement("div");
        dropZone.innerText = pair.right;
        dropZone.classList.add("drop-zone");

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedText = e.dataTransfer.getData("text/plain");

            if(draggedText === pairs.find(p => p.right === dropZone.innerText).left) {
                dropZone.classList.add("correct");
                dropZone.innerText = `${draggedText} -> ${dropZone.innerText}`;

                dropZone.removeEventListener("drop", arguments.callee);

                let draggableItems = leftDiv.querySelectorAll(".drag-item");
                draggableItems.forEach(item => {
                    if(item.innerText===draggedText) {
                        item.setAttribute("draggable", "false");
                        item.style.opacity = "0.5";
                    }
                })
            }
            else {
                dropZone.classList.add("wrong");
                setTimeout(() => dropZone.classList.remove("wrong"), 1000);
            }
        })

        rightdiv.appendChild(dropZone);
    })
}

function display_question() {
    if(ques_index < questions.length) {
        let curr_ques = questions[ques_index];
        if(curr_ques.type == "mcq") {
            mcq_ques(curr_ques);
        }
        else if(curr_ques.type == "fill") {
            fill_ques(curr_ques);
        }
        else if(curr_ques.type == "dragdrop") {
            dragdrop_ques(curr_ques);
        }
    }
    ques_index++;
}

display_question();

next_button.addEventListener("click", () => {
    container.innerHTML = "";
    display_question();
})



