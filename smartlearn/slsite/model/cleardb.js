/**
 * Created by Xiao Ning Zhang on 6/8/15.
 */

function ClearDB()
{
    this.cleardb = function(db)
    {
        // Table: user
        db.user.drop();

        // Table: subject
        db.subject.drop();

        // Table: question
        db.question.drop();

        // Table: assessment
        db.assessment.drop();

        // Table: daily_task
        db.daily_task.drop();

        // Table: task_question
        db.task.drop();

        // Table: task_question
        db.task_question.drop();

        // Table: grade_point
        db.grade.drop();

        // Table: grade_point
        db.grade_point.drop();

        // Table: point_level
        db.point_level.drop();

        // Table: grade_point
        db.test_assess.drop();

        // Table: point_level
        db.point_assess.drop();

        print('The metadb has been cleared.');
    }
}
