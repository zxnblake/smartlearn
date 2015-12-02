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
print('=====================================')

// add initial data to db
// Table: user
db.user.insert({'name':'zxn', 'password':'zxn', 'true_name':'zxn',
    'gender':'male', 'age':'39'});

// Table: subject
db.subject.insert({'name':'数学'});

// Table: subject_point
print('Start to create the subject_point data.');
// addition and subtract
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
// number comparison
db.subject_point.insert({'sbj_name':'数学', 'point':'comparison', 'rank':'1', 'desc':'数的比较'});
// number sequence
db.subject_point.insert({'sbj_name':'数学', 'point':'sequence', 'rank':'1', 'desc':'数的序列'});

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
db.createCollection('task_question');

// Table: level
print('Start to create the subject_level data.');
db.subject_level.insert({'sbj_name':'数学', 'level':'1', 'desc':'10 以内加减法',
    'level_points':'addition-1,subtract-1'});
db.subject_level.insert({'sbj_name':'数学', 'level':'2', 'desc':'20 以内加减法',
    'level_points':'addition-2,subtract-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'3', 'desc':'50 以内加减法',
    'level_points':'addition-3,subtract-3,carry-1,borrow-1'});
db.subject_level.insert({'sbj_name':'数学', 'level':'4', 'desc':'100 以内加减法',
    'level_points':'addition-4,subtract-4,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'5', 'desc':'多数位加减法',
    'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'6', 'desc':'连续加减法',
    'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});
db.subject_level.insert({'sbj_name':'数学', 'level':'7', 'desc':'连续混合加减法',
    'level_points':'addition-5,subtract-5,carry-1,borrow-1,carry-2,borrow-2'});

// Table: weak_point
db.createCollection('weak_point');

// Table: error_track
db.createCollection('error_track');

// Table: grade_point
print('Start to create the grade_point data.');
db.grade_point.insert({'sbj_name':'数学', 'grade':'1',
    'point_name':'addsub1', 'weight':'60'});
db.grade_point.insert({'sbj_name':'数学', 'grade':'1',
    'point_name':'comparison1', 'weight':'30'});
db.grade_point.insert({'sbj_name':'数学', 'grade':'1',
    'point_name':'sequence1', 'weight':'10'});
db.grade_point.insert({'sbj_name':'数学', 'grade':'2',
    'point_name':'addsub2', 'weight':'60'});

// Table: point_level
print('Start to create the point_level data.');
db.point_level.insert({'sbj_name':'数学', 'point_name':'addsub1',
    'desc':'20 以内加减法', 'level_points':'addition-3,subtract-3'});
db.point_level.insert({'sbj_name':'数学', 'point_name':'comparison1',
    'desc':'简单数的比较', 'level_points':'comparison-1'});
db.point_level.insert({'sbj_name':'数学', 'point_name':'sequence1',
    'desc':'简单数列的规律', 'level_points':'sequence-1'});
db.point_level.insert({'sbj_name':'数学', 'point_name':'addsub2',
    'desc':'100 以内进位借位加减法', 'level_points':'addition-5,subtract-5,carry-2,borrow-2'});

print('The metadb has been created successfully.');
