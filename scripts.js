const STORE = {
  score : 0,
  questionNumber : 1,
  questionPool : [],
  stateName : '',
  statecapitol : '',
  listOfCities : [],
};

function app() {
  listenForQuizStart();
  listenForFocusBehaivor();
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

//puts numbers 1 -> 49 randomly in an array so questions are pulled randomly
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
  preRenderFeedback();
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
  while(STORE.listOfCities.length <= 4) {
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
  $('header').show();
  $('header').html(`
    <div class="header col-12">
      <span class="question-number">Question: ${STORE.questionNumber}</span>
      <span class="score">Score: ${STORE.score}</span>
    </div>
  `);
}

function renderQuestion() {
  $('.feedback').hide();
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
  $('main').show();
}

function listenForSubmit() {
  $('main').on('click', '.js-submit-button', function(event) {
    event.preventDefault();
    let submittedAnswer = $('input[name="city-options"]:checked').val();
    if(submittedAnswer === STORE.statecapitol) {
      STORE.score++;
    }
    $('main').hide();
    renderHeader();
    renderFeedback(submittedAnswer);
  });
}

function preRenderFeedback() {
  $('.feedback').html(`
    <img class="capitol-img" src="./icons/${STORE.stateName}.jpg" alt="The state flag of ${STORE.stateName}">
    <p class="default-text-size"><em>${STORE.statecapitol}</em> is the state capitol of ${STORE.stateName}.</p>
    <button class="js-continue-button">Continue</button>
  `);
}

function renderFeedback(submittedAnswer) {
  $('main').hide();
  let correctAnswer = submittedAnswer === STORE.statecapitol;
  $('.feedback').prepend(`<h1>${correctAnswer ? "Correct!" : "Wrong!"}</h1>`);
  $('.feedback').show();
}

function listenForContinue() {
  $('.feedback').on('click', '.js-continue-button', function() {
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

function listenForFocusBehaivor() {
  $('main').on('focus', 'input[name=city-options]', function() {
    let radioId = $(this).attr('id');
    $(`label[for="${radioId}"]`).css({
      "background-color" : "#021876",
      "color" : "white",
      "transition" : "0.2s all linear"
    });
  });

  $('main').on('focusout', 'input[name=city-options]', function () {
    let radioId = $(this).attr('id');
    $(`label[for="${radioId}"]`).css({
      "background-color": "white",
      "color": "#021876",
      "transition": "0.1s all linear"
    });
  });
}

$(app);