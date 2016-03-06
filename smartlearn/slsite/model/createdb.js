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

// create all the tables
print('create all the tables.');
db.createCollection('user');
db.createCollection('subject');
db.createCollection('question');
db.createCollection('question_type');
db.createCollection('assessment');
db.createCollection('task');
db.createCollection('task_question');
db.createCollection('weak_point');
db.createCollection('error_track');
db.createCollection('grade');
db.createCollection('grade_point');
db.createCollection('test_assess');
db.createCollection('point_assess');

// add initial data to db
print('create initial data.');
// Table: user
db.user.insert({'name':'zxn', 'password':'zxn', 'true_name':'zxn',
    'gender':'male', 'age':'39'});

// Table: subject
db.subject.insert({'name':'数学'});

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

// Table: grade_point
print('Start to create the grade and grade_point data.');
db.grade.insert({'name':'11', 'desc':'一年级第一学期'});
db.grade.insert({'name':'12', 'desc':'一年级第二学期'});

db.grade_point.insert({'sbj_name':'数学', 'grade_name':'11',
    'point_name':'addsub-less-20', 'weight':'60',
    'point_desc':'20 以内加减法'});
db.grade_point.insert({'sbj_name':'数学', 'grade_name':'11',
    'point_name':'comparison-simple', 'weight':'30',
    'point_desc':'数的比较初步'});
db.grade_point.insert({'sbj_name':'数学', 'grade_name':'11',
    'point_name':'sequence-simple', 'weight':'20',
    'point_desc':'数的序列初步'});
db.grade_point.insert({'sbj_name':'数学', 'grade_name':'11',
    'point_name':'figure-simple', 'weight':'20',
    'point_desc':'图形和方位'});
db.grade_point.insert({'sbj_name':'数学', 'grade_name':'12',
    'point_name':'addsub-less-100', 'weight':'60',
    'point_desc':'100 以内加减法'});

print('Start to create the question_type data.');
db.question_type.insert({'type_name':'basic', 'desc':'基本类型'});
db.question_type.insert({'type_name':'carry1', 'desc':'加法一次进位'});
db.question_type.insert({'type_name':'borrow1', 'desc':'减法一次借位'});

print('Start to create the geometric figure data.');
db.figure.insert({'figure_id':'square', 'name':'正方形', 'type':'2d'});
db.figure.insert({'figure_id':'rectangle', 'name':'长方形', 'type':'2d'});
db.figure.insert({'figure_id':'circle', 'name':'圆形', 'type':'2d'});
db.figure.insert({'figure_id':'regular_triangle', 'name':'正三角形', 'type':'2d'});
db.figure.insert({'figure_id':'rightangled_triangle', 'name':'直角三角形', 'type':'2d'});
db.figure.insert({'figure_id':'regular_pentagon', 'name':'正五边形', 'type':'2d'});
db.figure.insert({'figure_id':'regular_hexagon', 'name':'正六边形', 'type':'2d'});
db.figure.insert({'figure_id':'trapezia', 'name':'梯形', 'type':'2d'});
db.figure.insert({'figure_id':'parallelogram', 'name':'平行四边形', 'type':'2d'});

print('The metadb has been created successfully.');
