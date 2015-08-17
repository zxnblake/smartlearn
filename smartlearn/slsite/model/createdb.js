/**
 * Created by Xiao Ning Zhang on 6/8/15.
 */

load('cleardb.js');
load('questionHelper.js');

conn = new Mongo();
db = conn.getDB("smartlearn");

print('Start to clear the metadb.');
clearDB = new ClearDB();
clearDB.cleardb(db);

// Table: user
db.user.insert({'name':'zxn', 'password':'zxn', 'true_name':'zxn',
    'gender':'male', 'age':'39'});

// Table: subject
db.subject.insert({'name':'数学'});

// Table: subject_point
print('Start to create the subject_point data.');
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
print('Start to create the question data.');
qh = new QuestionHelper();
var questions = qh.createQuestions();
for ( var i in questions )
{
    var q = questions[i];
    db.question.insert(q);
}

// Table: assessment
db.assessment.insert({'user_name':'zxn', 'sbj_name':'数学', 'level':'0',
    'weak_points':'', 'next_level':'1'});

// Table: daily_task
db.task.insert({'type':'challenge', 'user_name':'zxn', 'sbj_name':'数学', 'level':'0',
    'date':'2015-06-01', 'create_time':'', 'start_time':'', 'time_used':'',
    'time_limit':'', 'question_num':'2', 'score':''});

// Table: task_question
db.task_question.insert({'task_id':'100000', 'question_id':'',
    'user_answer':'', 'correct':''});

// Table: level
print('Start to create the subject_level data.');
db.subject_level.insert({'sbj_name':'数学', 'level':'1',
    'desc':'10 以内加减法', 'level_points':'addition-1,subtract-1'});
db.subject_level.insert({'sbj_name':'数学', 'level':'2',
    'desc':'20 以内加减法', 'level_points':'addition-2,subtract-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'3',
    'desc':'50 以内加减法', 'level_points':'addition-3,subtract-3,carry-1,borrow-1'});
db.subject_level.insert({'sbj_name':'数学', 'level':'4',
    'desc':'100 以内加减法', 'level_points':'addition-4,subtract-4,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'5',
    'desc':'多数位加减法', 'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'5',
    'desc':'连续加减法', 'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'5',
    'desc':'连续混合加减法', 'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});

print('The metadb has been created successfully.');
