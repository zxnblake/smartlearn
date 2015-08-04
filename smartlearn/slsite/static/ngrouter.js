'use strict';

var sqm = angular.module('smartlearn',
	[
		'ngRoute',
		'smartlearn.userMgmtController',
		'smartlearn.studyMgmtController'
	]
);

sqm.config(
	[
		'$routeProvider',
		function($routeProvider)
		{
			//$routeProvider.when('/', {templateUrl:'index.html', controller:'userMgmtCtrl'});
			$routeProvider.when('/reg', {templateUrl:'htmls/reg.html', controller:'userMgmtCtrl'});
			$routeProvider.when('/login', {templateUrl:'htmls/login.html', controller:'userMgmtCtrl'});
			$routeProvider.when('/logout', {templateUrl:'htmls/login.html', controller:'userMgmtCtrl'});
			$routeProvider.when('/userInfo', {templateUrl:'htmls/userCenter.html', controller:'userMgmtCtrl'});
			$routeProvider.when('/main', {templateUrl:'htmls/main.html', controller:'studyMgmtCtrl'});
		}
	]
);
