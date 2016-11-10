angular.module('starter.profileController', ['ngCordova'])
    .controller('ProfileCtrl', function ($ionicPlatform, $scope, constant, dataService) {
        // Local variables
        $scope.loggedUserId = window.localStorage.getItem('loggedUserId');
        $scope.accessToken = window.localStorage.getItem('accessToken');

        // Get user data by id
        $scope.initializeData = function (userId, accessToken) {
            // Get user data 
            var getUserByIdResData = dataService.getUserById(userId, accessToken);
            getUserByIdResData.then(function (resData) {
                if (resData.error == undefined) {
                    $scope.user = resData;
                    // Get profile data
                    var getProfileByUserIdResData = dataService.getProfileByUserId(userId, accessToken);
                    getProfileByUserIdResData.then(function (resData) {
                        if (resData != null) {
                            $scope.isProfileExist = true;
                            $scope.profile = resData;
                        } else {
                            $scope.profile = {
                                "name": $scope.user.username,
                                "latestLocation": {
                                    "lat": 0,
                                    "lng": 0
                                },
                                "latestUpdateDate": "",
                                "userId": userId
                            }
                        }
                    });
                }
            });
        }

        $ionicPlatform.ready(function () {
            // Initialize Data
            $scope.initializeData($scope.loggedUserId, $scope.accessToken);
        })
    });