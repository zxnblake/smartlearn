var userMgmtController = angular.module('smartlearn.userMgmtController', ['smartlearn.services']);

userMgmtController.controller('userMgmtCtrl', ['$scope', 'smartLearnService', '$compile',
	function($scope, smartLearnService, $compile)
	{
		$scope.userReg = {userName: "", password: "", passwordRepeat: ""};
		$scope.userLogin = {userName: "", password: "" };
        var currUserElm = document.getElementById("currUser");

		$scope.registerUser = function()
		{
			smartLearnService.register($scope.userReg,
				function(resp)
				{
					if ( resp.result == "success" )
					{
						console.log("The user is registered successfully!");
						window.location.href = "#/login";
					}
                    else if ( resp.code == 100 )
                    {
						var userExistsLabel = document.getElementById("userExistsLabel");
						userExistsLabel.style.display = "block";
                    }
					
				},
				function(err)
				{
					console.log("Error occurred during user login: " + err);
				}
			);
		};

		$scope.login = function()
		{
			smartLearnService.login($scope.userLogin,
				function(resp)
				{
					if ( resp.code == "0" )
					{
						console.log("The user is logged in successfully!");
						window.location.href = "#/main";
						currUserElm.innerHTML = $scope.userLogin.userName;
						
						var regLoginBtnElm = document.getElementById("regLoginBtn");
						var logoutBtnElm = document.getElementById("logoutBtn");
						regLoginBtnElm.style.display = "none";
						logoutBtnElm.style.display = "block";
					}
                    else if ( resp.code == 110 )
                    {
						var userNotExistsLabel = document.getElementById("userNotExistsLabel");
						userNotExistsLabel.style.display = "block";
                    }
				},
				function(err)
				{
					console.log("Error occurred during user login: " + err);
				}
			);
		};

		$scope.logout = function()
		{
			smartLearnService.logout(
				function(resp)
				{
					if ( resp.result == "success" )
					{
						console.log("The user is logged out successfully!");
					}

				},
				function(err)
				{
					console.log("Error occurred during user registration: " + err);
				}
			);

			currUserElm.innerHTML = '';
			var regLoginBtnElm = document.getElementById("regLoginBtn");
			var logoutBtnElm = document.getElementById("logoutBtn");
			regLoginBtnElm.style.display = "block";
			logoutBtnElm.style.display = "none";
		};

		var currUrl = window.location.href;
		if ( currUrl.indexOf("logout") >= 0 )
		{
            $scope.logout();
		}
	}
]); 
