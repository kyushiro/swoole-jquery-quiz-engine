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
        $data = file_get_contents('assets/data/quiz-b1.json');

        $msg = ['type'=>'quiz-json', 'payload'=>json_decode($data)];

        $msg = json_encode($msg);

        $server->push($request->fd, $msg);
    }



    Public function onMessage(swoole_websocket_server $server, $frame){
        echo "receive from {$frame->fd}: {$frame->data}, opcode:{$frame->opcode}, fin: {$frame->finish}\n";
        // $data = file_get_contents($this->file, FILE_USE_INCLUDE_PATH);
        // $data = json_decode($data,true);
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