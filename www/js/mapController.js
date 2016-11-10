angular.module('starter.mapController', ['ngCordova'])
    .controller('MapCtrl', function ($scope, $ionicPlatform, $cordovaGeolocation, $filter, $http, $state, constant, dataService) {
        $scope.isLoggedOn = window.localStorage.getItem('isLoggedOn');
        if ($scope.isLoggedOn == "true") {
            $scope.loggedUserId = window.localStorage.getItem('loggedUserId');
            $scope.accessToken = window.localStorage.getItem('accessToken');
            $scope.isProfileExist = false;
            $scope.updateDate = "";
            $scope.latitude = "";
            $scope.longitude = "";
        } else {
            $state.go('login');
        }

        $scope.showMap = function () {
            var options = { timeout: 10000, enableHighAccuracy: true };
            $cordovaGeolocation.getCurrentPosition(options).then(
                function (position) {

                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                    $scope.updateDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    $scope.profile.latestLocation.lat = $scope.latitude;
                    $scope.profile.latestLocation.lng = $scope.longitude;
                    $scope.profile.latestUpdateDate = $scope.updateDate;

                    // Save profile)
                    var saveProfileResData = dataService.saveProfile($scope.profile, $scope.accessToken);
                    saveProfileResData.then(function(resData){
                        $scope.profile = resData;        
                    });

                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    // Wait until the map is loaded
                    google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: latLng
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: "Here I am!"
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open($scope.map, marker)
                        });

                    });
                }, function (error) {
                    console.log('Could not get location');
                });
        }

        // Initialize Data
        $scope.initializeData = function (userId, accessToken) {
            // Get logged user data
            var getUserByIdResData = dataService.getUserById(userId, accessToken);
            getUserByIdResData.then(function (resData) {
                if (resData.error == undefined) {
                    $scope.user = resData;
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
                        $scope.showMap();
                    });
                }
            });
        }

        $ionicPlatform.ready(function () {
            $scope.initializeData($scope.loggedUserId, $scope.accessToken);
        })
    })
