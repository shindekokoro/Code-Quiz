// Declare Variables
var startContainer = document.getElementById("start");
var questionContainer = document.getElementById("question");
var timerContainer = document.getElementById("time-remaining");
var resultsContainer = document.getElementById("results");

var questions = []
var timeRemaining = 76;
var currentQuestion = 0;
var score = 0;
var scoreLog = {};

// Get references to the #generate element
var startBtn = document.querySelector("#start");

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
  });

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

// Get Results and Store data
function getResults(){
  clearContainers();
  resultsContainer.style.display = "block";
  resultsContainer.style.padding = "30px 20px 0px 20px";
  console.log(resultsContainer);
  // console.log(resultsContainer.getElementById("final-score"));
}

function clearContainers(){
  startContainer.style.display = "none";
  questionContainer.style.display = "none";
  resultsContainer.style.display = "none";
}

// Add event listener to start button
startBtn.addEventListener("click", startQuiz);

// Event listener for answer selection
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
        score++;
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
      getResults();
    } else {
      getQuestionCard(currentQuestion);
    }
   
  }
});