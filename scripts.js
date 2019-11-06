const STORE = {
  score : 0,
  questionNumber : 1,
  questionPool : [], //an array of 50 indexes
  stateName : '',
  statecapitol : '',
  listOfCities : [],
};

function app() {
  listenForQuizStart();
  listenForSubmit();
  listenForContinue();
  listenForRestart();
}

function listenForQuizStart() {
  $('.js-start-button').click(function() {
    resetStats();
    renderQuiz();
  });
}

function resetStats() {
  STORE.score = 0;
  STORE.questionNumber = 1;
  resetQuestionPool();
}

function resetQuestionPool() {
  for (let i = 0; i < 50; i++) {
    STORE.questionPool.push(i);
  }
  shuffle(STORE.questionPool);
}

function renderQuiz() {
  generateQuestion(STORE.questionPool.pop());
  renderHeader();
  renderQuestion();
}

function generateQuestion(index) {
  //store the current state name & capitol
  STORE.stateName = stateCapitols[index].state;
  STORE.statecapitol = stateCapitols[index].capitol;

  //clear out previous list of cities and add current state capitol to list
  STORE.listOfCities = [];
  STORE.listOfCities.push(STORE.statecapitol);

  //grab the current list of cities
  let currentCities = stateCapitols[index].cities;

  //add 4 random cities to the list of cities
  while(STORE.listOfCities.length < 5) {
    let randomCity = currentCities[Math.floor(Math.random() * currentCities.length)];
    if (!STORE.listOfCities.find(city => city === randomCity)) {
      STORE.listOfCities.push(randomCity);
    }
  }
  shuffle(STORE.listOfCities);
}

//Fisher-Yates shuffle:
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderHeader() {
  //show header if previously hidden
  $('header').show();
  $('header').html(`
    <div class="header col-12">
      <span class="question-number">Question: ${STORE.questionNumber}</span>
      <span class="score">Score: ${STORE.score}</span>
    </div>
  `);
}

function renderQuestion() {
  $('main').html(`
    <form class="q-a-form">
      <fieldset class="js-fieldset" name="answer-choices">
        <legend class="default-text-size centered">What is the state capitol of ${STORE.stateName}?</legend>
      </fieldset>
      <button type="submit" class="js-submit-button submit-button">Submit</button>
    </form>
  `);
  let answerChoices = [];
  for(let i = 0; i < 5; i++) {
    answerChoices.push(`
      <input type="radio" name="city-options" id="answer-city-${i}" value="${STORE.listOfCities[i]}">
      <label for="answer-city-${i}">${STORE.listOfCities[i]}</label><br>
    `);
  }
  $('.js-fieldset').append(answerChoices);
}

function listenForSubmit() {
  $('main').on('click', '.js-submit-button', function(event) {
    event.preventDefault();
    let submittedAnswer = $('input[name="city-options"]:checked').val();
    if(submittedAnswer === STORE.statecapitol) {
      STORE.score++;
    }
    renderHeader();
    renderFeedback(submittedAnswer);
  });
}

function renderFeedback(submittedAnswer) {
  //correctAnswer will be a boolean
  let correctAnswer = submittedAnswer === STORE.statecapitol;
  $('main').html(`
    <h1>${correctAnswer ? "Correct" : "Wrong"}</h1>
    <img class="capitol-img" src="./icons/${STORE.stateName}.jpg" alt="The state flag of ${STORE.stateName}">
    <p class="default-text-size">${STORE.statecapitol} is the state capitol of ${STORE.stateName}.</p>
    <button class="js-continue-button">Continue</button>
  `);
}

function listenForContinue() {
  $('main').on('click', '.js-continue-button', function() {
    if(STORE.questionNumber === 50) {
      renderEndScreen();
    } else {
      STORE.questionNumber++;
      renderQuiz();
    }
  });
}

function renderEndScreen() {
  $('header').hide();
  $('main').html(`
    <h1>You finished!</h1>
    <p class="default-text-size">You got ${STORE.score} out of 50 correct!</p>
    <img class="uncle-sam" src="./icons/uncle-sam.jpeg" alt="Uncle Sam character">
    <p class="default-text-size">Would you like to try again?</p>
    <button class="restart-button">Restart</button>
  `);
}

function listenForRestart() {
  $('main').on('click', '.restart-button', function(event) {
    resetStats();
    renderQuiz();
  });
}

$(app);