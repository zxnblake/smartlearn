/**
 * Created by Zhang Xiao Ning on 8/8/15.
 */

load('commUtil.js');

util = new CommUtil();

function QuestAddSubHelper()
{
    this.createQuestions = function()
    {
        var questions = [];
        var ql1 = [];
        var ql2 = [];

        for ( var i=1; i<20; i++ )
        {
            for (var j=1; j<20; j++)
            {
                var qa = add_less_20(i, j);
                if ( qa != null )
                {
                    ql1.push(qa);
                }
                var qs = subtract_less_20(i, j);
                if ( qs != null )
                {
                    ql1.push(qs);
                }
            }
        }

        for ( var i=1; i<100; i++ )
        {
            for (var j=1; j<100; j++)
            {
                var qa = add_less_100(i, j);
                if ( qa != null )
                {
                    ql2.push(qa);
                }
                var qs = subtract_less_100(i, j);
                if ( qs != null )
                {
                    ql2.push(qs);
                }
            }
        }

        print('start to generate Add-Sub-Mix questions for numbers less than 20: ' + (new Date()).toString());
        var ql3 = genAddSubMixQuests(100, 3, 20);
        var ql4 = genAddSubMixQuests(50, 4, 20);
        print('start to generate Subtract questions for numbers less than 100: ' + (new Date()).toString());
        var ql5 = genAddSubMixQuests(100, 3, 100);
        var ql6 = genAddSubMixQuests(50, 4, 100);

        questions = ql1.concat(ql2, ql3);
        return questions;
    }
};

add_less_20 = function(i, j)
{
    var sum = i + j;
    var questArry = [i, '+', j, '=', sum];
    var q = getQuestFromArry(questArry, 2);
    q.grade_point = 'addsub-less-20';
    q.type = 'simple';

    var quest = null;
    if ( sum <= 10 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 5;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else if ( sum <= 20 )
    {
        if ( i >=10 || j >= 10 )
        {
            var rd = Math.floor(Math.random() * 101);
            var m = rd % 4;
            if ( m == 0 )
            {
                quest = q;
            }
        }
        else
        {
            quest = q;
        }
    }
    return quest;
};

add_less_100 = function(i, j)
{
    var sum = i + j;
    var questArry = [i, '+', j, '=', sum];
    var q = getQuestFromArry(questArry, 2);
    q.grade_point = 'addsub-less-100';
    q.type = 'simple';

    var quest = null;
    if ( sum <= 50 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 4;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else if ( sum <= 100 )
    {
        var i0 = i % 10;
        var j0 = j % 10;
        if ( i0 + j0 < 10 )
        {
            var rd = Math.floor(Math.random() * 101);
            var m = rd % 4;
            if ( i < 10 || j < 10 )
            {
                m = rd % 8;
            }
            if ( m == 0 )
            {
                quest = q;
            }
        }
        else
        {
            q.type = 'carry1';
            quest = q;
        }
    }
    return quest;
};

subtract_less_20 = function(i, j)
{
    if ( i < j )
    {
        return;
    }
    var subtr = i - j;
    var questArry = [i, '-', j, '=', subtr];
    var q = getQuestFromArry(questArry, 2);
    q.grade_point = 'addsub-less-20';
    q.type = 'simple';

    var quest = null;
    if ( (i < 10 && j < 10) || (i > 10 && j > 10) || j in [0, 1, 2])
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 4;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else
    {
        quest = q;
    }
    return quest;
};

subtract_less_100 = function(i, j)
{
    if ( i <= j )
    {
        return;
    }
    var subtr = i - j;
    var questArry = [i, '-', j, '=', subtr];
    var q = getQuestFromArry(questArry, 2);
    q.grade_point = 'addsub-less-100';
    q.type = 'simple';

    var quest = null;
    if ( i <= 50 && j <= 50 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 4;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else
    {
        var i0 = i % 10;
        var j0 = j % 10;
        if ( i0 >= j0 )
        {
            var rd = Math.floor(Math.random() * 101);
            var m = rd % 4;
            if ( m == 0 )
            {
                quest = q;
            }
        }
        else
        {
            q.type = 'borrow1';
            quest = q;
        }
    }
    return quest;
};

getRandInt = function(m1, m2)
{
    var m = 0;
    while ( m < m1 || m > m2 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 5;
    }
    var ex = Math.pow(10, m);
    var rand = Math.random();
    while ( rand < 0.1 )
    {
        rand = Math.random();
    }
    var a1 = Math.floor(rand * ex);
    return a1;
};

getQuestFromArry = function(questArry, nCount)
{
    // select the random position for answer
    var anspos = util.genRandNumInRange(0, nCount+1);
    var result = "" + questArry[anspos * 2];
    questArry[anspos * 2] = "$ANSWER";

    // concatenate the questArry to get the question string
    var questStr = "";
    for ( var j=0; j<questArry.length; j++ )
    {
        questStr = questStr + " " + questArry[j] + " ";
    }
    questStr = questStr.trim();
    print('question string: ' + questStr);
    print('question answer: ' + result);
    var props = {'sbj_name':'数学', 'content':questStr, 'answer':result,
                 'difficulty':'easy', 'type':'simple'};
    var q = util.createQuestion(props);
    return q;
};

genAddSubMixQuests = function(questNum, nCount, max)
{
    var quests = [];
    for ( var i=0; i<questNum; i++ )
    {
        // generate a question array first
        print('generate a question array');
        var questArry = getAddSubMixQuestArry(nCount, max);
        var len = questArry.length;
        print('question array: ' + questArry);
        var q = getQuestFromArry(questArry, nCount);
        q.grade_point = 'addsub-less-'+max;
        q.point_type = 'addsub-mixed';
        quests.push(q);
    }
    return quests;
};

getOperatorList = function(opCount)
{
    var opArry = [];
    for ( var i=0; i<opCount; i++ )
    {
        var rnd = Math.random();
        var n = Math.floor(rnd * 101) % 2;
        if ( n == 0 )
        {
            opArry[i] = "+";
        }
        else
        {
            opArry[i] = "-";
        }
    }
    return opArry;
};

// get the array for a Add-Subtract-Mixed question: [1, +, 3, =, 4]
getAddSubMixQuestArry = function(nCount, max)
{
    var operandList = [];
    operandList[0] = util.genRandNumInRange(0, max);
    var questArry = [];
    questArry[0] = operandList[0];
    var operatorList = getOperatorList(nCount-1);
    print('operator list = ' + operatorList);

    var k = 1;
    var result = operandList[0];
    for ( var i=1; i<nCount; i++ )
    {
        print('i == ' + i);
        var operator = operatorList[i-1];
        if ( operator == "+" )
        {
            operandList[i] = util.genRandNumInRange(0, max-result);
            result = result + operandList[i];
        }
        else
        {
            operandList[i] = util.genRandNumInRange(0, result-1);
            result = result - operandList[i];
        }
        questArry[k] = operator;
        questArry[k+1] = operandList[i];
        k = k + 2;
    }
    questArry[k] = " = ";
    questArry[k+1] = result;
    k = k + 2;
    return questArry;
};

getAddSbjPoints = function(a1, a2)
{
    var pts = 'addition-5';
    var carry = 0;
    while ( a1 > 0 && a2 > 0 )
    {
        var k1 = a1 % 10;
        var k2 = a2 % 10;
        if ( k1 + k2 + carry >= 10 )
        {
            if ( carry == 1 )
            {
                pts = 'carry-2';
                break;
            }
            else
            {
                pts = 'carry-1';
            }
            carry = 1;
        }
        else
        {
            carry = 0;
        }
        a1 = Math.floor(a1 / 10);
        a2 = Math.floor(a2 / 10);
    }
    return pts;
};

genAddQuestsUpper100 = function(num)
{
    var quests = [];

    var i = 0;
    var j = 0;
    var k = 0;
    while ( i < num || j < num || k < num )
    {
        var a1 = getRandInt(2, 4);
        var a2 = getRandInt(2, 4);
        var sumstr = (a1 + a2).toString();
        var cont = a1 + " + " + a2 + " = $ANSWER";
        var sbjpts = getAddSbjPoints(a1, a2);
        var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'subtract-4',
                     'point_type':'subtract', 'difficulty':'easy',
                     'answer':sumstr.toString(), 'type':'simple'};
        var q = util.createQuestion(props);
        if ( sbjpts == 'addition-5' && i < num )
        {
            quests.unshift(q);
            i++;
        }
        else if ( sbjpts == 'addition-5,carry-1' && j < num )
        {
            quests.unshift(q);
            j++;
        }
        else if ( sbjpts == 'addition-5,carry-2' && k < num )
        {
            quests.unshift(q);
            k++;
        }
    }
    return quests;
};

getSubtrSbjPoints = function(s1, s2)
{
    var pts = 'subtract-5';
    var borrow = 0;
    while ( s1 > 0 && s2 > 0 )
    {
        var k1 = s1 % 10;
        var k2 = s2 % 10;
        if ( k1 - borrow < k2 )
        {
            if ( borrow == 1 )
            {
                pts = 'borrow-2';
                break;
            }
            else
            {
                pts = 'borrow-1';
            }
            borrow = 1;
        }
        else
        {
            borrow = 0;
        }
        s1 = Math.floor(s1 / 10);
        s2 = Math.floor(s2 / 10);
    }
    return pts;
};

genSubtQuestsUpper100 = function(num)
{
    var quests = [];
    var i = 0;
    var j = 0;
    var k = 0;
    while ( i < num || j < num || k < num )
    {
        var s1 = getRandInt(2, 4);
        var s2 = getRandInt(2, 4);
        if ( s1 < s2 )
        {
            continue;
        }
        var subtstr = (s1 - s2).toString();
        var cont = s1 + " - " + s2 + " = $ANSWER";
        var sbjpts = getSubtrSbjPoints(s1, s2);
        var props = {'sbj_name':'数学', 'content':cont, 'grade_point':sbjpts,
                     'point_type':'subtract', 'difficulty':'easy',
                     'answer':subtstr, 'type':'simple'};
        var q = util.createQuestion(props);
        if ( sbjpts == 'subtract-5' && i < num )
        {
            quests.push(q);
            i++;
        }
        else if ( sbjpts == 'subtract-5,borrow-1' && j < num )
        {
            quests.push(q);
            j++;
        }
        else if ( sbjpts == 'subtract-5,borrow-2' && k < num )
        {
            quests.push(q);
            k++;
        }
    }
    return quests;
};
