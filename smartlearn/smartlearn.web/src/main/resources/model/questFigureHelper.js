/**
 * Created by Xiao Ning Zhang on 1/14/16.
 */

load('commUtil.js');

util = new CommUtil();

// just for test
//helper = new QuestFigureHelper();
//helper.QuestFigureHelper();

function QuestFigureHelper()
{
    this.SQUARE_SIDE_DEFAULT_LENGTH = 5;
    this.SEQUENCE_DEFAULT_LENGTH = 10;
    this.GEOMETRIC_FIGURES = ["square", "rectangle", "circle", "regular_triangle",
        "trapezia", "rightangled_triangle", "regular_pentagon", "regular_hexagon",
        "parallelogram"
    ];
    this.GEOMETRIC_FIGURES_CN_NAME_BASIC = ["正方形", "长方形", "圆形", "三角形", "梯形"];
    this.FIGURE_QUESTIONS = [
        "从左边数第 $NUM 个是什么图形？",
        "从右边数第 $NUM 个是什么图形？",
        "图中一共有几种图形？",
        "图中一共有几个图形？",
        "图中一共有几个$FIG？"
    ];
    this.QUESTION_TEXT = "根据下面的图回答问题。";

    this.createQuestions = function()
    {
        var questions = [];
        var ql1 = this.genSequences(50);
        var ql2 = this.genSquares();
        questions = ql1.concat(ql2);
        return questions;
    };

    this.genSequences = function(questNum)
    {
        var quests = [];
        for (var k=0; k<questNum; k++)
        {
            var count = util.genRandNumInRange(6, 11);
            var randPicArry = util.genRandNumArrayInRange(0, 5, count);
            var cont_pics = "";
            var picStat = {};
            var picArry = [];
            for (var i in randPicArry)
            {
                if ( i != 0 )
                {
                    cont_pics = cont_pics + "--";
                }
                cont_pics = cont_pics + this.GEOMETRIC_FIGURES[randPicArry[i]];
                var picCnName = this.GEOMETRIC_FIGURES_CN_NAME_BASIC[randPicArry[i]];
                picArry.push(picCnName);
                if ( picStat[picCnName] )
                {
                    picStat[picCnName]++;
                }
                else
                {
                    picStat[picCnName] = 1;
                }
            }
            var cont = this.QUESTION_TEXT;
            var quest_and_answer = this.makeQuestsAndAnswers(picArry, picStat, 3);
            var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'figure-simple',
                 'point_type':'figure-basic-direction', 'level':'basic',
                 'answer':quest_and_answer.answer, 'type':'complex_textdesc_pic_selection',
                 'quest_text':quest_and_answer.quest, 'answer_options':quest_and_answer.answer_options,
                 'content_pic':cont_pics};
            var q = util.createQuestion(props);
            quests.push(q);
        }

        return quests;
    };

    this.makeQuestsAndAnswers = function(picArry, picStat, questNum)
    {
        quest_and_answer = {'quest':'', 'answer_options':'', 'answer':''};

        var totalpic = picArry.length;
        var pictypes = picStat.length;
        var randQuestArry = util.genRandNumArrayInRangeDiff(0, 5, questNum);

        questStr = '';
        answerStr = '';
        answerOptStr = '';
        for ( var i in randQuestArry )
        {
            if ( i != 0 )
            {
                questStr += '--';
                answerStr += '--';
                answerOptStr += '--';
            }
            var k = randQuestArry[i];
            var s = this.FIGURE_QUESTIONS[k];
            if ( k <= 1 )
            {
                var randn = util.genRandNumInRange(1, totalpic+1);
                s = s.replace("$NUM", "" + randn);
                answerOptStr += this.getAnsOptsFromArry(this.GEOMETRIC_FIGURES_CN_NAME_BASIC);
                if ( k == 1 )
                {
                    randn = totalpic - randn + 1;
                }
                answerStr += picArry[randn-1];
            }
            else if ( k == 2 )
            {
                var optArry = [1, 2, 3, 4, 5];
                answerOptStr += this.getAnsOptsFromArry(optArry);
                answerStr += picArry.length + '';

            }
            else if ( k == 3 )
            {
                var optArry = [6, 7, 8, 9, 10];
                answerOptStr += this.getAnsOptsFromArry(optArry);
                answerStr += totalpic + '';

            }
            else if ( k == 4 )
            {
                var randf = util.genRandNumInRange(0, picArry.length);
                var randpic = picArry[randf];
                s = s.replace("$FIG", randpic);
                var optArry = util.genRandNumOptsIncludX(1, totalpic+1, 5, picStat[randpic]);
                answerOptStr += this.getAnsOptsFromArry(optArry);
                answerStr += picStat[randpic];
            }
            var idx = Number(i) + 1;
            questStr += '(' + idx + ') ' + s;
        }

        quest_and_answer.quest = questStr;
        quest_and_answer.answer = answerStr;
        quest_and_answer.answer_options = answerOptStr;
        return quest_and_answer;
    };

    this.genSquares = function()
    {
        var quests = [];
        return quests;
    };

    this.getAnsOptsFromArry = function(optArry)
    {
        var ansOpts = '';
        for ( var i in optArry )
        {
            if ( i != 0 )
            {
                ansOpts += "__";
            }
            ansOpts += optArry[i];
        }
        return ansOpts;
    }
}
