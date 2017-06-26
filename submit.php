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

    var_dump($correctAnswers);
    echo " // ";
    var_dump($submissions);

    $email = $_POST["email"];
    $data[$email] = [];