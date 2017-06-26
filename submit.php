<?php

    $filePath = "./assets/data/";

    $data = file_get_contents($filePath . "results.json");
    $data = json_decode($data, true);

    $answers = file_get_contents($filePath . "quiz.json");
    $answers = json_decode($answers, true);

    $correctAnswers = [];

    foreach ($answers as $answer){
        $correctAnswers[] = $answer["correctIndex"];

    }

    $submissions = $_POST["answers"];

    $score = 0;
    $i = 0;

    for($i; $i!=count($correctAnswers); $i++){
        if ($correctAnswers[$i] == $submissions[$i]) $score++;
    }

    $start = (int)$_POST['start'];
    $end = (int)$_POST['end'];

    $interval = round(abs($end - $start));


    $email = $_POST["email"];


    $UserResultArray = ['time taken' => $interval, 'score'=>$score];

    $data[$email] = $UserResultArray;

    $data = json_encode($data);
    var_dump($data);

    $badabouf = file_put_contents($filePath . "results.json");

    echo "1 - ".$badabouf;