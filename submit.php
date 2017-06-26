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

    $interval = round(abs($end - $start) / 60,2);


    $email = $_POST["email"];

    echo "interval is $interval, ";
    echo "You have $score good answers and ";
    echo "you are $email";

    $data[$email] = [];