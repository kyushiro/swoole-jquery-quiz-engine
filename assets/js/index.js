var quiz_url = $('body').data('quiz-url');

$.getJSON(quiz_url,function(json){
  console.log('we have the questions json');
  console.log(json);
  console.log('now we convert it to the format used by our friend $.quiz below');
});

$('#quiz').quiz({
  //resultsScreen: '#results-screen',
  //counter: false,
  //homeButton: '#custom-home',
  counterFormat: 'Question %current of %total',
  questions: [
    {
      'q': 'Is jQuery <strong>required</strong> for this plugin?',
      'options': [
        'Yes',
        'No'
      ],
      'correctIndex': 0,
      'correctResponse': 'Good job, that was obvious.',
      'incorrectResponse': 'Well, if you don\'t include it, your quiz won\'t work'
    },
    {
      'q': 'How do you use it?',
      'options': [
        'Include jQuery, that\'s it!',
        'Include jQuery and the plugin javascript.',
        'Include jQuery, the plugin javascript, the optional plugin css, required markup, and the javascript configuration.'
      ],
      'correctIndex': 2,
      'correctResponse': 'Correct! Sounds more complicated than it really is.',
      'incorrectResponse': 'Come on, it\'s not that easy!'
    },
    {
      'q': 'The plugin can be configured to require a perfect score.',
      'options': [
        'True',
        'False'
      ],
      'correctIndex': 0,
      'correctResponse': 'You\'re a genius! You just set allowIncorrect to true.',
      'incorrectResponse': 'Why you have no faith!? Just set allowIncorrect to true.'
    },
    {
      'q': 'How do you specify the questions and answers?',
      'options': [
        'MySQL database',
        'In the HTML',
        'In the javascript configuration'
      ],
      'correctIndex': 2,
      'correctResponse': 'Correct! Refer to the documentation for the structure.',
      'incorrectResponse': 'Wrong! Do it in the javascript configuration. You might need to read the documentation.'
    },

    {
        "q" : "Given this:<br>"+
        "<img src='http://thomasburleson.github.io/angularjs-Quizzler/assets/data/images/q1_1.jpg' /><p>Which message will be returned by injecting this service and executing 'myService.getMessage()'?</p>",
        "options"  : [
            "Message one!",
            "Message two!",
            "Message three!"
        ],
      "correctIndex"   : 2,
      'correctResponse': 'Correct! Refer to the documentation for the structure.',
      'incorrectResponse': 'Wrong! Do it in the javascript configuration. You might need to read the documentation.'

    },
    {
      "q" : "Given <div id='outer'><div class='inner'></div></div>, which of these two is the most performant way to select the inner div ?",
      "options"  : [
          "getElementById('outer').children[0]",
          "getElementsByClassName('inner')[0]"
      ],
      "correctIndex"   : 0,
      'correctResponse': 'Correct! Refer to the documentation for the structure.',
      'incorrectResponse': 'Wrong! Do it in the javascript configuration. You might need to read the documentation.'

    }

  ]
});