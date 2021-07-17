/// array of the quiz (question, choices, hit)
var quizArray = [
	{
	

	
		question: "How do you create a function in JavaScript?",
		answers: [
			{ choice: "1. function:myFunction()", id: "1" },
			{ choice: "2. function myFunction()", id: "2" },
			{ choice: "3. function = myFunction()", id: "3" },
			{ choice: "4. None of the above.", id: "4" },
		],
		hit: "2",
	},

	{
		question:
			"Which built-in method combines the text of two strings and returns a new string?",
		answers: [
			{ choice: "1. append()", id: "1" },
			{ choice: "2. concat()", id: "2" },
			{ choice: "3. attach()", id: "3" },
			{ choice: "4. None of the above.", id: "4" },
		],
		hit: "2",
	},

	{
		question:
			"Which of the following function of String object returns the characters in a string between two indexes into the string?",
		answers: [
			{ choice: "1. split()", id: "1" },
			{ choice: "2. slice()", id: "2" },
			{ choice: "3. substr()", id: "3" },
			{ choice: "4. substring()", id: "4" },
		],
		hit: "4",
	},

	{
		question: "How to write an IF statement in JavaScript?",
		answers: [
			{ choice: "1.  if i = 5", id: "1" },
			{ choice: "2.  if (i == 5)", id: "2" },
			{ choice: "3.  if i == 5 then", id: "3" },
			{ choice: "4.  if i = 5 then", id: "4" },
		],
		hit: "2",
	},

	{
		question: "Which of the following is not a valid JavaScript variable name?",
		answers: [
			{ choice: "1. 2names", id: "1" },
			{ choice: "2. _first_and_last_names", id: "2" },
			{ choice: "3.  FirstAndLast", id: "3" },
			{ choice: "4. None of the above", id: "4" },
		],
		hit: "1",
	},
];

//var index to go through the array
var indexArray = 0;

//var for viewscores
var score = 0;

//var timer
var timer = 0;

//var array for highscores (array of objects)
var userHighScores = [];
if (localStorage.getItem("userHighScores") !== null) {
	userHighScores = JSON.parse(localStorage.getItem("userHighScores"));
}

//var to check if in the middle of the quiz when the time is close to 0 the user select something
var inProgress = false;


var startEl = document.querySelector("#start");
var sectionWelcome = document.querySelector("#welcome-modal");
var sectionQuiz = document.querySelector("#modal-section");
var questionEl = document.querySelector(".question-modal");
var optionsEl = document.querySelector(".options-modal");
var hitShow = document.querySelector(".hit");
var btnEl = document.createElement("BUTTON");
var modalDoneEl = document.querySelector("#modal-done");
var scoreEl = document.querySelector("#finalscore");
var submitEl = document.querySelector("#submit");
var timerEl = document.querySelector("#count");
var highscoresPageEl = document.querySelector("#highscoresPage");
var initialEl = document.querySelector("#initials");
var showInitialScores = document.querySelector("#scores-list");
var submitGobackEl = document.querySelector("#submitGoback");
var clearHighScoresEl = document.querySelector("#submitClear");
var showHighScoresCorner = document.querySelector("#view-scores-id");

function startQuiz() {
	//reset quiz variables
	indexArray = 0;
	score = 0;
	inProgress = true;
	timer = 80;
	showHighScoresCorner.setAttribute("disabled", "true");

	quizTimer();
	//hidden the section when the button is pressed
	sectionWelcome.classList.remove("d-flex");
	sectionWelcome.classList.add("d-none");

	//show the sectionQuiz with the add class d-flex
	sectionQuiz.classList.add("d-flex");
	//remove the sectionQuiz with the remove class d-none
	sectionQuiz.classList.remove("d-none");
	showPage();
}

/**
 * clean the page after start button is pressed
 */
function cleanPage() {
	// if (indexArray >= 0) {
	questionEl.textContent = "";
	optionsEl.textContent = "";
	hitShow.textContent = "";

	if (showCornerScores) {
		sectionWelcome.classList.remove("d-flex");
		sectionWelcome.classList.add("d-none");
		modalDoneEl.classList.remove("d-flex");
		modalDoneEl.classList.add("d-none");
	} else {
		return;
	}
	// }
}

function showPage() {
	if (!inProgress || indexArray === quizArray.length) return;
	//add a margin-bottom to the questions
	questionEl.classList.add("mb-3");
	//show the question
	questionEl.textContent = quizArray[indexArray].question;

	for (let a = 0; a < quizArray[indexArray].answers.length; a++) {
		var btnEl = document.createElement("BUTTON");
		btnEl.classList.add("btn", "btn-info", "px-5", "mb-3", "mt-2", "text-left");
		btnEl.textContent = quizArray[indexArray].answers[a].choice;
		optionsEl.classList.add("d-flex", "flex-column");
		optionsEl.appendChild(btnEl);
		if (quizArray[indexArray].answers[a].id === quizArray[indexArray].hit) {
			btnEl.addEventListener("click", timeDelayCorrect);
		} else {
			btnEl.addEventListener("click", timeDelayWrong);
		}
	}
}

function timeDelayCorrect() {
	score++;
	indexArray++;
	cleanPage();
	hitShow.classList.add("mt-4");
	hitShow.textContent = "Rigth!";
	showPage();
}

function timeDelayWrong() {
	timer = timer - 10;
	indexArray++;
	cleanPage();
	hitShow.classList.add("mt-4");
	hitShow.textContent = "Wrong!";
	showPage();
}

function quizTimer() {
	var timeId = setInterval(() => {
		timer = timer - 1;

		if (timer < 0) timer = 0;

		timerEl.textContent = timer;

		if (timer <= 0 || indexArray === quizArray.length) {
			clearInterval(timeId);
			completeQuiz();
		}
	}, 1000);
}

function completeQuiz() {
	timer = 0;
	inProgress = false;
	cleanPage();
	showHighScoresCorner.removeAttribute("disabled");
	modalDoneEl.classList.remove("d-none");
	modalDoneEl.classList.add("d-flex");
	scoreEl.textContent = score;

	if (initialEl.value !== "") {
		initialEl.value = "";
	}
}

function saveInitialScore() {
	//getting the input and removing the outside spaces
	var initialValue = initialEl.value.trim();

	//force the user to enter the initial
	if (
		initialValue !== "" &&
		typeof initialEl.value === "string" &&
		initialValue.toLowerCase().match(/^[a-z]+$/)
	) {
		userHighScores.push({ initials: initialValue, score: score });
		localStorage.setItem("userHighScores", JSON.stringify(userHighScores));

		//clean the page before highscores display page
		modalDoneEl.classList.add("d-none");
		modalDoneEl.classList.remove("d-flex");

		// show the new page for highcores
		showHighscores();
	} else {
		alert("you must to enter your initials to save your score!");
	}
}

function showHighscores() {
	highscoresPageEl.classList.remove("d-none");
	highscoresPageEl.classList.add("d-flex");

	showInitialScores.textContent = "";

	for (let i = 0; i < userHighScores.length; i++) {
		var divEl = document.createElement("div");
		divEl.classList.add("card", "initial-score", "pl-2", "shadow-sm", "mb-2");
		divEl.textContent =
			i +
			1 +
			". " +
			userHighScores[i].initials +
			" - " +
			userHighScores[i].score;
		showInitialScores.appendChild(divEl);
	}
}

function goBack() {
	timer = 0;
	timerEl.textContent = timer;

	highscoresPageEl.classList.add("d-none");
	highscoresPageEl.classList.remove("d-flex");
	sectionWelcome.classList.add("d-flex");
}

function clearScores() {
	userHighScores.splice(0, userHighScores.length);
	localStorage.removeItem("userHighScores");
	showInitialScores.textContent = "";
}

function showCornerScores() {
	cleanPage();
	showHighscores();
}

// all event here
startEl.addEventListener("click", startQuiz);
submitEl.addEventListener("click", saveInitialScore);
submitGobackEl.addEventListener("click", goBack);
clearHighScoresEl.addEventListener("click", clearScores);
showHighScoresCorner.addEventListener("click", showCornerScores);
