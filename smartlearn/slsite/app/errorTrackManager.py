from slsite.model.datamodels import *


class ErrorTrackManager:
    def __init__(self):
        print('Creating ErrorTrackManager...')

    def get_error_tracks_by_subject(self, user, subject):
        errorQuests = []
        errtrks = Error_track.objects(user_name=user)
        for errtrk in errtrks:
            qid = errtrk.question_id
            quest = Question.objects(id=qid)[0]
            if quest.sbj_name == subject:
                errorQuests.append(quest)
        return errorQuests



