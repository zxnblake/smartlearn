def convert_to_builtin_type(obj):
    d = {}
    d.update(obj.__dict__)
    return d


def to_level_dict(level):
    d = {}
    d['id'] = str(level.id)
    d['level'] = level.level
    d['sbj_name'] = level.sbj_name
    d['desc'] = level.desc
    d['level_points'] = level.level_points
    return d


def to_task_dict(task):
    d = {}
    d['id'] = str(task.id)
    d['type'] = task.type
    d['user_name'] = task.user_name
    d['sbj_name'] = task.sbj_name
    d['date'] = task.date
    d['create_time'] = task.create_time
    d['start_time'] = task.start_time
    d['time_used'] = task.time_used
    d['time_limit'] = task.time_limit
    d['question_num'] = task.question_num
    d['score'] = task.score
    return d


def to_question_dict(quest):
    q = {}
    q['question_id'] = str(quest.id)
    q['content'] = quest.content
    q['answer'] = quest.answer
    return q


def to_task_question_dict(quest):
    q = {}
    q['task_id'] = str(quest.task_id)
    q['question_id'] = str(quest.id)
    q['user_answer'] = quest.user_answer
    q['correct'] = quest.correct
    return q
