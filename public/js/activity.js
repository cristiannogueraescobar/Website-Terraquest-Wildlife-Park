"use strict";

const missions = [
    {
        habitat: "The Last Forest",
        question:
            "A ranger discovers an injured red panda close to a visitor trail. What should happen first?",
        answers: [
            "Move the animal immediately without specialist equipment.",
            "Keep visitors away and contact the wildlife care team.",
            "Allow visitors to take photographs before closing the area."
        ],
        correctAnswer: 1,
        explanation:
            "The area should be secured and trained wildlife specialists should assess the animal safely."
    },
    {
        habitat: "The Golden Reserve",
        question:
            "A rhinoceros appears stressed because visitors are making loud noises. What is the best response?",
        answers: [
            "Ask visitors to remain quiet and move away from the enclosure.",
            "Continue the activity because the animal will become accustomed to it.",
            "Play louder sounds to distract the rhinoceros."
        ],
        correctAnswer: 0,
        explanation:
            "Reducing noise and giving the animal space protects its welfare and prevents further stress."
    },
    {
        habitat: "Predator Territory",
        question:
            "A visitor reports damage near a predator viewing barrier. What should the ranger do?",
        answers: [
            "Wait until the end of the day to inspect it.",
            "Attempt to repair it alone while visitors remain nearby.",
            "Close the area immediately and contact the specialist safety team."
        ],
        correctAnswer: 2,
        explanation:
            "Public access must stop immediately until trained staff confirm that the area is safe."
    },
    {
        habitat: "River of Life",
        question:
            "Plastic waste is discovered floating in the wetland habitat. What is the safest action?",
        answers: [
            "Remove it using approved equipment and investigate where it came from.",
            "Push it beneath the water so visitors cannot see it.",
            "Leave it because the animals may use it as shelter."
        ],
        correctAnswer: 0,
        explanation:
            "Waste should be removed safely because it can injure animals and damage water quality."
    },
    {
        habitat: "Little Rangers Village",
        question:
            "A child wants to feed an animal using food brought from home. What should the keeper do?",
        answers: [
            "Allow it if the animal appears interested.",
            "Explain that only approved food may be given during supervised sessions.",
            "Let the child leave the food inside the enclosure."
        ],
        correctAnswer: 1,
        explanation:
            "Only approved food should be used because unsuitable food may harm the animal."
    }
];

const introductionScreen = document.querySelector("#game-introduction");
const questionScreen = document.querySelector("#question-screen");
const resultScreen = document.querySelector("#result-screen");

const startButton = document.querySelector("#start-game");
const nextButton = document.querySelector("#next-question");
const restartButton = document.querySelector("#restart-game");

const habitatName = document.querySelector("#habitat-name");
const questionText = document.querySelector("#question-text");
const answerOptions = document.querySelector("#answer-options");
const feedback = document.querySelector("#answer-feedback");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");

const resultTitle = document.querySelector("#result-title");
const finalScore = document.querySelector("#final-score");
const resultMessage = document.querySelector("#result-message");

let currentMission = 0;
let score = 0;

function displayMission() {
    const mission = missions[currentMission];

    habitatName.textContent = mission.habitat;
    questionText.textContent = mission.question;
    feedback.textContent = "";
    feedback.className = "answer-feedback";
    nextButton.hidden = true;

    progressText.textContent =
        `Mission ${currentMission + 1} of ${missions.length}`;

    const progressPercentage =
        ((currentMission + 1) / missions.length) * 100;

    progressBar.style.width = `${progressPercentage}%`;
    progressTrack.setAttribute("aria-valuenow", currentMission + 1);

    answerOptions.innerHTML = "";

    mission.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        answerOptions.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    const mission = missions[currentMission];
    const answerButtons =
        answerOptions.querySelectorAll(".answer-button");

    answerButtons.forEach((button) => {
        button.disabled = true;
    });

    if (selectedAnswer === mission.correctAnswer) {
        score += 1;
        feedback.textContent = `Correct. ${mission.explanation}`;
        feedback.classList.add("feedback-correct");
    } else {
        feedback.textContent = `Not quite. ${mission.explanation}`;
        feedback.classList.add("feedback-incorrect");
    }

    answerButtons[mission.correctAnswer].classList.add("correct-answer");
    nextButton.hidden = false;
    nextButton.focus();
}

function displayResults() {
    questionScreen.hidden = true;
    resultScreen.hidden = false;

    finalScore.textContent =
        `You completed ${score} out of ${missions.length} missions correctly.`;

    if (score === 5) {
        resultTitle.textContent = "Wildlife Guardian";
        resultMessage.textContent =
            "Excellent work. Your decisions protected animals, visitors and habitats.";
    } else if (score >= 3) {
        resultTitle.textContent = "Conservation Ranger";
        resultMessage.textContent =
            "Good work. You understand many important wildlife protection principles.";
    } else {
        resultTitle.textContent = "Ranger in Training";
        resultMessage.textContent =
            "Every ranger starts by learning. Try the mission again and improve your score.";
    }

    restartButton.focus();
}

startButton.addEventListener("click", () => {
    introductionScreen.hidden = true;
    questionScreen.hidden = false;

    currentMission = 0;
    score = 0;

    displayMission();
});

nextButton.addEventListener("click", () => {
    currentMission += 1;

    if (currentMission < missions.length) {
        displayMission();
    } else {
        displayResults();
    }
});

restartButton.addEventListener("click", () => {
    resultScreen.hidden = true;
    introductionScreen.hidden = false;

    currentMission = 0;
    score = 0;

    startButton.focus();
});