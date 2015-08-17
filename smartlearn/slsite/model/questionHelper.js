/**
 * Created by admin on 8/8/15.
 */

function QuestionHelper()
{
    this.createQuestions = function()
    {
        var questions = [];
        var ql1 = [];
        var ql2 = [];
        var ql3 = [];
        var ql4 = [];

        for ( var i=0; i<10; i++ )
        {
            for (var j=0; j<10; j++)
            {
                var qa = add_level_1(i, j);
                if ( qa != null )
                {
                    ql1.push(qa);
                }
                var qs = subtract_level_1(i, j);
                if ( qs != null )
                {
                    ql1.push(qs);
                }
            }
        }

        for ( var i=1; i<20; i++ )
        {
            for (var j=1; j<20; j++)
            {
                var qa = add_level_2(i, j);
                if ( qa != null )
                {
                    ql2.push(qa);
                }
                var qs = subtract_level_2(i, j);
                if ( qs != null )
                {
                    ql2.push(qs);
                }
            }
        }

        for ( var i=1; i<50; i++ )
        {
            for (var j=1; j<50; j++)
            {
                var qa = add_level_3(i, j);
                if ( qa != null )
                {
                    ql3.push(qa);
                }
                var qs = subtract_level_3(i, j);
                if ( qs != null )
                {
                    ql3.push(qs);
                }
            }
        }

        for ( var i=1; i<100; i++ )
        {
            for (var j=1; j<100; j++)
            {
                var qa = add_level_4(i, j);
                if ( qa != null )
                {
                    ql4.push(qa);
                }
                var qs = subtract_level_4(i, j);
                if ( qs != null )
                {
                    ql4.push(qs);
                }
            }
        }

        print('start to generate Add questions for level5: ' + (new Date()).toString());
        var ql5_add = genAddQuestsLevel5(300);
        print('start to generate Subtract questions for level5: ' + (new Date()).toString());
        var ql5_subtr = genSubtQuestsLevel5(300);
        print('finished to generate Subtract questions for level5: ' + (new Date()).toString());

        questions = ql1.concat(ql2, ql3, ql4, ql5_add, ql5_subtr);
        return questions;
    }
};

add_level_1 = function(i, j)
{
    var sum = i + j;
    var cont = i + " + " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-1',
                'level':'1', 'answer':sum.toString()};
    if ( i in [0,1] || j in [0,1] )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 3;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else if ( sum <= 10 )
    {
        quest = q;
    }
    return quest;
};

add_level_2 = function(i, j)
{
    var sum = i + j;
    var cont = i + " + " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-2',
                'level':'2', 'answer':sum.toString()};
    if ( sum <= 10 )
    {
        var cont = i + " + " + j;
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 5;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else if ( sum <= 20 )
    {
        var cont = i + " + " + j;
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

add_level_3 = function(i, j)
{
    var sum = i + j;
    var cont = i + " + " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-3',
                'level':'3', 'answer':sum.toString()};
    var q2 = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-3,carry-1',
                'level':'3', 'answer':sum.toString()};
    if ( sum <= 20 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 6;
        if ( m == 0 )
        {
            quest = q;
        }
    }
    else if ( sum <= 50 )
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
            quest = q2;
        }
    }
    return quest;
};

add_level_4 = function(i, j)
{
    var sum = i + j;
    var cont = i + " + " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-4',
                'level':'4', 'answer':sum.toString()};
    var q2 = {'sbj_name':'数学', 'content':cont,'sbj_points':'addition-4,carry-1',
                'level':'4', 'answer':sum.toString()};
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
            quest = q2;
        }
    }
    return quest;
};

subtract_level_1 = function(i, j)
{
    if ( i < j )
    {
        return;
    }
    var subtr = i - j;
    var cont = i + " - " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-1',
        'level':'1', 'answer':subtr.toString()};
    if ( j in [0,1] )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 3;
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

subtract_level_2 = function(i, j)
{
    if ( i < j )
    {
        return;
    }
    var subtr = i - j;
    var cont = i + " - " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-2',
        'level':'2', 'answer':subtr.toString()};
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

subtract_level_3 = function(i, j)
{
    if ( i <= j )
    {
        return;
    }
    var subtr = i - j;
    var cont = i + " - " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-3',
        'level':'3', 'answer':subtr.toString()};
    var q2 = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-3,borrow-1',
        'level':'3', 'answer':subtr.toString()};
    if ( i <= 20 && j <= 20 )
    {
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 6;
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
            quest = q2;
        }
    }
    return quest;
};

subtract_level_4 = function(i, j)
{
    if ( i <= j )
    {
        return;
    }
    var subtr = i - j;
    var cont = i + " - " + j;
    var quest = null;
    var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-4',
        'level':'4', 'answer':subtr.toString()};
    var q2 = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-4,borrow-1',
        'level':'4', 'answer':subtr.toString()};
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
            quest = q2;
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
                pts = 'addition-5,carry-2';
                break;
            }
            else
            {
                pts = 'addition-5,carry-1';
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

genAddQuestsLevel5 = function(num)
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
        var cont = a1 + " + " + a2;
        var sbjpts = getAddSbjPoints(a1, a2);
        var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':'subtract-4',
            'level':'5', 'answer':sumstr.toString()};
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
                pts = 'subtract-5,borrow-2';
                break;
            }
            else
            {
                pts = 'subtract-5,borrow-1';
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

genSubtQuestsLevel5 = function(num)
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
        var cont = s1 + " - " + s2;
        var sbjpts = getSubtrSbjPoints(s1, s2);
        var q = {'sbj_name':'数学', 'content':cont, 'sbj_points':sbjpts,
            'level':'5', 'answer':subtstr};
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
