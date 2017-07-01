var ws = new WebSocket("ws:/ws-devcon.cf:1995");
var online = false;

ws.onopen = function(){
  console.log("connected!");
  var level = $('body').data('quiz-level');
  send('get-quiz-data', level);
  online = true;
}

ws.onerror = function(){
  alert("Could not contact the quiz server, please try again");
};

ws.onmessage = function(e){

    var obj = JSON.parse(e.data);
    // obj = obj.payload;

    var questions = [];

    if (obj.type=="quiz-json"){
      questions = obj.payload;
      $('#quiz').quiz({
        counterFormat: 'Question %current of %total',
        questions: questions
      });
    }
    else if (obj.type=="close-quiz"){
      if(online){
          online = false;

          swal({
            title: 'Time out',
            type: 'warning',
            text: 'Oh noooo, you have run out of time :( Your current results are still being counted though ^^',
            timer: 30000
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {
                console.log('I was closed by the timer')
              }
            }
          );
      }

      thatsAllFolks();



    }
};

function thatsAllFolks(){
  $('body').fadeOut(15000);
}


function send(type, content) {
  msg = {'type': type};
  if (content) msg['payload'] = content;
  msg = JSON.stringify(msg);
  ws.send(msg);
}