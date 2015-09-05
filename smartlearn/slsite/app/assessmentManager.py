from slsite.model.datamodels import *


class AssessmentManager:
    def __init__(self):
        print('Creating AssessmentManager...')

    def get_user_assessment(self, userName, resp):
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

