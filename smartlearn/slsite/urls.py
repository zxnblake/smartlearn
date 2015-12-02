from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from app.views import *

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^user/register/$', register),
    url(r'^user/login/$', login),
    url(r'^user/logout/$', logout),
    url(r'^study/subjectLevels/$', get_subject_levels),
    url(r'^study/createTask/$', create_task),
    url(r'^study/submitResult/$', submit_result),
    url(r'^study/userAssessment/$', get_user_assessment),
    url(r'^study/taskHistory/$', get_task_history),
    url(r'^study/taskQuestions/$', get_task_questions),
    url(r'^study/subjectGradeAndPoints/$', get_grade_points),
    url(r'^study/createTest/$', create_test),
)
urlpatterns += staticfiles_urlpatterns()