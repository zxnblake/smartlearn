var studyMgmtController = angular.module('smartlearn.studyMgmtController', ['smartlearn.services']);

studyMgmtController.controller('studyMgmtCtrl', ['$scope', 'smartLearnService', '$compile',
	function($scope, smartLearnService, $compile)
	{
        var TASK_TYPE_CHALLENGE = 'challenge';
        var TASK_TYPE_HOMEWORK = 'homework';

		$scope.currUser = '';
		$scope.homeworkList = [];
        $scope.subject = "数学";
        $scope.subjectLevels = [];
        $scope.currLevel = {};
        $scope.challengeLevel = '1';
        $scope.taskQuestions = [];
        $scope.userAssessment = {};
        $scope.userSubjLevel = '';
        $scope.userSubjWeakPoints = '';

        $scope.notStarted = true;
        $scope.startedTime = "";
        $scope.timeUsed = "";
        $scope.timeUsedStr = "0 分 0 秒";

        $scope.homeworkHistoryDialog = angular.element('#homeworkHistoryDialog');
        $scope.taskDialog = angular.element('#taskDialog');
        $scope.selectLevelDialog = angular.element('#selectLevelDialog');
        $scope.dataReady = false;
    	$scope.isHistoryView = false;
    	$scope.challengeResultMsg = '';

        $scope.messageTitle = '消息';
        $scope.messageText = '错误出现，请检查！';

		$scope.dialogCompiled =
		{
			"#homeworkHistoryDialog" : null,
			"#taskDialog" : null,
			"#selectLevelDialog" : null,
			"#messageBox" : null
		};

        var timerVar = null;

        $scope.testTimer = function()
        {
            var currTime = new Date().getTime();
            var timepass = Math.floor((currTime - $scope.startedTime) / 1000);
            var minute = Math.floor(timepass / 60);
            var second = Math.floor(timepass % 60);
            $scope.timeUsedStr = minute + " 分 " + second + " 秒";
			var timeElement = document.getElementById('time_count');
            timeElement.innerText = "计时 : " + $scope.timeUsedStr;
            $scope.timeUsed = timepass;
        };

    	$scope.showHomeworkDialog = function()
	  	{
            $scope.taskDialogTitle = '今日作业';
            var sbjAssessMap = $scope.userAssessment['sbjAssessMap'];
            var homeworkLevel = sbjAssessMap[$scope.subject]['next_level'];
            $scope.createTask(TASK_TYPE_HOMEWORK, homeworkLevel);
	  	};

        $scope.selectLevel = function(level)
	  	{
    		$scope.currLevel = level;
            $scope.challengeLevel = level.level;
	  	};

        $scope.getBgColor = function(homework)
	  	{
    		var idx = $scope.homeworkList.indexOf(homework);
            if ( idx % 2 == 0 )
            {
                return 'blanchedalmond';
            }
            return 'honeydew';
	  	};

        $scope.startTask = function()
	  	{
    		$scope.notStarted = false;
            $scope.startedTime = new Date().getTime();
            timerVar = window.setInterval($scope.testTimer, 1000);
            var questions = $scope.taskQuestions.questions;
            for ( var i in questions )
            {
                var question = questions[i];
                var qid = question.question_id;
                var answerElement = document.getElementById('answer_' + qid);
                answerElement.disabled = false;
            }
	  	};

        $scope.correctError = function(question)
        {
            var qid = question.question_id;
            var answerElement = document.getElementById('answer_' + qid);
            var userAnswer = answerElement.value;
            var check_result_image = document.getElementById('image_result_'+qid);
            console.log('question.user_answer== ' + question.user_answer);
            if ( userAnswer == question.answer )
            {
                check_result_image.src = "images/correct.png";
                answerElement.disabled = true;
            }
        }

        $scope.completeTask = function()
	  	{
            var questions = $scope.taskQuestions.questions;
            // first we need check if all questions have been answered
            for ( var i in questions )
            {
                var question = questions[i];
                var qid = question.question_id;
                var answerElement = document.getElementById('answer_' + qid);
                var userAnswer = answerElement.value;
                if ( userAnswer == "" )
                {
                    $scope.messageTitle = '提示';
                    $scope.messageText = '题目未完成，请全部完成后再提交。不会的题目可以写 ？。';
                    window.parent.$('#messageDialog').modal('show');
                    return;
                }
            }
            var correctCount = 0;
            for ( var i in questions )
            {
                var question = questions[i];
                var qid = question.question_id;
                var answerElement = document.getElementById('answer_'+qid);
                var userAnswer = answerElement.value;
                question.user_answer = userAnswer;
                var check_result_image = document.getElementById('image_result_'+qid);
				check_result_image.style.visibility = "visible";
                if ( userAnswer != question.answer )
                {
                    question.correct = 'false';
                    check_result_image.src = "images/wrong.png";
                }
                else
                {
                    question.correct = 'true';
                    check_result_image.src = "images/correct.png";
                    correctCount++;
                    answerElement.disabled = true;
                }
            }

            $scope.taskQuestions.start_time = $scope.startedTime;
            $scope.taskQuestions.time_used = $scope.timeUsedStr;
            var questNum = $scope.taskQuestions.question_num;
            $scope.taskQuestions.score = Math.floor(correctCount / questNum * 100);

            window.clearInterval(timerVar);
			smartLearnService.submitResult($scope.taskQuestions,
				function(resp)
				{
					console.log("Result is submitted successfully!");
    	            $scope.isHistoryView = true;
                    if ( $scope.taskQuestions.type == TASK_TYPE_CHALLENGE )
                    {
                        if (resp.code == '1000')
                        {
                            $scope.messageText = '挑战成功！升到级别：' + $scope.taskQuestions.level + ' !';
                        }
                        else
                        {
                            $scope.messageText = '挑战失败';
                        }
                        window.parent.$('#messageDialog').modal('show');
                    }
				},
				function(err)
				{
					console.log("Error occurred when submitting result: " + err);
				}
			);
	  	};


        $scope.waitData = function()
        {
            if ( !$scope.dataReady && $scope.count < 5 )
            {
                $scope.count++;
                window.setTimeout($scope.waitData, 1000);
            }
        }

		$scope.dialogOnShown = function(evt)
		{
//            $scope.count = 0;
//            $scope.waitData();
            var dialog = '#' + evt.target.id;
//			if( $scope.dialogCompiled[dialog] == null )
//			{
//        		$scope.dialogCompiled[dialog] = true;
//
//        		var angularDomEl = angular.element( dialog );
//
//    			$compile(angularDomEl)( $scope );
//			}
//        	$scope.$apply();
//            $scope.dataReady = false;

            if ( dialog == '#selectLevelDialog' )
            {
                var levelId = $scope.currLevel.sbj_name + "_" + $scope.currLevel.level;
                var currLevelElement = document.getElementById(levelId);
                currLevelElement.checked = true
            }
            else if ( dialog == '#taskDialog' )
            {
                if ( $scope.isHistoryView )
                {
                    var questions = $scope.taskQuestions.questions;
                    for ( var i in questions )
                    {
                        var question = questions[i];
                        var qid = question.question_id;
                        var answerElement = document.getElementById('answer_'+qid);
                        var check_result_image = document.getElementById('image_result_'+qid);
                        check_result_image.style.visibility = "visible";
                        if ( question.user_answer != question.answer )
                        {
                            question.correct = 'false';
                            check_result_image.src = "images/wrong.png";
                            answerElement.disabled = false;
                        }
                        else
                        {
                            if ( i < 3 )
                            {
			                    console.log("set correct image: ");
                            }
                            question.correct = 'true';
                            check_result_image.src = "images/correct.png";
                            answerElement.disabled = true;
                        }
                    }
                }
            }

			console.log("dialog display: " + dialog);
		};

        $scope.disableLevel = function(level)
        {
            userLevel = sbjAssessMap[$scope.subject]['level'];
            if (userLevel >= level.level)
            {
                return true;
            }
            return false;
        };

        $scope.getSubjectLevels = function()
		{
			smartLearnService.getSubjLevels({subject: $scope.subject},
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.subjectLevels = resp.result;
    		            $scope.currLevel = $scope.subjectLevels[0];
                    }
                    else
                    {
                        console.log("Error occurred when getting levels: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when getting levels: " + err);
				}
			);
		};

		$scope.getUserAssessment = function()
		{
			smartLearnService.getUserAssessment({userName: $scope.currUser},
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.userAssessment = resp.result;
                        var sbjAssessMap = $scope.userAssessment['sbjAssessMap'];
                        $scope.userSubjLevel = sbjAssessMap[$scope.subject]['level'];
                        $scope.userSubjWeakPoints = sbjAssessMap[$scope.subject]['weak_points'];
                    }
                    else
                    {
                        console.log("Error occurred when getting user assessment: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when getting user assessment: " + err);
				}
			);
		};

        $scope.questionLeftSide = function(question)
        {
            var questions = $scope.taskQuestions.questions;
            var idx = questions.indexOf(question);
            var questNum = questions.length;
            return (idx < (questNum / 2));
        }

        $scope.questionRightSide = function(question)
        {
            var questions = $scope.taskQuestions.questions;
            var idx = questions.indexOf(question);
            var questNum = questions.length;
            return ( idx >= (questNum / 2) && idx < questNum );
        }

        $scope.createChallenge = function()
        {
            $scope.taskDialogTitle = '挑战级别 : ' + $scope.challengeLevel;
            window.parent.$('#selectLevelDialog').modal('hide');
            $scope.createTask(TASK_TYPE_CHALLENGE, $scope.challengeLevel)
        }

        $scope.createTask = function(taskType, level)
	  	{
            $scope.isHistoryView = false;
            $scope.timeUsedStr = "0 分 0 秒";
    		$scope.notStarted = true;
            var param = {userName: $scope.currUser, subject: $scope.subject,
                levelName: level, taskType: taskType};
			smartLearnService.createTask(param,
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.taskQuestions = resp.result;
                        $scope.dataReady = true;
                        var questNum = $scope.taskQuestions.questions.length;
                        console.log('question number = ' + questNum)
                        window.parent.$('#taskDialog').modal('show');
                    }
                    else
                    {
                        console.log("Error occurred when creating challenge: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when creating challenge: " + err);
				}
			);
	  	};

        $scope.showHomeworkHistoryDialog = function()
	  	{
            $scope.timeUsedStr = "0 分 0 秒";
            var param = {userName: $scope.currUser, subject: $scope.subject,
                taskType: TASK_TYPE_HOMEWORK};
			smartLearnService.getTaskHistory(param,
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.homeworkList = resp.result;
                        $scope.dataReady = true;
                        window.parent.$('#homeworkHistoryDialog').modal('show');
                    }
                    else
                    {
                        console.log("Error occurred when getting homework history list: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when getting homework history list: " + err);
				}
			);
	  	};

        $scope.showHomeworkDetail = function(homework)
	  	{
            $scope.isHistoryView = true;
            $scope.taskDialogTitle = '作业: ' + homework.date;
            var param = {taskId: homework.id};
			smartLearnService.getTaskQuestions(param,
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        homework.questions = resp.result;
                        $scope.taskQuestions = homework;
                        $scope.dataReady = true;
                        window.parent.$('#homeworkHistoryDialog').modal('hide');
                        window.parent.$('#taskDialog').modal('show');
                    }
                    else
                    {
                        console.log("Error occurred when getting homework history list: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when getting homework history list: " + err);
				}
			);
	  	};

    	$scope.testDialog = function()
	  	{
    		$('#testDialog').modal({'data-remote':'true'});
	  	};

    	$scope.setDialogOnShownFunc = function()
	  	{
            var dialogList = ['#selectLevelDialog', '#taskDialog', '#homeworkHistoryDialog'];
            for ( var i in dialogList )
            {
                var dialog = dialogList[i];
                var dialogElement = angular.element(dialog);
                dialogElement.on('shown.bs.modal',  $scope.dialogOnShown);
            }
	  	};

        $scope.checkUserLogin = function()
        {
            var userLogin = false;
			smartLearnService.login(
				function(resp)
				{
                    if ( resp.code == 0 )
                    {
                        userLogin = true;
                        $scope.currUser = resp.result;
                        var currUserElm = document.getElementById("currUser");
						currUserElm.innerHTML = $scope.currUser

						var regLoginBtnElm = document.getElementById("regLoginBtn");
						var logoutBtnElm = document.getElementById("logoutBtn");
						regLoginBtnElm.style.display = "none";
						logoutBtnElm.style.display = "block";
                        console.log("User already logged in.");

                        $scope.getUserAssessment();
                        $scope.getSubjectLevels();
                    }
                    else
                    {
                        console.log("User has not logged in yet.");
                    }
                    if ( !userLogin )
                    {
                        window.location.href = "#/login";
                    }
				},
				function(err)
				{
					console.log("Error occurred when user login: " + err);
				}
			);
        };

        $scope.checkUserLogin();
        $scope.setDialogOnShownFunc();
	}
]); 
