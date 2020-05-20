var studyMgmtController = angular.module('smartlearn.studyMgmtController', ['smartlearn.services']);

studyMgmtController.controller('studyMgmtCtrl', ['$scope', 'smartLearnService', '$compile',
	function($scope, smartLearnService, $compile)
	{
        var TASK_TYPE_CHALLENGE = 'challenge';
        var TASK_TYPE_HOMEWORK = 'homework';
        var TASK_TYPE_ASSESS_TEST = 'assesstest';

		$scope.currUser = '';
		$scope.homeworkList = [];
        $scope.subject = "数学";
        $scope.subjectLevels = [];
        $scope.subjectGradeAndPoints = {};
        $scope.gradeList = [];
        $scope.currGrade = '';
        $scope.currPointList = [];
        $scope.selectedPoints = [];
        $scope.currLevel = {};
        $scope.challengeLevel = '1';
        $scope.taskQuestions = {};
        $scope.userAssessment = {};
        $scope.userSubjLevel = '';
        $scope.userSubjWeakPoints = '';
        $scope.currQuestNum = 1;
        $scope.gotoQuestNum = 0;
        $scope.displayResult = false;
        $scope.resultLines = [];
        $scope.questContent = {'part0':'', 'part1':'',
            'part2':'', 'part3':'', 'part4':''};
        $scope.questAnswer = {'answer0':'', 'answer1':'',
            'answer2':'', 'answer3':''};

        $scope.notStarted = true;
        $scope.startedTime = "";
        $scope.timeUsed = "";
        $scope.timeUsedStr = "0 分 0 秒";
        $scope.testCompleted = false;
        $scope.testAssessment = {}

        $scope.homeworkHistoryDialog = angular.element('#homeworkHistoryDialog');
        $scope.taskDialog = angular.element('#taskDialog');
        $scope.selectLevelDialog = angular.element('#selectLevelDialog');
        $scope.dataReady = false;
    	$scope.isHistoryView = false;
    	$scope.challengeResultMsg = '';
        $scope.testDialog = null;
        $scope.dialogList = ['selectGradeDialog', 'selectLevelDialog',
            'taskDialog', 'homeworkHistoryDialog', 'messageBox'];
        $scope.dialogInited =
        {
            'selectGradeDialog': false,
            'selectLevelDialog': false,
            'taskDialog': false,
            'homeworkHistoryDialog': false
        };

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

        $scope.showMessageBox = function(title, msg)
        {
            $scope.messageTitle = title;
            $scope.messageText = msg;
            window.parent.$('#messageBox').modal('show');
        };

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

        $scope.selectGrade = function(grade)
	  	{
    		$scope.currGrade = grade;
            $scope.currPointList = $scope.subjectGradeAndPoints[grade];
            if ( $scope.selectedPoints.length > 0 )
            {
                return;
            }
            $scope.selectedPoints.length = 0;
            for (var i in $scope.currPointList)
            {
                var point = $scope.currPointList[i];
                $scope.selectedPoints.push(point.point_name);
            }
	  	};

        $scope.clickPoint = function(pointName)
	  	{
            var pointId = 'point_' + pointName;
            var points = $scope.selectedPoints;
            var currPointElement = document.getElementById(pointId);
            if ( currPointElement.checked == false )
            {
                var idx = points.indexOf(pointName);
                points.splice(idx, 1);
            }
            else if ( points.indexOf(pointName) == -1 )
            {
                points.push(pointName)
            }
            if ( points.length == 0 )
            {
                $scope.showMessageBox('错误', '必须至少选一个知识点！');
            }
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
                //var qid = question.question_id;
                //var answerElement = document.getElementById('answer_' + qid);
                //var userAnswer = answerElement.value;
                var answers = question.questAnswer;
                var userAnswer = answers['answer0'];
                var notAnswered = (userAnswer == '')
                for ( var j=1; j<4; j++ )
                {
                    var ans = answers['answer'+j];
                    if ( ans != '--' && ans != '' )
                    {
                        userAnswer += '--' + ans;
                        notAnswered = false;
                    }
                }
                if ( notAnswered )
                {
                    $scope.showMessageBox('提示', '题目未完成，请全部完成后再提交。不会的题目可以写 ？。');
                    return;
                }
                question.user_answer = userAnswer;
            }
            var correctCount = 0;
            var questCount = questions.length;
            for ( var i=0; i<questCount; i++ )
            {
                var question = questions[i];
                for ( var j=0; j<4; j++ )
                {
                    var ans = question.questAnswer['answer'+j];
                    if ( ans != '--' )
                    {
                        if ( question.type == 'simple' )
                        {
                            var answerElement =
                                document.getElementById(question.question_id + '_answer' + j);
                            answerElement.disabled = true;
                        }
                    }
                }

                var line = Math.floor(i / 5);
                var col = i % 5;
                var label_question =
                    document.getElementById('label_question_'+ line + '_' + col);
                label_question.innerHTML = "" + (i + 1);
                var check_result_image =
                    document.getElementById('image_result_'+ line + '_' + col);
				check_result_image.style.visibility = "visible";
                if ( question.user_answer != question.answer )
                {
                    question.correct = 'false';
                    check_result_image.src = "images/wrong.png";
                }
                else
                {
                    question.correct = 'true';
                    check_result_image.src = "images/correct.png";
                    correctCount++;
                }
            }
            $scope.showTestResult();
            $scope.testCompleted = true;

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
                        window.parent.$('#messageBox').modal('show');
                    }
                    else if ( $scope.taskQuestions.type == TASK_TYPE_ASSESS_TEST )
                    {
                        if (resp.code == '0')
                        {
                            $scope.testAssessment = resp.result;
                        }
                    }
				},
				function(err)
				{
					console.log("Error occurred when submitting result: " + err);
				}
			);
	  	};

		$scope.dialogOnShown = function(evt)
		{
            var dialog = '#' + evt.target.id;
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
                            question.correct = 'true';
                            check_result_image.src = "images/correct.png";
                            answerElement.disabled = true;
                        }
                    }
                }
            }
            else ( dialog == '#selectGradeDialog' )
            {
                if ($scope.gradeList.length == 0)
                {
                    console.log("the gradeList is empty!");
                    return;
                }
    		    var grade = $scope.currGrade;
                var gradeId = 'grade_' + grade;
                var currGradeElement = document.getElementById(gradeId);
                console.log('grade element is: ' + currGradeElement);
                currGradeElement.checked = true;
                $scope.selectGrade(grade);
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

        $scope.initDialog = function(dialog)
		{
            if ( !$scope.dialogInited[dialog] )
            {
                // init the dialog
                var dialogElement = angular.element('#'+dialog);
                dialogElement.on('shown.bs.modal',  $scope.dialogOnShown);
                $compile(dialogElement)( $scope );
                $scope.$apply();
                $scope.dialogInited[dialog] = true;
            }
        }

        $scope.getSubjectGradeAndPoints = function()
		{
			smartLearnService.getSubjGradePoints({subject: $scope.subject},
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.subjectGradeAndPoints = resp.result;
                        var grades = [];
                        for ( var k in $scope.subjectGradeAndPoints )
                        {
                            grades.push(k);
                        }
                        $scope.gradeList = grades;
                        console.log('get grade points: ');
                        console.log($scope.gradeList);
                        $scope.currGrade = grades[0];
                        $scope.currPointList = $scope.subjectGradeAndPoints[$scope.currGrade];
                        console.log($scope.subjectGradeAndPoints);

                        //$scope.initDialog('selectGradeDialog');
                   }
                    else
                    {
                        console.log("Error occurred when getting grade and points: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when getting grade and points: " + err);
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

        $scope.initTestEnv = function()
        {
            $scope.isHistoryView = false;
    		$scope.notStarted = true;
            $scope.testCompleted = false;
            $scope.displayResult = false;
            $scope.currQuestNum = 1;
            $scope.timeUsedStr = "0 分 0 秒";
        };

        $scope.parseBasicQuest = function(quest)
        {
            var contArry = quest.content.split("$ANSWER");
            var questContent = {'part0':'', 'part1':'',
                'part2':'', 'part3':'', 'part4':''};
            for ( var j in contArry )
            {
                questContent['part'+j] = contArry[j];
                if ( j > 0 )
                {
                    quest.questAnswer['answer'+(j-1)] = '';
                }
            }
            quest['questContent'] = questContent;
        };

        $scope.parseComplexQuest = function(quest)
        {
            quest.complexQuestPicArry = [];
            quest.complexQuestArry = [];
            quest.complexQuestAnsOptArry = [];

            if ( quest.content_pic != '' )
            {
                var picArry = quest.content_pic.split("^^");
                for ( var i in picArry )
                {
                    quest.complexQuestPicArry[i] = [];
                    var picOnelineArry = picArry[i].split("--");
                    for ( var j in picOnelineArry )
                    {
                        quest.complexQuestPicArry[i][j] = picOnelineArry[j];
                    }
                }
            }

            if ( quest.quest_text != '' )
            {
                var questArry = quest.quest_text.split("--");
                for ( var i in questArry )
                {
                    quest.complexQuestArry[i] = questArry[i];
                }
            }

            if ( quest.answer_options != '' )
            {
                var optArry = quest.answer_options.split("--");
                for ( var i in optArry )
                {
                    quest.complexQuestAnsOptArry[i] = [];
                    var optOnelineArry = optArry[i].split("__");
                    for ( var j in optOnelineArry )
                    {
                        quest.complexQuestAnsOptArry[i][j] = optOnelineArry[j];
                    }
                }
            }
        };

        $scope.createAssessTest = function()
        {
            $scope.initTestEnv();
            $scope.taskDialogTitle = '小测试 : ' + $scope.currGrade;
            window.parent.$('#selectGradeDialog').modal('hide');
            var param = {subject:$scope.subject, grade: $scope.currGrade,
                selectedPoints: $scope.selectedPoints,
                userName: $scope.currUser, taskType: TASK_TYPE_ASSESS_TEST};
			smartLearnService.createTest(param,
				function(resp)
				{
                    if (resp.code == 0)
                    {
                        $scope.taskQuestions = resp.result;
                        $scope.currQuestText = $scope.getCurrQuestText();
                        var questions = $scope.taskQuestions.questions;
                        for ( var i in questions )
                        {
                            var quest = questions[i];
                            var questAnswer = {'answer0':'--', 'answer1':'--', 'answer2':'--', 'answer3':'--'};
                            quest['questAnswer'] = questAnswer;
                            if ( quest.type == "simple" )
                            {
                                $scope.parseBasicQuest(quest);
                            }
                            else
                            {
                                $scope.parseComplexQuest(quest);
                            }
                        }
                        var linecount = Math.floor((questions.length-1) / 5) + 1;
                        for ( var i=0; i<linecount; i++ )
                        {
                            $scope.resultLines[i] = i;
                        }
                        window.parent.$('#selectGradeDialog').modal('hide');
                        window.parent.$('#testDialog').modal('show');
                    }
                    else
                    {
                        console.log("Error occurred when submitting grade selection: " + resp.result);
                    }
				},
				function(err)
				{
					console.log("Error occurred when submitting grade selection: " + err);
				}
			);
        }

        $scope.isNotEmpty = function(obj)
        {
            return obj != undefined && obj != '';
        }

        $scope.displaySimpleQuestContent = function(question, partj)
        {
            return $scope.isNotEmpty(question.questContent);
        }

        $scope.displaySimpleQuestAnswer = function(question, answerj)
        {
            if ( $scope.isNotEmpty(question.questAnswer) )
            {
                return question.questAnswer[answerj] != '--';
            }
            return false;
        }

    	$scope.setDialogOnShownFunc = function()
	  	{
            for ( var i in $scope.dialogList )
            {
                var dialog = $scope.dialogList[i];
                var dialogElement = angular.element('#'+dialog);
                dialogElement.on('shown.bs.modal',  $scope.dialogOnShown);
            }
	  	};

    	$scope.getAndInitDialogs = function()
	  	{
            for ( var i in $scope.dialogList )
            {
                var dialog = $scope.dialogList[i];
                console.log('init dialog: ' + dialog);
                $scope.compileDialog(dialog);
            }
	  	};

        $scope.testDialog = function()
	  	{
            $scope.messageText = 'test dialog now!';
            var messageBox = angular.element('#messageBox');
            $scope.$apply();
            messageBox.modal('show');
	  	};

    	$scope.compileDialog = function(dialog)
        {
            var htmlpage = 'htmls/' + dialog + '.html';
            $.get(htmlpage, function(result)
            {
                console.log('get dialog html page: ' + htmlpage);
                $('body').append(result);
                if ( dialog = 'messageBox' )
                {
                    var dialogElement = angular.element('#'+dialog);
                    dialogElement.on('shown.bs.modal',  $scope.dialogOnShown);
                    $compile(dialogElement)( $scope );
                    $scope.$apply();
                }
            });
        }

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
                        $scope.getSubjectGradeAndPoints();
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

        $scope.displayQuestion = function(question)
        {
            var questions = $scope.taskQuestions.questions;
            var idx = questions.indexOf(question);
            if ( !$scope.displayResult && idx == $scope.currQuestNum - 1)
            {
                return true;
            }
            return false;
        }

        $scope.displayComplexQuestTextDesc = function(question)
        {
            if ( question.type != "simple" )
            {
                return true;
            }
            return false;
        }

        $scope.displaySimpleQuestion = function(question)
        {
            if ( question.type == "simple" )
            {
                return true;
            }
            return false;
        }

        $scope.displayComplexQuestAnswer = function(question)
        {
            if ( question && question.type != "simple" )
            {
                return true;
            }
            return false;
        }

        $scope.displayComplexQuestAnsOptions = function(question)
        {
            if ( question && question.type != "simple" && question.answer_options != "" )
            {
                return true;
            }
            return false;
        }

        $scope.displayComplexQuestPic = function(question)
        {
            if ( question && question.type != "simple" && question.content_pic != "" )
            {
                return true;
            }
            return false;
        }

        $scope.getCurrQuestText = function()
        {
            var questions = $scope.taskQuestions.questions;
            if ( questions )
            {
                return $scope.currQuestNum + " / " + questions.length;
            }
            return "0 / 0";
        }

        $scope.gotoPrevQuest = function()
        {
            if ( $scope.currQuestNum > 1 )
            {
                $scope.currQuestNum--;
                $scope.currQuestText = $scope.getCurrQuestText();
            }
        }

        $scope.gotoNextQuest = function()
        {
            var questions = $scope.taskQuestions.questions;
            if ( questions && $scope.currQuestNum < questions.length )
            {
                $scope.currQuestNum++;
                $scope.currQuestText = $scope.getCurrQuestText();
            }
        }

        $scope.disablePrevBtn = function()
        {
            return $scope.currQuestNum <= 1;
        }

        $scope.disableNextBtn = function()
        {
            var questions = $scope.taskQuestions.questions;
            if ( questions )
            {
                return $scope.currQuestNum >= questions.length;
            }
            return true;
        }

        $scope.gotoQuest = function(line, col)
        {
            if ( line != undefined )
            {
                $scope.gotoQuestNum = line * 5 + col + 1;
            }
            if ( $scope.gotoQuestNum == '' ||
                $scope.currQuestNum == $scope.gotoQuestNum )
            {
                return;
            }
            var questions = $scope.taskQuestions.questions;
            if ( questions && $scope.gotoQuestNum > 0 &&
                $scope.gotoQuestNum <= questions.length )
            {
                $scope.currQuestNum = $scope.gotoQuestNum;
                $scope.currQuestText = $scope.getCurrQuestText();
            }
            $scope.displayResult = false;
        }

         $scope.displayQuestResult = function(line, col)
        {
            var questions = $scope.taskQuestions.questions;
            if ( !questions )
            {
                return false;
            }
            var x = line * 5 + col;
            if ( x >= questions.length )
            {
                return false;
            }
            return true;
        }

        $scope.showTestResult = function()
        {
            $scope.displayResult = true;
            $scope.currQuestNum = 0;
            $scope.currQuestText = $scope.getCurrQuestText();
        }

        $scope.selectQuestAns = function(question, questText, questAnsOpt)
        {
            var i = 0;
            for ( i=0; i<question.complexQuestArry.length; i++ )
            {
                var qt = question.complexQuestArry[i];
                if ( qt == questText )
                {
                    break;
                }
            }
            question.questAnswer['answer' + i] = questAnsOpt;
        }

        $scope.displayResultInQuest = function(question)
        {
            var question_result_image =
                document.getElementById('image_question_result_'+ question.question_id);
            if ( question.correct == '' )
            {
                return false;
            }

            if ( question.correct == 'false' )
            {
                question_result_image.src = "images/wrong.png";
            }
            else
            {
                question_result_image.src = "images/correct.png";
            }
            return true;
        }

        $scope.viewAssessment = function()
        {
            window.parent.$('#testDialog').modal('hide');
            window.parent.$('#assessmentDialog').modal('show');
        }

        $scope.waitData = function()
        {
            $scope.dataReady = false;
            if ($scope.gradeList.length > 0)
            {
                var grade = $scope.gradeList[0];
                console.log('grade is: ' + grade);
                var gradeId = 'grade_' + grade;
                var currGradeElement = document.getElementById(gradeId);
                if ( currGradeElement )
                {
                    $scope.dataReady = true;
                }
            }
            if ( !$scope.dataReady && $scope.count < 30 )
            {
                $scope.count++;
                console.log("Waiting for data ready, time count: " + $scope.count);
                window.setTimeout($scope.waitData, 1000);
                return;
            }
            document.body.style.cursor = "";
        };

        $scope.checkUserLogin();
        $scope.setDialogOnShownFunc();
	}
]); 
