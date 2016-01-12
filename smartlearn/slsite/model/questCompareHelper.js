/**
 * Created by Xiao Ning Zhang on 12/29/15.
 */
load('commUtil.js');

util = new CommUtil();

function QuestCompareHelper()
{
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

        questions = ql1.concat(ql2);
        return questions;
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
    var quest = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                 'answer':result, 'type':'basic',
                 'answer_label':'', 'content_pic':''};
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
        var quest = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                     'answer':result, 'type':'addsub',
                     'answer_label':'', 'content_pic':''};
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
        var quest = {'sbj_name':'数学', 'content':cont, 'grade_point':'comparison-simple',
                     'answer':result, 'type':'addsub',
                     'answer_label':'', 'content_pic':''};
        var cont2 = randn + " $ANSWER " + randFormula1.str;
        var quest2 = {'sbj_name':'数学', 'content':cont2, 'grade_point':'comparison-simple',
                     'answer':result2, 'type':'addsub',
                     'answer_label':'', 'content_pic':''};
        questions.push(quest);
        questions.push(quest2);
    }
    return questions;
};
