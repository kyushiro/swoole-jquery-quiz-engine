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
            echo "fetching ".'assets/data/quiz-'.$submitted['payload'].'.json';
            $data = file_get_contents('assets/data/quiz-'.$submitted['payload'].'.json');
            echo "\n data is";
            var_dump($data);
            $msg = ['type'=>'quiz-json', 'payload'=>json_decode($data)];
            $msg = json_encode($msg);
            return $server->push($frame->fd, $msg);
        }
        else if ($submitted['type'] == 'send-one-answer'){
            $file = 'assets/data/temp_results.json';
            $data = file_get_contents($file);
            $data = json_decode($data,true);

            $level = $submitted['payload']['level'];
            $email = $submitted['payload']['email'];

            if ( !isset($data[$level]) ) $data[$level] = [];
            if ( !isset($data[$level][$email]) ) $data[$level][$email] = [];
            if ( !isset($data[$level][$email]['score']) ) $data[$level][$email]['score'] = 0;
            if ( !isset($data[$level][$email]['answers']) ) $data[$level][$email]['answers'] = [];
            
            $res = [];

            if ($submitted['payload']["chosen_answer"] == $submitted['payload']["correct_answer"]){
                echo "yay, a good answer from $email";
                $data[$level][$email]['score'] = $data[$level][$email]['score'] +1;
                $res['isCorrect'] = 1;
            } else $res['isCorrect'] = 0;

            $res['question'] = $submitted['payload']["question"];
            $res['answer'] = $submitted['payload']["chosen_answer"];


            $data[$level][$email]['answers'] []= $res;
            $newjson = json_encode($data);

            file_put_contents($file,$newjson);
    
        }
        else if ($submitted['type'] == 'finished'){
            $file = 'assets/data/temp_results.json';
            $data = file_get_contents($file);
            $data = json_decode($data,true);

            $level = $submitted['payload']['level'];
            $email = $submitted['payload']['email'];

            $start = (int)$submitted['payload']['start'];
            $end   = (int)$submitted['payload']['end'];

            $interval = round(abs($end - $start));

            $data[$level][$email]['finished'] = 1;
            $data[$level][$email]['duration'] = $interval;

            $newjson = json_encode($data);
            file_put_contents($file,$newjson);

            $toSend = ['type'=>'results-completed-only', 'payload'=>$data];
            $toSend = json_encode($toSend);

            echo "\n\n\n\n\n\n";
            echo $toSend;


            foreach($server->connections as $fd){
                $server->push($fd, $toSend);
            }            
        }


        else if ($submitted['type'] == 'fetch-results'){
            $file = 'assets/data/temp_results.json';
            $data = file_get_contents($file);
            $msg_container = ['type'=>'results-completed-only', 'payload'=>[]];
           
            $data = json_decode($data,true);
            
            foreach($data as $level=>$results){
                $msg_container['payload'][$level] = [];

                foreach ($results as $email=>$participant){
                    if (($submitted['payload']=='completed') && (!isset($participant['finished']))) continue;
                    $msg_container['payload'][$level][$email] = [];
                    $msg_container['payload'][$level][$email] []= $results[$email];
                }
            }

            $msg = json_encode($msg_container);

            return $server->push($frame->fd, $msg);

        }

        else if ($submitted['type'] == 'close-quiz'){
            $data = ['type'=>'close-quiz','payload'=>'ok'];
            foreach($server->connections as $fd){
                if ($fd != $frame->fd)
                    $server->push($fd, json_encode($data));
            }
        }

        // else if ($submitted['type'] == 'fetch-all'){
        //     $file = 'assets/data/temp_results.json';
        //     $data = file_get_contents($file);
        //     $msg_container = ['type'=>'results-completed-only', 'payload'=>[]];
           
        //     $data = json_decode($data,true);
            
        //     foreach($data as $level=>$results){
        //         $msg_container['payload'][$level] = [];

        //         foreach ($result as $email=>$participant){
        //             msg_container['payload'][$level] = [];
                    
        //             $msg_container['payload'][$level][$email] []= $result[$email];
        //         }
        //     }

        //     $msg = json_encode($msg_container);

        //     return $server->push($frame->fd, $msg);

        // }


    }


    Public function OnClose( $serv, $fd, $from_id ) {
        Echo "Client{$fd}Connection close\n";
    }
}
echo "starting server...";

$server = New Server();
echo "serving...";