;(function ($, window, document, undefined) {

  'use strict';

  $.quiz = function (el, options) {
    var base = this;
    var submissions = [];
    var timeStart = 0;

    // Access to jQuery version of element
    base.$el = $(el);

    // Add a reverse reference to the DOM object
    base.$el.data('quiz', base);

    base.options = $.extend($.quiz.defaultOptions, options);

    var questions = base.options.questions,
      numQuestions = questions.length,
      startScreen = base.options.startScreen,
      startButton = base.options.startButton,
      homeButton = base.options.homeButton,
      resultsScreen = base.options.resultsScreen,
      gameOverScreen = base.options.gameOverScreen,
      currentQuestion = 1,
      score = 0,
      answerLocked = false;

    base.methods = {
      init: function () {
        base.methods.setup();

        $(document).on('click', startButton, function (e) {
          e.preventDefault();
          alert(ws);
          base.methods.start();
        });

        $(document).on('click', homeButton, function (e) {
          e.preventDefault();
          base.methods.home();
        });

        $(document).on('click', '.answers a', function (e) {
          e.preventDefault();
          base.methods.answerQuestion(this);
        });

        $(document).on('click', '#quiz-next-btn', function (e) {
          e.preventDefault();
          base.methods.nextQuestion();
        });

        $(document).on('click', '#quiz-finish-btn', function (e) {
          e.preventDefault();
          base.methods.finish();
        });


      },
      setup: function () {
        var quizHtml = '';

        if (base.options.counter) {
          quizHtml += '<div id="quiz-counter"></div>';
        }

        quizHtml += '<div id="questions">';
        $.each(questions, function (i, question) {
          quizHtml += '<div class="question-container">';
          quizHtml += '<p class="question">' + question.q + '</p>';
          quizHtml += '<ul class="answers">';
          $.each(question.options, function (index, answer) {
            quizHtml += '<li><a href="#" data-index="' + index + '">' + answer + '</a></li>';
          });
          quizHtml += '</ul>';
          quizHtml += '</div>';
        });
        quizHtml += '</div>';

        // if results screen not in DOM, add it
        if ($(resultsScreen).length === 0) {
          quizHtml += '<div id="' + resultsScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-results"></p>';
          quizHtml += '</div>';
        }

        quizHtml += '<div id="quiz-controls">';
        quizHtml += '<p id="quiz-response"></p>';
        quizHtml += '<div id="quiz-buttons">';
        quizHtml += '<a href="#" id="quiz-next-btn">Next</a>';
        quizHtml += '<a href="#" id="quiz-finish-btn">Finish</a>';
        quizHtml += '</div>';
        quizHtml += '</div>';

        base.$el.append(quizHtml).addClass('quiz-container quiz-start-state');

        $('#quiz-counter').hide();
        $('.question-container').hide();
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
      },
      start: function () {
        var textEnterEmail = $(".text-email");
        var textSubTitle = $(".sub-title");
        var email = $("#txt-email-input").val();
        var emailValidationExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;


        textEnterEmail.show();

        if (emailValidationExp.test(email)) {
          textEnterEmail.hide();
          textSubTitle.html("Do your best!");
          timeStart = new Date().getTime();
        }
        else if (email == "") {
          $(".data-email-input").html('<p class="text-center text-danger">Please enter your email.</p>');
          return;
        }
        else {
          swal({
            title: 'Invalid email address.',
            type: 'warning',
            text: 'Please enter valid email address.',
            timer: 2000
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {
                console.log('I was closed by the timer')
              }
            }
          );
          return false;
        }

        $('.data-email-input').html(email);
        $("#txt-email-input").hide();
        base.$el.removeClass('quiz-start-state').addClass('quiz-questions-state');
        $(startScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-finish-btn').hide();
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();
      },
      answerQuestion: function (answerEl) {
        if (answerLocked) {
          return;
        }
        answerLocked = true;

        var $answerEl = $(answerEl),
          response = '',
          selected = $answerEl.data('index'),
          currentQuestionIndex = currentQuestion - 1,
          correct = questions[currentQuestionIndex].correctIndex;

        submissions.push(selected);

        if (selected === correct) {
        //   $answerEl.addClass('correct');
          response = "Thank you for taking this quiz :) Click the button below to submit your results"; // questions[currentQuestionIndex].correctResponse;
          score++;
        } else {
        //   $answerEl.addClass('incorrect');
          response = "Thank you for taking this quiz :) Click the button below to submit your results"; //questions[currentQuestionIndex].incorrectResponse;
          if (!base.options.allowIncorrect) {
            base.methods.gameOver(response);
            return;
          }
        }


        if (!(currentQuestion + 1 > numQuestions))
          return base.methods.nextQuestion();

        $('#quiz-response').html(response);
        $('#quiz-controls').fadeIn();

        if (typeof base.options.answerCallback === 'function') {
          base.options.answerCallback(currentQuestion, selected === correct);
        }

      },
      nextQuestion: function () {
        answerLocked = false;

        $('.active-question')
          .hide()
          .removeClass('active-question')
          .next('.question-container')
          .show()
          .addClass('active-question');

        $('#quiz-controls').hide();

        // check to see if we are at the last question
        if (++currentQuestion === numQuestions) {
          $('#quiz-next-btn').hide();
          $('#quiz-finish-btn').show();
        }

        base.methods.updateCounter();

        if (typeof base.options.nextCallback === 'function') {
          base.options.nextCallback();
        }
      },
      gameOver: function (response) {
        // if gameover screen not in DOM, add it
        if ($(gameOverScreen).length === 0) {
          var quizHtml = '';
          quizHtml += '<div id="' + gameOverScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-gameover-response"></p>';
          quizHtml += '<p><a href="#" id="quiz-retry-btn">Retry</a></p>';
          quizHtml += '</div>';
          base.$el.append(quizHtml);
        }
        $('#quiz-gameover-response').html(response);
        $('#quiz-counter').hide();
        $('#questions').hide();
        $(gameOverScreen).show();
      },
      finish: function () {
        base.$el.removeClass('quiz-questions-state').addClass('quiz-results-state');
        $('.active-question').hide().removeClass('active-question');
        $('#quiz-counter').hide();
        $('#quiz-response').hide();
        $('#quiz-finish-btn').hide();
        $('#quiz-next-btn').hide();
        $(resultsScreen).show();
        $('#quiz-results').html('Your results have been submitted! Please wait while everyone is completed the quiz');

        var timeEnd = new Date().getTime();

        var submitDict = {};
        submitDict['answers'] = submissions;
        submitDict['start'] = timeStart;
        submitDict['end'] = timeEnd;
        submitDict['email'] = $('.data-email-input').html();
        submitDict['level'] = $('body').data('quiz-level');

        console.log(submitDict);

        $.post("submit.php", submitDict, function (r) {
          console.log("inside post");
          console.log(r);
        });

        if (typeof base.options.finishCallback === 'function') {
          base.options.finishCallback();
        }
      },
      restart: function () {
        base.methods.reset();
        base.$el.addClass('quiz-questions-state');
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();
      },
      reset: function () {
        answerLocked = false;
        currentQuestion = 1;
        score = 0;
        $('.answers a').removeClass('correct incorrect');
        base.$el.removeClass().addClass('quiz-container');
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-response').show();
        $('#quiz-next-btn').show();
        $('#quiz-counter').hide();
        $('.active-question').hide().removeClass('active-question');
      },
      home: function () {
        base.methods.reset();
        base.$el.addClass('quiz-start-state');
        $(startScreen).show();

        if (typeof base.options.homeCallback === 'function') {
          base.options.homeCallback();
        }
      },
      updateCounter: function () {
        var countStr = base.options.counterFormat.replace('%current', currentQuestion).replace('%total', numQuestions);
        $('#quiz-counter').html(countStr);
      }
    };

    base.methods.init();
  };

  $.quiz.defaultOptions = {
    allowIncorrect: true,
    counter: true,
    counterFormat: '%current/%total',
    startScreen: '#quiz-start-screen',
    startButton: '#quiz-start-btn',
    homeButton: '#quiz-home-btn',
    resultsScreen: '#quiz-results-screen',
    gameOverScreen: '#quiz-gameover-screen'
  };

  $.fn.quiz = function (options) {
    return this.each(function () {
      new $.quiz(this, options);
    });
  };
}(jQuery, window, document));