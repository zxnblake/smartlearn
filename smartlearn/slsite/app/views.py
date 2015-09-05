from django.http import HttpResponse, Http404
import simplejson
from slsite.model.datamodels import *
from mongoengine import *
import slsite.app.utils as slutils
from taskManager import TaskManager
from assessmentManager import AssessmentManager
from userManager import UserManager

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

    args = simplejson.loads(request.body)
    usrMgr = UserManager()
    usrMgr.register(args, resp)

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
    usrMgr = UserManager()
    usrMgr.login(userName, password, resp)

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

    args = simplejson.loads(request.body)
    tm = TaskManager()
    tm.create_task(args, resp)

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


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
    tm = TaskManager()
    tm.submit_result(taskSubmit, resp)

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def get_user_assessment(request):
    resp = {'result': "", 'code': 0, 'message': ""}
    print('received an http request: get user assessment!')
    print('request.body == %s' %request.body)

    req = simplejson.loads(request.body)
    userName = req['userName']
    assessMgr = AssessmentManager()
    assessMgr.get_user_assessment(userName, resp)

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)


def get_task_history(request):
    resp = {'result': "success", 'code': 0, 'message': ""}
    print('received an http request: get task history!')
    print('request.body == %s' %request.body)

    args = simplejson.loads(request.body)
    tm = TaskManager()
    tm.get_task_history(args, resp)

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
    tm = TaskManager()
    tm.get_task_questions(taskid, resp)

    respstr = simplejson.dumps(resp)
    print(respstr)
    return HttpResponse(respstr)
