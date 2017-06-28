var quiz_url = $('body').data('quiz-url');


var ws = new WebSocket("ws:/ws-devcon.cf:1995");

ws.onopen = function(){
  console.log("connected!")
  // send('get-quiz-data');
}

ws.onerror = function(){
  alert("Could not contact the quiz server, please try again");
};

ws.onmessage = function(e){

    var obj = JSON.parse(e.data);
    // obj = obj.payload;

    var questions = [];

    if (obj.type=="quiz-json"){
      console.log(obj);
      questions = obj.payload;
      console.log(questions);
      $('#quiz').quiz({
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