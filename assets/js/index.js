var quiz_url = $('body').data('quiz-url');
var questions = [];

var ws = new WebSocket("ws:/ws-devcon.cf:1995");


$.getJSON(quiz_url,function(json){
  console.log('we have the questions json');
  console.log(json);
  console.log('now we convert it to the format used by our friend $.quiz below');
  questions = json;

  $('#quiz').quiz({
    //resultsScreen: '#results-screen',
    //counter: false,
    //homeButton: '#custom-home',
    counterFormat: 'Question %current of %total',
    questions: questions
  });
});