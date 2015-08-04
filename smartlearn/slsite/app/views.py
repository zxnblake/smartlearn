import datetime
from django.http import HttpResponse, Http404
import crypt
import simplejson
from slsite.model.datamodels import *
from mongoengine.errors import *
from mongoengine.queryset import QuerySet
from mongoengine import *
from slsite.settings import DBNAME
import random
import time
import slsite.app.utils as slutils

#import pydevd
#pydevd.settrace('localhost', port=9090, stdoutToServer=True, stderrToServer=True)

BELOW_RANK = -1
SAME_RANK = 0
ABOVE_RANK = 1
DIFFERENT_RANK = 2


def register(request):
    resp = {'result': "", 'code': 0, 'message': ""}
    print('received an http request: user register!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    userName = req['userName']
    password = req['password']
    print('userName == %s' %userName)

    usr = User(name=userName, password=password)
    try:
        uCount = User.objects(name=userName, password=password).count()
        if uCount >= 1:
            print('uCount=%d' %uCount)
            resp['result'] = "error"
            resp['code'] = 100
            resp['message'] = "username already exists"
        else:
            usr.save()
            resp['result'] = "success"
            print(resp['result'])
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when adding user to database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def login(request):
    resp = {'result': "", 'code': 0, 'message': ""}
    print('received an http request: user login!')
    print('request.body == %s' %request.body)

    if len(request.body) == 0:
        userName = request.COOKIES.get('userName', '')
        print('userName from cookie is: ' + userName)
        if userName is not None and len(userName) > 0:
            resp['result'] = userName
        else:
            resp['code'] = 110
        respstr = simplejson.dumps(resp)
        return HttpResponse(respstr)

    req = simplejson.loads(request.body)
    print('the req == ' + str(req))
    userName = req['userName']
    password = req['password']

    print('userName == %s' %userName)

    usr = User(name=userName, password=password)

    try:
        uCount = User.objects(name=userName, password=password).count()
        if uCount >= 1:
            print('uCount=%d' %uCount)
            resp['result'] = "success"
        else:
            resp['result'] = "error"
            resp['code'] = 110
            resp['message'] = "incorrect username or password"
            print(resp['result'])
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when adding user to database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    httpResp = HttpResponse(respstr)
    if resp['result'] == "success":
        httpResp.set_cookie('userName', userName, 120)
    return httpResp


def logout(request):
    resp = {'result': "success", 'code': 0, 'message': ""}
    respstr = simplejson.dumps(resp)
    print(respstr)
    httpResp = HttpResponse(respstr)
    httpResp.delete_cookie('userName')
    return httpResp


def get_subject_levels(request):
    resp = {'result': "success", 'code': 0, 'message': ""}
    print('received an http request: get subject levels!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    subject = req['subject']
    print('subject == %s' %subject)

    try:
        levels = Subject_level.objects(sbj_name=subject)
        lvls = []
        for level in levels:
            lvl = slutils.to_level_dict(level)
            lvls.append(lvl)
            print('level: ' + simplejson.dumps(lvl))
        if len(levels) >= 1:
            print('level count=%d' %len(levels))
            resp['result'] = lvls
        else:
            resp['code'] = 120
            resp['result'] = "no level found"
            print(resp['result'])
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when querying database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def create_task(request):
    resp = {'result': "success", 'code': 0, 'message': ""}
    print('received an http request: create challenge!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    subject = req['subject']
    userName = req['userName']
    levelName = req['levelName']
    taskType = req['taskType']

    try:
        # 1. select 10 questions by the given level
        questions = __get_questions_by_level(subject, levelName)
        selectedQuestions = __select_rand_questions(questions, 10)
        print('selectedQuestions =')
        print(selectedQuestions)

        # 2. create a new task record
        today = datetime.date.today()
        ctime = int(time.time())
        taskNew = Task(type=taskType, user_name=userName, sbj_name=subject,
                    date=str(today), create_time=str(ctime), time_used='',
                    time_limit='', question_num='10', score='')
        taskNew.save()
        tasks = Task.objects(user_name=userName, sbj_name=subject,
                            create_time=str(ctime))
        print('tasks =')
        print(tasks)

        if len(tasks) == 1:
            task = tasks[0]
            print('new task is added with id=%s' %task.id)
            for quest in selectedQuestions:
                taskQuest = Task_question(task_id=str(task.id),
                                          question_id=str(quest.id),
                                          user_answer='',
                                          correct='')
                taskQuest.save()
            taskResp = __make_task_resp(task, selectedQuestions)
            print(taskResp)
            resp['result'] = taskResp
        else:
            resp['code'] = 130
            resp['result'] = "failed to add new task"
            print(resp['result'])
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when accessing database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def __make_task_resp(task, selectedQuestions):
    taskResp = slutils.to_task_dict(task)
    selQuests = []
    for quest in selectedQuestions:
        q = slutils.to_question_dict(quest)
        q['user_answer'] = ''
        q['correct'] = ''
        selQuests.append(q)
    taskResp['questions'] = selQuests
    return taskResp


def __select_rand_questions(questions, count):
    selectedQuests = random.sample(questions, count)
    return selectedQuests


def __get_questions_by_level(subject, level):
    questions = Question.objects(sbj_name=subject, level=level)
    return questions


def __compareRank(questPoints, levelPointsDict):
    rk = SAME_RANK
    for qptrk in questPoints:
        qpt, qrk = __get_point_rank(qptrk)
        lrk = levelPointsDict[qpt]
        if lrk is None or qrk > lrk:
            return DIFFERENT_RANK
        elif qrk < lrk:
            rk = BELOW_RANK
    return rk


def __get_point_rank(pointRankStr):
    pr = pointRankStr.split('-')
    return pr[0], pr[1]


def submit_result(request):
    resp = {'result': "success", 'code': 0,
            'message': "task result is submitted successfully"}
    print('received an http request: submit task result!')
    print('request.body == %s' %request.body)

    taskSubmit = simplejson.loads(request.body)
    taskid = taskSubmit['id']
    startTime = taskSubmit['start_time']
    timeUsed = taskSubmit['time_used']
    score = taskSubmit['score']
    questions = taskSubmit['questions']

    try:
        tasks = Task.objects(id=taskid)
        if len(tasks) == 1:
            task = tasks[0]
            print('task is found with id=%s' % task.id)
            print('start to update the task with submitted result...')
            task.update(start_time=startTime, time_used=timeUsed, score=score)

            print('start to update the task questions...')
            for quest in questions:
                questions = Task_question.objects(task_id=taskid,
                                                  question_id=quest['question_id'])
                question = questions[0]
                question.update(user_answer=quest['user_answer'],
                                correct=quest['correct'])
        else:
            resp['code'] = 140
            resp['result'] = "failed to find the task"
            print(resp['result'])
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when querying database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def get_user_assessment(request):
    resp = {'result': "", 'code': 0, 'message': ""}
    print('received an http request: get user assessment!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    userName = req['userName']
    print('userName == %s' %userName)

    try:
        assessments = Assessment.objects(user_name=userName)
        userAss = {}
        userAss['user_name'] = userName
        sbjAssessMap = {}
        for assessment in assessments:
            assess = {}
            assess['sbj_name'] = assessment.sbj_name
            assess['level'] = assessment.level
            assess['next_level'] = assessment.next_level
            assess['weak_points'] = assessment.weak_points
            sbjAssessMap[assessment.sbj_name] = assess
        userAss['sbjAssessMap'] = sbjAssessMap
        resp['result'] = userAss
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when getting user assessments"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def get_task_history(request):
    resp = {'result': "success", 'code': 0, 'message': ""}
    print('received an http request: get task history!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    userName = req['userName']
    subject = req['subject']
    taskType = req['taskType']

    try:
        tasks = Task.objects(user_name=userName, sbj_name=subject,
                             type=taskType)
        tsks = []
        for task in tasks:
            tsk = slutils.to_task_dict(task)
            tsks.append(tsk)
            print('level: ' + simplejson.dumps(tsk))
        tsks.sort(key=lambda x:x['date'], reverse=True)
        resp['result'] = tsks
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when querying database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def get_task_questions(request):
    resp = {'result': "success", 'code': 0,
            'message': "task detail is fetched successfully"}
    print('received an http request: get task detail!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    taskid = req['taskId']
    print('taskid == %s' %taskid)

    try:
        taskQuestions = Task_question.objects(task_id=taskid)
        print(taskQuestions)
        tqs = []
        for taskQuest in taskQuestions:
            tq = slutils.to_task_question_dict(taskQuest)
            quests = Question.objects(id=taskQuest.question_id)
            quest =  quests[0]
            tq['content'] = quest.content
            tq['answer'] = quest.answer
            tqs.append(tq)
        resp['result'] = tqs
    except OperationError as e:
        resp['result'] = "error"
        resp['code'] = 99
        resp['message'] = "error occurred when querying database"

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)
