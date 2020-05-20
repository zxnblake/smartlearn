'use strict';

/* Services */
angular.module('smartlearn.services', ['ngResource']).
  factory('smartLearnService', ['$resource', function ($resource) {
      var hdr = {'Content-Type': 'application/x-www-form-urlencoded'};
	  var actions = 
	  { 
		  'register': {method:'POST', url:'/user/register/', headers: hdr},
		  'login': {method:'POST', url:'/user/login/', headers: hdr},
		  'logout': {method:'POST', url:'/user/logout/', headers: hdr},
		  'getSubjLevels': {method:'POST', url:'/study/subjectLevels/', headers: hdr},
		  'createTask': {method:'POST', url:'/study/createTask/', headers: hdr},
		  'getUserAssessment': {method:'POST', url:'/study/userAssessment/', headers: hdr},
		  'getTaskHistory': {method:'POST', url:'/study/taskHistory/', headers: hdr},
		  'submitResult': {method:'POST', url:'/study/submitResult/', headers: hdr},
		  'getTaskQuestions': {method:'POST', url:'/study/taskQuestions/', headers: hdr},
		  'getSubjGradePoints': {method:'POST', url:'/study/subjectGradeAndPoints/', headers: hdr},
		  'createTest': {method:'POST', url:'/study/createTest/', headers: hdr}
      };
	  
      return $resource("/", null, actions );      

  }]);

