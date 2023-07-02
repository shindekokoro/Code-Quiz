// Create Button Variables
var startGame = document.querySelector("#startButton");
var submitInitials = document.querySelector("#submitButton");
var viewHighScores = document.querySelector("header").querySelector("a");
var goBack = document.querySelector("#goBack");
var clearScores = document.querySelector("#clearScores")

// Create Container Variables
var startContainer = document.getElementById("start");
var questionContainer = document.getElementById("question");
var resultsContainer = document.getElementById("results");
var scoreContainer = document.getElementById("high-score");
var timerContainer = document.getElementById("time-remaining");

// Global Variables
var questions = []
var scoreValue = 0;
var timeRemaining = 76;
var currentQuestion = 0;
var score = 0;

// Load score log from local storage, if it doesn't exist create empty array.
var scoreLog = localStorage.scoreLog ? JSON.parse(localStorage.scoreLog) : [];

function clearContainers(){
  startContainer.style.display = "none";
  questionContainer.style.display = "none";
  resultsContainer.style.display = "none";
  scoreContainer.style.display = "none";
}

// Add Event listener for viewing HighScores
viewHighScores.addEventListener("click", getHighScore)

// Add event listener to start button
startGame.addEventListener("click", startQuiz);
async function startQuiz() {
  var timerInterval = setInterval(() => {
    timeRemaining = timeRemaining - 1;
    timerContainer.textContent = timeRemaining;

    if(timeRemaining < 1){
      timerContainer.textContent = "GAME OVER";
      getResults();
      clearInterval(timerInterval);
    }
  }, 1000);

  // Import questions from external JSON
  questions = await fetch("assets/js/questions.json")
  .then(response => {
    return response.json();
  }).catch( console.error() );

  // Set score value out of 100%
  scoreValue = ( 100 / questions.length );

  // If starting a new game within current session reset variables
  if(currentQuestion !== 0){
    timeRemaining = 76;
    currentQuestion = 0;
    score = 0;
    questionContainer.getElementsByClassName("card")[0].getElementsByClassName("card-footer")[0].textContent = "";
  }  

  clearContainers();
  questionContainer.style.display = "block";
  questionContainer.style.padding = "30px 20px 0px 20px";
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
  var ul = document.createElement("ul");
  ul.setAttribute("id", "question" + questionNumber);
  cardBody.replaceChildren(ul);
  questionChoices.forEach( (choice, index) => {
      var li = document.createElement("li");
      if(correctQuestion === (index + 1)){
        li.setAttribute("class","correct");
      } else {
        li.setAttribute("class","choice");
      }
      ul.appendChild(li);
      li.innerHTML = li.innerHTML + choice;
  });
}

// Event listener(s) for answer selection
// Points added for correct choice,
// time taken away for incorrect choice.
questionContainer.addEventListener("click", event => {
  var selected = event.target;

  if(selected.matches("li")){
    var choice = selected.getAttribute("class");
    var answerText = "";
    switch (choice) {
      case "correct":
        answerText = "Correct!";
        score = score + scoreValue;
        break;
      default:
        answerText = "Wrong!";
        timeRemaining--;
        break;
    }
    var answer = document.createElement("div")
    answer.setAttribute("class", "card-footer")

    var footer = questionContainer.getElementsByClassName("card")[0].getElementsByClassName("card-footer")[0];
    if(!footer){
      questionContainer.getElementsByClassName("card")[0].appendChild(answer);
    }else {
      answer = questionContainer.getElementsByClassName("card")[0].getElementsByClassName("card-footer")[0];
    }
    
    answer.textContent = answerText;

    currentQuestion = currentQuestion + 1;
    if(currentQuestion > questions.length-1){
      timeRemaining = 0;
      // Add footer to final results
      resultsContainer.getElementsByClassName("card")[0].appendChild(answer);
      getResults();
    } else {
      getQuestionCard(currentQuestion);
    }
   
  }
});

// Get and display results
// Start Event listener
function getResults(){
  clearContainers();
  resultsContainer.style.display = "block";
  resultsContainer.style.padding = "30px 20px 0px 20px";
  
  // Write text of FinalScore no need for variables, only used once.
  document.getElementById("final-score").textContent = score;

  // Event listener for end of game score input
  // If the user "clicks"  or presses the "Enter" key on the keyboard
  submitInitials.addEventListener("click", getHighScore);
  submitInitials.addEventListener("keypress", event => {
    if (event.key === "Enter") {
      getHighScore(event);
    }
  });
}

function getHighScore(event) {
  if(event){
    event.preventDefault();
  }
  var initialsInput = document.querySelector("#initials");
  var initials = initialsInput.value.toUpperCase().slice(0,2);
  
  // Only add value to log if there is a value.
  if (initials){
    scoreLog.push( { name: initials, points: score } );
    localStorage.scoreLog = JSON.stringify(scoreLog);

    // Points will remain stored and user can infinitely submit score.
    // Clear out value of initials to reset for another game.
    var clearInputs = document.querySelectorAll('input');
    clearInputs.forEach(input => input.value = '');
  }

  clearContainers();
  scoreContainer.style.display = "block";
  scoreContainer.style.padding = "30px 20px 0px 20px";
  displayHighScores();
}

function displayHighScores(){
  // Event Listener for Buttons in HighScore Container
  goBack.addEventListener("click", event => {
    return location.reload(true);
  });
  clearScores.addEventListener("click", event => {
    delete localStorage.scoreLog;
    scoreLog = [];
    alert("High Score Log Deleted From Browser!");
    displayHighScores();
  });

  var scoreCard = document.getElementById("high-score");
  var cardBody = scoreCard.getElementsByClassName("card-body")[0];

  // Score List and List Items
  var ol = document.createElement("ol");
  ol.setAttribute("id", "highScore");
  cardBody.replaceChildren(ol);

  scoreLog = scoreLog.sort(sortScoreLog("points"));
  scoreLog.forEach( (score, index) => {
      var li = document.createElement("li");
      li.setAttribute("class","userScore");
      ol.appendChild(li);
      li.innerHTML = li.innerHTML + score.name + " - " + score.points;
  });
}

// Sort Array by property value
// Returns sort in descending order so high score appears at top
function sortScoreLog(propertyName){  
  return function(a,b){  
     if(a[propertyName] > b[propertyName])  
        return -1;  
     else if(a[propertyName] < b[propertyName])  
        return 1;  
 
     return 0;  
  }  
}