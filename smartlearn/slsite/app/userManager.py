from slsite.model.datamodels import *


class UserManager:
    def __init__(self):
        print('Creating UserManager...')

    def register(self, args, resp):
        userName = args['userName']
        password = args['password']
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

    def login(self, userName, password, resp):
        try:
            uCount = User.objects(name=userName, password=password).count()
            if uCount == 1:
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
