/**
 * Created by Xiao Ning Zhang on 6/8/15.
 */

conn = new Mongo();
db = conn.getDB("smartlearn");

// Table: user
db.user.remove({});

// Table: subject
db.subject.remove({});

// Table: subject_point
db.subject_point.remove({});

// Table: question
db.question.remove({});

// Table: assessment
db.assessment.remove({});

// Table: daily_task
db.daily_task.remove({});

// Table: task_question
db.task.remove({});

// Table: task_question
db.task_question.remove({});

// Table: level
db.subject_level.remove({});


