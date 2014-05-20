
$(document).ready(function() {
    // Variables
    var $quiz = $('#game');
    var $questionArea = $('#questionArea');
    var $startGame = $('#startDiv');
    var $next = $('#next');
    var $previous = $('#previous');
    var $endGame = $('#quizResults');
    var $tryAgain = $('#tryAgain');
    var $startBtn = $("#startBtn");
    var $result = $('#result');
    var $questionTpl = $('#questionTpl');
    var _finishVal = "finish";
    var _nextVal = "next";
    var _disableClass = "ui-state-disabled";

    var quiz = {
        questionArray : [],
        userAnswers : [],
        currQuestion : 0,
        questionsNum : 0,
        init : function(){
            $startBtn.click(function( event ) {
                //If data has been load before render only
                if(quiz.questionArray.length > 0){
                    quiz.render();
                }
                //Get question data
                else{
                    quiz.questionArray = jsonObject.questions;
                    quiz.questionsNum = jsonObject.questions.length;
                    //Check that the json is not empty
                    if(quiz.questionsNum == 0) {
                        $quiz.html('<div class="fberrorbox">sorry there is no questions</div>');
                    }else{
                        quiz.render();
                        //When only one question
                        if (quiz.questionsNum == 1) {
                            $next.text(_finishVal);
                        }
                    }
                }

                //show hide components
                $previous.hide();
                $quiz.show();
                $startGame.hide();
            });
            //Previous button selected save user data and render
            $previous.click(function(event){
                quiz.saveUserAnswer();
                quiz.currQuestion--;
                //check if go to the first question
                if(quiz.currQuestion == 0){
                    $previous.hide();
                }
                //check if we where at the last question
                if($next.text() == _finishVal)
                {
                    $next.text(_nextVal)
                }
                quiz.render();
            });

            //Next button clicked - if last question getResult else get the next question
            $next.click(function(event){
                quiz.saveUserAnswer();
                //Finish - last question
                if(quiz.currQuestion == (quiz.questionsNum - 1))
                {
                    quiz.getResults();
                }
                //represent the next answer
                else{
                    //Check if curr question was the first show previous button
                    if(quiz.currQuestion == 0){
                        $previous.show();
                    }
                    quiz.currQuestion++;
                    //Promote to the last question
                    if(quiz.currQuestion == (quiz.questionsNum - 1)){
                        $(this).text(_finishVal);
                    }
                    quiz.render();
                }
            });
            //Try again button clicked reset data
            $tryAgain.click(function(){
                //Init values
                quiz.userAnswers = [];
                quiz.currQuestion = 0;
                $next.text(_nextVal);
                //Go back to the start div
                $startGame.show();
                $endGame.hide();
            })
        },
        question:{
            isSelected : function(){
                if(this.code == quiz.userAnswers[quiz.currQuestion]){
                    return true;
                }
                return false;
            }},
        render : function () {
            var templateQuestion = $questionTpl.html();
            $.each(quiz.questionArray[quiz.currQuestion],function(pKey,pVal){
                quiz.question[pKey] = pVal;
            })
            quiz.question.num = (quiz.currQuestion + 1);
            var html = Mustache.to_html(templateQuestion, quiz.question);
            $questionArea.html(html);

            //Value was selected enable next and put the value selected
            if(quiz.userAnswers[quiz.currQuestion] == null){
                $next.attr("disabled", true).addClass(_disableClass);
            }
            else{
                $next.attr("disabled", false).removeClass(_disableClass);
            }

            //Check if radio button was selected end enable the next button
            $('input:radio').on('change',function(event){
                $next.attr("disabled", false).removeClass(_disableClass);
            });
        },
        //Save user selected answer to user answer array
        saveUserAnswer : function(){
            var selected = $('input[type=radio]:checked:visible');
            //Add the selected value to the answers array
            quiz.userAnswers[quiz.currQuestion] = selected.attr('value');
        },
        //The result check- go over the question and user results array and check match
        getResults : function()
        {
            var score = 0;
            $.each(quiz.questionArray,function(pkey,question){
                if($.inArray(quiz.userAnswers[pkey], question.correctAnswers) > -1)
                {
                    score++;
                };})

            //Get result screen and data
            var result ={
                score : score,
                totalQuestions : quiz.questionsNum
            }
            //Create the result div
            var template = '<h3>Your score is {{score}} out of {{totalQuestions}}!</h3>'
            var html = Mustache.to_html(template, result);
            $result.html(html);
            $endGame.show();
            $quiz.hide();
        }
    };
    quiz.init();
});

