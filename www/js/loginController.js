angular.module('starter.loginController', ['ngCordova'])
    .controller('LoginCtrl', function ($rootScope, $scope, $ionicPlatform, $ionicModal, $http, $state, constant, dataService) {
        $scope.isLoggedOn = window.localStorage.getItem('isLoggedOn');
        $scope.accessToken = window.localStorage.getItem('accessToken');
        $scope.loggedUserId = window.localStorage.getItem('loggedUserId');

        $scope.initializeData = function (userId, accessToken) {
            // Get user data
            var getUserByIdResData = dataService.getUserById($scope.loggedUserId, $scope.accessToken);
            getUserByIdResData.then(function (resData) {
                if (resData.error == undefined) {
                    $scope.user = resData;
                }
            });
        }

        // Navigate to home
        $scope.goToHome = function () {
            $state.go('home.map', null, { reload: true });
        }

        // Register user
        $scope.registerUser = function (username, password, email) {
            var data = {
                "username": username,
                "password": password,
                "email": email,
            };

            var registerUserResData = dataService.registerUser(data);
            registerUserResData.then(function (resData) {
                if (resData.error == undefined) {
                    $scope.closeRegModal();
                    $scope.login(username, password);
                }
            });
        }

        // Login
        $scope.login = function (username, password) {
            var data = {
                "username": username,
                "password": password,
            };

            var loginResData = dataService.login(data);
            loginResData.then(function (resData) {
                if (resData.error == undefined) {
                    // Save token to storage
                    $scope.accessToken = resData.id;
                    $scope.loggedUserId = resData.userId;
                    $scope.isLoggedOn = true;
                    window.localStorage.setItem('accessToken', resData.id);
                    window.localStorage.setItem('loggedUserId', resData.userId);
                    window.localStorage.setItem('isLoggedOn', true);
                    $scope.closeLoginModal();
                    // Go to home
                    $state.go('home.map', null, { reload: true });
                }
            });
        }

        // Preparing login modal
        $scope.registerLoginModal = function () {
            $ionicModal.fromTemplateUrl('templates/loginModal.html', {
                scope: $scope,
                animation: 'slide-in-up',
            }).then(function (modal) {
                $scope.loginModal = modal;
            });
        }

        $scope.registerRegistrationModal = function () {
            // Preparing registration modal
            $ionicModal.fromTemplateUrl('templates/registrationModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.regModal = modal;
            })
        }

        // Show login modal
        $scope.showLoginModal = function () {
            $scope.loginModal.show();
        }

        // Close login modal
        $scope.closeLoginModal = function () {
            $scope.loginModal.hide();
        }

        // Login modal on remove action
        $scope.$on('loginModal.removed', function () {
            // Do something
        })

        // Show registration modal
        $scope.showRegModal = function () {
            $scope.regModal.show();
        }

        // Reg modal removal action
        $scope.$on('regModal.removed', function () {
            // Do something
        })

        // Close reg modal
        $scope.closeRegModal = function () {
            $scope.regModal.hide();
        }

        // Modals cleanup
        $scope.$on('$destroy', function () {
            $scope.loginModal.remove();
            $scope.regModal.remove();
        })

        // register Modals
        $ionicPlatform.ready(function () {
            if ($scope.isLoggedOn == "true") {
                $scope.initializeData($scope.loggedUserId, $scope.accessToken);
            }
            
            $scope.registerLoginModal();
            $scope.registerRegistrationModal();
        })
    })

