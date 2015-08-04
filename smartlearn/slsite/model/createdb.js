/**
 * Created by Xiao Ning Zhang on 6/8/15.
 */

conn = new Mongo();
db = conn.getDB("smartlearn");

// Table: user
db.user.insert({'name':'zxn', 'password':'zxn', 'true_name':'zxn',
    'gender':'male', 'age':'39'});

// Table: subject
db.subject.insert({'name':'数学'});

// Table: subject_point
db.subject_point.insert({'sbj_name':'数学', 'point':'addition', 'rank':'1', 'desc':'5 以内加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'addition', 'rank':'2', 'desc':'10 以内加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'addition', 'rank':'3', 'desc':'20 以内加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'addition', 'rank':'4', 'desc':'50 以内加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'carry', 'rank':'1', 'desc':'带进位加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'addition', 'rank':'5', 'desc':'100 以内加法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'carry', 'rank':'2', 'desc':'连续进位传递'});
db.subject_point.insert({'sbj_name':'数学', 'point':'subtract', 'rank':'1', 'desc':'5 以内减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'subtract', 'rank':'2', 'desc':'10 以内减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'subtract', 'rank':'3', 'desc':'20 以内减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'subtract', 'rank':'4', 'desc':'50 以内减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'borrow', 'rank':'1', 'desc':'带借位减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'subtract', 'rank':'5', 'desc':'100 以内减法'});
db.subject_point.insert({'sbj_name':'数学', 'point':'borrow', 'rank':'2', 'desc':'连续向前借位'});

// Table: question
add_level_1 = function(i, j)
{
    var sum = i + j;
    if ( i in [0,1] || j in [0,1] )
    {
        var cont = i + " + " + j + " =";
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 3;
        if ( m == 0 )
        {
            db.question.insert({'sbj_name':'数学', 'content':cont,
                'sbj_points':'addition-1', 'level':'1', 'answer':sum.toString()});
        }
    }
    else if ( sum <= 10 )
    {
        var cont = i + " + " + j + " =";
        db.question.insert({'sbj_name':'数学', 'content':cont,
            'sbj_points':'addition-1', 'level':'1', 'answer':sum.toString()});
    }
};

add_level_2 = function(i, j)
{
    var sum = i + j;
    if ( sum <= 10 )
    {
        var cont = i + " + " + j + " =";
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 5;
        if ( m == 0 )
        {
            db.question.insert({'sbj_name':'数学', 'content':cont,
                'sbj_points':'addition-2', 'level':'2', 'answer':sum.toString()});
        }
    }
    else if ( sum <= 20 )
    {
        var cont = i + " + " + j + " =";
        if ( i >=10 || j >= 10 )
        {
            var rd = Math.floor(Math.random() * 101);
            var m = rd % 4;
            if ( m == 0 )
            {
                db.question.insert({'sbj_name':'数学', 'content':cont,
                    'sbj_points':'addition-2', 'level':'2', 'answer':sum.toString()});
            }
        }
        else
        {
            db.question.insert({'sbj_name':'数学', 'content':cont,
                'sbj_points':'addition-2', 'level':'2', 'answer':sum.toString()});
        }
    }
};

subtract_level_1 = function(i, j)
{
    if ( i < j )
    {
        return;
    }
    var subtr = i - j;
    if ( j in [0,1] )
    {
        var cont = i + " - " + j + " =";
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 3;
        if ( m == 0 )
        {
            db.question.insert({'sbj_name':'数学', 'content':cont,
                'sbj_points':'subtract-1', 'level':'1', 'answer':subtr.toString()});
        }
    }
    else
    {
        var cont = i + " - " + j + " =";
        db.question.insert({'sbj_name':'数学', 'content':cont,
            'sbj_points':'subtract-1', 'level':'1', 'answer':subtr.toString()});
    }
};

subtract_level_2 = function(i, j)
{
    if ( i < j )
    {
        return;
    }
    var subtr = i - j;
    if ( (i < 10 && j < 10) || (i > 10 && j > 10) || j in [0, 1, 2])
    {
        var cont = i + " - " + j + " =";
        var rd = Math.floor(Math.random() * 101);
        var m = rd % 4;
        if ( m == 0 )
        {
            db.question.insert({'sbj_name':'数学', 'content':cont,
                'sbj_points':'subtract-2', 'level':'2', 'answer':subtr.toString()});
        }
    }
    else
    {
        var cont = i + " - " + j + " =";
        db.question.insert({'sbj_name':'数学', 'content':cont,
            'sbj_points':'subtract-1', 'level':'2', 'answer':subtr.toString()});
    }
};

for ( var i=0; i<10; i++ )
{
    for (var j=0; j<10; j++)
    {
        add_level_1(i, j);
        subtract_level_1(i, j);
    }
}

for ( var i=0; i<20; i++ )
{
    for (var j=0; j<20; j++)
    {
        add_level_2(i, j);
        subtract_level_2(i, j);
    }
}

// Table: assessment
db.assessment.insert({'user_name':'zxn', 'sbj_name':'数学', 'level':'0',
    'weak_points':'', 'next_level':'1'});

// Table: daily_task
db.task.insert({'type':'dailyjob', 'user_name':'zxn', 'sbj_name':'数学',
    'date':'2015-06-01', 'create_time':'', 'start_time':'', 'time_used':'',
    'time_limit':'', 'question_num':'2', 'score':''});

// Table: task_question
db.task_question.insert({'task_id':'100000', 'question_id':'',
    'user_answer':'', 'correct':''});

// Table: level
db.subject_level.insert({'sbj_name':'数学', 'level':'1',
    'desc':'10 以内加减法', 'level_points':'addition-2,subtract-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'2',
    'desc':'20 以内加减法', 'level_points':'addition-3,subtract-3'});
