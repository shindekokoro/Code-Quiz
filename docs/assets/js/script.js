// Declare Variables
var start = document.getElementById("start");
var question = document.getElementById("question");
var results = document.getElementById("results");
var currentQuestion = 0;
var score = 0;

var questions = [
  {
    title: "Commonly used data types DO NOT include:",
    choices: ["strings", "booleans", "alerts", "numbers"],
    correct: 3
  },
  {
    title: "The condition in an if / else statement is enclosed with ______.",
    choices: ["quotes", "curly brackets", "parenthesis", "square brackets"],
    correct: 3
  },
  {
    title: "Arrays in JavaScript can be used to store ______.",
    choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    correct: 4
  },
  {
    title: "String values must be enclosed within ______ when being assigned to variables.",
    choices: ["commas", "curly brackets", "quotes", "parenthesis"],
    correct: 3
  },
  {
    title: "A very useful tool used during development and debugging for printing content to the debugger is:",
    choices: ["JavaScript", "terminal/bash", "for loops", "console.log"],
    correct: 4
  }
]

// Get references to the #generate element
var startBtn = document.querySelector("#start");

function startQuiz() {
  var timeRemaining = 26;
  var timer = setInterval(() => {
    timeRemaining = timeRemaining - 1;
    var timerContainer = document.getElementById("time-remaining");
    timerContainer.textContent = timeRemaining;

    if(timeRemaining < 1){
      question.style.display = "none";
      getResults();
      clearInterval(timer);
    }
  }, 1000);

  start.style.display = "none";
  question.style.display = "block";
  question.style.padding = "30px 20px 0px 20px";
  getQuestionCard(currentQuestion);
}

function getQuestionCard(questionNumber) {
  // Get the correct elements on the page to change.
  var questionCard = document.getElementById("question");
  var cardHeader = questionCard.getElementsByClassName("card-header")[0];
  var cardBody = questionCard.getElementsByClassName("card-body")[0];

  var questionTitle = questions[questionNumber].title;
  var questionChoices = questions[questionNumber].choices;
  var correctQuestion = questions[questionNumber].correct;
  
  // Question Header
  var h2 = document.createElement('h2');
  h2.textContent = questionTitle;
  cardHeader.replaceChildren(h2);


  // Question List and List Items
  var ol = document.createElement("ol");
  ol.setAttribute("id", "question" + questionNumber);
  cardBody.replaceChildren(ol);
  questionChoices.forEach( (choice, index) => {
      var li = document.createElement("li");
      if(correctQuestion === (index + 1)){
        li.setAttribute("class","correct");
      } else {
        li.setAttribute("class","choice");
      }
      ol.appendChild(li);
      li.innerHTML = li.innerHTML + choice;
  });
}

function getResults(){
  results.style.display = "block";
  results.style.padding = "30px 20px 0px 20px";
}

// Add event listener to start button
startBtn.addEventListener("click", startQuiz);

// Add event listener for wrong answer
// Add event listener for correct answer
question.addEventListener("click", event => {
  var selected = event.target;

  if(selected.matches("li")){
    var choice = selected.getAttribute("class");

    switch (choice) {
      case "correct":
        alert("Correct!");
        score++;
        break;
      default:
        alert("Wrong!");
        score--;
        break;
    }
    
  }
  console.log(score);
  console.log(currentQuestion);
  currentQuestion = currentQuestion + 1;
  getQuestionCard(currentQuestion);
  console.log(currentQuestion);
});

