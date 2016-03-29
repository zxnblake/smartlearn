from mongoengine import *
from slsite.settings import DBNAME


connect(DBNAME)

class User(Document):
    name = StringField(max_length=128)
    password = StringField()


class Subject(Document):
    name = StringField(max_length=128)


class Question(Document):
    sbj_name = StringField(max_length=128)
    content = StringField()
    grade_point = StringField()
    point_type = StringField()
    level = StringField()
    answer = StringField()
    type = StringField()
    quest_text = StringField()
    answer_options = StringField()
    content_pic = StringField()


class Task(Document):
    type = StringField()
    user_name = StringField(max_length=128)
    sbj_name = StringField(max_length=128)
    grade = StringField(max_length=4)
    date = StringField()
    create_time = StringField()
    start_time = StringField()
    time_used = StringField()
    time_limit = StringField()
    question_num = StringField()
    score = StringField()


class Task_question(Document):
    task_id = StringField()
    question_id = StringField()
    user_answer = StringField()
    correct = StringField()


class Assessment(Document):
    user_name = StringField(max_length=128)
    sbj_name = StringField(max_length=128)
    level = StringField(max_length=4)
    next_level = StringField(max_length=4)
    weak_points = StringField(max_length=128)


class Weak_point(Document):
    user_name = StringField(max_length=128)
    weak_point_id = StringField(max_length=128)


class Error_track(Document):
    user_name = StringField(max_length=128)
    question_id = StringField()
    user_answer = StringField()
    error_repeat_count = StringField()


class Grade(Document):
    name = StringField()
    desc = StringField()


class Grade_point(Document):
    grade_name = StringField(max_length=36)
    sbj_name = StringField(max_length=128)
    point_name = StringField()
    weight = StringField()
    point_desc = StringField()


class Test_assess(Document):
    user_name = StringField(max_length=128)
    sbj_name = StringField(max_length=128)
    grade = StringField(max_length=36)
    task_id = StringField()


class Point_assess(Document):
    test_assess_id = StringField()
    point_name = StringField()
    quest_count = StringField()
    correct_count = StringField()
    pass_rate = StringField()


class Question_type(Document):
    type_name = StringField()
    desc = StringField()


class Geometric_figure(Document):
    figure_id = StringField()
    name = StringField()
    type = StringField()
