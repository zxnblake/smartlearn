import datetime
from mongoengine import *
from slsite.model.datamodels import *
import random
import slsite.app.utils as slutils
from errorTrackManager import ErrorTrackManager
import simplejson
import time


class TaskManager:
    def __init__(self):
        print('Creating TaskManager...')

    def create_task(self, args, resp):
        subject = args['subject']
        userName = args['userName']
        levelName = args['levelName']
        taskType = args['taskType']

        questNum = 10
        if taskType == 'challenge':
            questNum = 10

        try:
            # 1. we will include error questions in weekend homework
            selectedQuestions = []
            dt = datetime.datetime.now()
            wd = dt.weekday()
            print('weekday = ', wd)
            if wd <= 5 or wd == 6:
                errTrkMgr = ErrorTrackManager()
                selectedQuestions = errTrkMgr.get_error_tracks_by_subject(userName, subject)
                print('errorQuestions =')
                print(selectedQuestions)

            # 2. select questions from question table by the given level
            count = len(selectedQuestions)
            if count < questNum:
                commQuests = self.__get_questions_by_level(subject, levelName)
                selCommQuests = self.__select_rand_questions(commQuests, questNum-count)
                selectedQuestions.extend(selCommQuests)
                if count > 0:
                    random.shuffle(selectedQuestions)
            else:
                selectedQuestions = self.__select_rand_questions(selectedQuestions, questNum)
            print('selectedQuestions =')
            print(selectedQuestions)

            # 3. create a new task record
            today = datetime.date.today()
            ctime = int(time.time())
            taskNew = Task(type=taskType, user_name=userName, sbj_name=subject, level=levelName,
                        date=str(today), create_time=str(ctime), time_used='',
                        time_limit='', question_num=str(questNum), score='')
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
                taskResp = self.__make_task_resp(task, selectedQuestions)
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

    def submit_result(self, taskSubmit, resp):
        taskid = taskSubmit['id']
        startTime = taskSubmit['start_time']
        timeUsed = taskSubmit['time_used']
        score = taskSubmit['score']
        taskQuestions = taskSubmit['questions']
        subject = taskSubmit['sbj_name']
        grade = taskSubmit['level']
        userName = taskSubmit['user_name']

        try:
            tasks = Task.objects(id=taskid)
            if len(tasks) == 1:
                task = tasks[0]
                print('task is found with id=%s' % task.id)
                print('start to update the task with submitted result...')
                task.update(start_time=startTime, time_used=timeUsed, score=score)

                print('process the questions one by one')
                ptcount = {}
                pterror = {}
                for quest in taskQuestions:
                    # update task question
                    tqs = Task_question.objects(task_id=taskid,
                                                question_id=quest['question_id'])
                    taskQuest = tqs[0]
                    taskQuest.update(user_answer=quest['user_answer'],
                                    correct=quest['correct'])

                    # handle error track
                    self.__handleErrorTrack(quest, userName)

                    # handle statistics
                    questions = Question.objects(id=quest['question_id'])
                    question = questions[0]
                    print('question : ', question)
                    self.__handlePointStat(quest, question.grade_point, ptcount, pterror)

                print('ptcount : ', ptcount)
                print('pterror : ', pterror)
                newTestAssess = Test_assess(user_name=userName, sbj_name=subject,
                                            grade=grade, task_id=str(task.id))
                newTestAssess.save()
                ntas = Test_assess.objects(task_id=str(task.id))
                if len(ntas) == 1:
                    nta = ntas[0]
                    print('new test assess is added with id=%s' % str(nta.id))
                    testAssess = {'user_name': userName, 'sbj_name': subject,
                                  'grade': grade, 'test_assess_id': str(nta.id)}
                    pointAssessList = []
                    for point in ptcount:
                        count = ptcount[point]
                        errCount = pterror[point]
                        correctCount = count - errCount
                        passRate = float(correctCount) / float(count)
                        passRate = str('%.2f' % passRate)
                        newPointAssess = Point_assess(test_assess_id=str(nta.id),
                                                      point_name=point,
                                                      quest_count=str(count),
                                                      correct_count=str(correctCount),
                                                      pass_rate=passRate)
                        newPointAssess.save()
                        gradePoints = Grade_point.objects(point_name=point)
                        gradePoint = gradePoints[0]
                        pa = {'point_desc': gradePoint.point_desc, 'pass_rate': passRate}
                        pointAssessList.append(pa)

                    testAssess['pointAssessList'] = pointAssessList
                    resp['result'] =  testAssess
            else:
                resp['code'] = 140
                resp['result'] = "failed to find the task"
                print(resp['result'])
        except OperationError as e:
            resp['result'] = "error"
            resp['code'] = 99
            resp['message'] = "error occurred when querying database"

        if score == 100:
            print('succeeded to pass the test, very good performance!')

    def __handlePointStat(self, quest, pt, ptcount, pterror):
        print('question points: ', pt)
        if pt in ptcount:
            ptcount[pt] += 1
        else:
            ptcount[pt] = 1
            pterror[pt] = 0
        if quest['correct'] == 'false':
            if pt in pterror:
                pterror[pt] += 1

    def __handleErrorTrack(self, quest, userName):
        errtrks = Error_track.objects(user_name=userName,
                                      question_id=quest['question_id'])
        print('error tracks == ' + str(errtrks))
        if len(errtrks) == 1:
            errtrk = errtrks[0]
            if quest['correct'] == 'false':
                errtime = int(errtrk['error_repeat_count']) + 1
                errtrk.update(user_answer=quest['user_answer'],
                              error_repeat_count=str(errtime))
            else:
                errtrk.delete()
        else:
            if quest['correct'] == 'false':
                errtrk = Error_track(user_name=userName, question_id=quest['question_id'],
                                     user_answer=quest['user_answer'], error_repeat_count='1')
                errtrk.save()
                print('insert new error tracks: ', str(errtrk.id))

    def get_task_history(self, args, resp):
        userName = args['userName']
        subject = args['subject']
        taskType = args['taskType']

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

    def get_task_questions(self, taskid, resp):
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

    def __make_task_resp(self, task, selectedQuestions):
        taskResp = slutils.to_task_dict(task)
        selQuests = []
        for quest in selectedQuestions:
            q = slutils.to_question_dict(quest)
            q['user_answer'] = ''
            q['correct'] = ''
            selQuests.append(q)
        taskResp['questions'] = selQuests
        return taskResp

    def __select_rand_questions(self, questions, count):
        selectedQuests = random.sample(questions, count)
        return selectedQuests

    def __get_questions_by_level(self, subject, level):
        questions = Question.objects(sbj_name=subject, level=level)
        return questions

    def __get_questions_by_point(self, subject, questPoint):
        questions = Question.objects(sbj_name=subject, grade_point=questPoint)
        return questions

    def create_test(self, args, resp):
        subject = args['subject']
        gradeDesc = args['grade']
        points = args['selectedPoints']
        userName = args['userName']
        taskType = args['taskType']

        rate = 0.05
        try:
            # 1. select questions for each point
            selectedQuestions = []
            pointNum = {}
            questNum = 0
            grades = Grade.objects(desc=gradeDesc)
            grade = grades[0]
            gradePoints = Grade_point.objects(sbj_name=subject, grade_name=grade.name)
            for gp in gradePoints:
                if gp.point_name in points:
                    num = int(int(gp.weight) * rate)
                    print('num = ', num)
                    pointNum[gp.point_name] = num
                    if num > 0:
                        quests = self.__get_questions_by_point(subject, gp.point_name)
                        print('questPoints = ', points)
                        print('quests = ', quests)
                        selQuests = self.__select_rand_questions(quests, num)
                        selectedQuestions.extend(selQuests)
                        questNum = questNum + num

            print('selectedQuestions =')
            print(selectedQuestions)

            # 2. create a new task record
            today = datetime.date.today()
            ctime = int(time.time())
            taskNew = Task(type=taskType, user_name=userName, sbj_name=subject,
                           level=grade.name, date=str(today), create_time=str(ctime),
                           time_used='', time_limit='', question_num=str(questNum),
                           score='')
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
                taskResp = self.__make_task_resp(task, selectedQuestions)
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
