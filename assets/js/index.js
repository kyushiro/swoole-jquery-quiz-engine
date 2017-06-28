var quiz_url = $('body').data('quiz-url');
var questions = [];

var ws = new WebSocket("ws:/ws-devcon.cf:1995");

ws.onopen = function(){
  console.log("connected!")
  // send('get-quiz-data');
}

ws.onerror = function(){
  alert("Could not contact the quiz server, please try again");
};

ws.onmessage = function(e){
    console.log(e.data);
    alert(e.data);
    var obj = JSON.parse(e.data);
    obj = obj.payload;
    console.log(obj);

    if (obj.type="quiz-json"){
      questions = obj.payload;
      $('#quiz').quiz({
        //resultsScreen: '#results-screen',
        //counter: false,
        //homeButton: '#custom-home',
        counterFormat: 'Question %current of %total',
        questions: questions
      });
    }
};


function send(type, content) {
  msg = {'type': type};
  if (content) msg['payload'] = content;
  msg = JSON.stringify(msg);
  ws.send(msg);
}


// $.getJSON(quiz_url,function(json){
//   console.log('we have the questions json');
//   console.log(json);
//   console.log('now we convert it to the format used by our friend $.quiz below');
//   questions = json;


// });