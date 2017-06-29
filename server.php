<?php

Class Server
{
    Private $serv;
    private $file;


    Public Function __construct() {
        $this->Serv = New swoole_websocket_server("0.0.0.0", 1995);
        $this->file = "./results.json";
        $this->Serv->Set([
            'worker_num' => 4,
            'backlog' => 128,
            'max_request' => 150,
            'dispatch_mode'=>1,
        ]);

        $this->Serv->On('open', Array($this, 'onOpen'));
        $this->Serv->On('message', Array($this, 'onMessage'));
        $this->Serv->On('close', Array($this, 'onClose'));

        $this->Serv->Start();
    }

    Public function onOpen(swoole_websocket_server $server, $request){

        echo "server: handshake success with fd{$request->fd}\n\n";

    }



    Public function onMessage(swoole_websocket_server $server, $frame){
        echo "receive from {$frame->fd}: {$frame->data}, opcode:{$frame->opcode}, fin: {$frame->finish}\n";


        $submitted = json_decode($frame->data,true);

        if ($submitted['type'] == 'get-quiz-data'){
            $data = file_get_contents($submitted['payload']);
            $msg = ['type'=>'quiz-json', 'payload'=>json_decode($data)];
            $msg = json_encode($msg);
            return $server->push($frame->fd, $msg);
        }
        else if ($submitted['type'] == 'send-one-answer'){
            $file = 'assets/data/temp_results.json';
            $data = file_get_contents($file);
            $data = json_decode($data,true);
            echo "---\n";
            var_dump($submitted['payload']);

            $level = $submitted['payload']['level'];
            $email = $submitted['payload']['email'];

            if ( !isset($data[$level]) ) $data[$level] = [];
            if ( !isset($data[$level][$email]) ) $data[$level][$email] = [];
            if ( !isset($data[$level][$email]['score']) ) $data[$level][$email]['score'] = 0;
            
            $res = [];

            if ($submitted['payload']["chosen_answer"] == $submitted['payload']["correct_answer"]){
                echo "yay, a good answer from $email";
                $data[$level][$email]['score'] = $data[$level][$email]['score'] +1;
                $res['isCorrect'] = 1;
            } else $res['isCorrect'] = 0;

            $res['question'] = $submitted['payload']["question"];
            $res['answer'] = $submitted['payload']["chosen_answer"];


            $data[$level][$email] []= $res;
            $newjson = json_encode($data);

            file_put_contents($file,$newjson);
    
        }


        



        
        // if(array_key_exists($frame->data,$data)) $data[$frame->data] = $data[$frame->data] + 1;
        // else $data[$frame->data] = 1;

        // $enc_data = json_encode($data);

        // foreach($server->connections as $fd){
        //     $server->push($fd, $enc_data);
        // }
        // file_put_contents($this->file, $enc_data);

    }


    Public function OnClose( $serv, $fd, $from_id ) {
        Echo "Client{$fd}Connection close\n";
    }
}
echo "starting server...";

$server = New Server();
echo "serving...";