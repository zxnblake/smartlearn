/**
 * Created by Xiao Ning Zhang on 12/29/15.
 */
load('commUtil.js');
load('constants.js');

util = new CommUtil();
constants = new Constants();

function QuestCompareHelper()
{
    this.QUESTION_APPLICATION_COMPARE_TYPE = [
        ["身高", "高", "矮"],
        ["体重", "重", "轻"],
        ["赛跑", "快", "慢"]
    ];

    this.QUESTION_APPLICATION_COMPARE_TEMPLATE =
        "$COMPARE_CASE。 $COMPARE_CONDITION。$COMPARE_QUESTION。(注：答案的示例为：a c b)";

    this.createQuestions = function()
    {
        var questions = [];
        var ql1 = [];

        for ( var i=0; i<=20; i++ )
        {
            for (var j=0; j<=20; j++)
            {
                var qa = compare_less_20(i, j);
                if ( qa != null )
                {
                    ql1.push(qa);
                }
            }
        }
        var ql2 = compare_addsub_less_20(50);
        var ql3 = compare_application();

        questions = ql1.concat(ql2, ql3);
        return questions;
    }
};

compare_application = function()
{
    var questions = [];
    for ( var k=3; k<6; k++ )
    {
        for ( var i=0; i<10; i++ )
        {
            var persons = util.genRandNumArrayInRangeDiff(0, 6, k);
            var compType = util.genRandNumInRange(0, 3);
            var compCase = getCompCase(persons, compType);
            var compCondition = getCompCondition(persons, compType);
            var compQuest = getCompQuest(persons, compType);
            var cont = this.QUESTION_APPLICATION_COMPARE_TEMPLATE;
            cont = cont.replace("$COMPARE_CASE", compCase);
            cont = cont.replace("$COMPARE_CONDITION", compCondition);
            cont = cont.replace("$COMPARE_QUESTION", compQuest);

            var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                         'point_type':'application', 'level':constants.QUESTION_LEVEL_BASIC,
                         'answer':result, 'type':'simple'};
            var quest = util.createQuestion(props);
        }
    }
};

compare_less_20 = function(i, j)
{
    var result = "=";
    if ( i < j )
    {
        result = "<";
    }
    else if ( i > j )
    {
        result = ">";
    }
    var cont = i + " $ANSWER " + j;
    var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                 'point_type':'comparison', 'level':constants.QUESTION_LEVEL_BASIC,
                 'answer':result, 'type':'simple'};
    var quest = util.createQuestion(props);
    return quest;
};

getRandFormula = function(max)
{
    var fm = {};
    var rnd = util.genRandNumInRange(0, 2);
    if ( rnd == 0 )
    {
        fm.op = "+";
        fm.x = util.genRandNumInRange(0, max);
        fm.y = util.genRandNumInRange(0, max-fm.x);
        fm.result = fm.x + fm.y;
    }
    else
    {
        fm.op = "-";
        fm.x = util.genRandNumInRange(0, max);
        fm.y = util.genRandNumInRange(0, fm.x);
        fm.result = fm.x - fm.y;
    }
    fm.str = fm.x + " " + fm.op + " " + fm.y;
    return fm;
};

compare_addsub_less_20 = function(num)
{
    var questions = [];
    for ( var i=0; i<num; i++ )
    {
        var randFormula1 = getRandFormula(20);
        var randFormula2 = getRandFormula(20);
        var result = "=";
        if ( randFormula1.result < randFormula1.result )
        {
            result = "<";
        }
        else if ( randFormula1.result > randFormula1.result )
        {
            result = ">";
        }
        var cont = randFormula1.str + " $ANSWER " + randFormula2.str;
        var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                     'point_type':'comparison-addsub', 'level':constants.QUESTION_LEVEL_MEDIUM,
                     'answer':result, 'type':'simple'};
        var quest = util.createQuestion(props);
        questions.push(quest);
    }

    for ( var i=0; i<num; i++ )
    {
        var randFormula1 = getRandFormula(20);
        var randn = util.genRandNumInRange(0, 20);
        var result = "=";
        var result2 = "=";
        if ( randFormula1.result < randn )
        {
            result = "<";
            result2 = ">";
        }
        else if ( randFormula1.result > randn )
        {
            result = ">";
            result2 = "<";
        }
        var cont = randFormula1.str + " $ANSWER " + randn;
        var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                     'point_type':'comparison-addsub', 'level':constants.QUESTION_LEVEL_BASIC,
                     'answer':result, 'type':'simple'};
        var quest = util.createQuestion(props);

        var cont2 = randn + " $ANSWER " + randFormula1.str;
        var props = {'sbj_name':'数学', 'content':cont2, 'grade_point':'comparison-simple',
                     'point_type':'comparison-addsub', 'level':constants.QUESTION_LEVEL_BASIC,
                     'answer':result2, 'type':'simple'};
        var quest2 = util.createQuestion(props);

        questions.push(quest);
        questions.push(quest2);
    }
    return questions;
};
