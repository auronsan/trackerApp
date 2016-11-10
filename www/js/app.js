// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.loginController', 'starter.homeController', 'starter.profileController', 'starter.mapController', 'starter.friendsController', 'ngCordova'])
    .factory('dataService', function($http, constant) {
        return {
            // Register user
            registerUser: function(userData) {
                return $http.put(constant.apiBaseAddress + constant.createUserApi, userData)
                    .then(function(response) {
                        console.log("Registration success");
                        return response.data;
                    }, function(error) {
                        console.log("Registration failed : " + error.data.error.message);
                        return error.data;
                    });
            },

            // Login
            login: function(loginData) {
                return $http.post(constant.apiBaseAddress + constant.loginApi, loginData)
                    .then(function(response) {
                        console.log("Login successful");
                        return response.data;
                    }, function(error) {
                        console.log("Login failed : " + error.data.error.message)
                        return error.data;
                    });
            },

            logout: function(accessToken) {
                return $http.post(constant.apiBaseAddress + constant.logoutApi + "?access_token=" + $scope.accessToken)
                    .then(function(response) {
                        console.log("Logout succesful");
                        return response.data;
                    }, function(error) {
                        console.log("Logout failed : " + error.data.error.message);
                        return error.data;
                    });
            },

            // Get user by id
            getUserById: function(id, accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getUserApi + "/" + id + "?access_token=" + accessToken)
                    .then(function(response) {
                        console.log("User retrieved");
                        return response.data;
                    }, function(error) {
                        console.log("Failed to retrieve user : " + error.data.error.message);
                        return error.data;
                    });
            },

            saveProfile: function(profile, accessToken) {
                return $http.put(constant.apiBaseAddress + constant.saveProfileApi + "?access_token=" + accessToken, profile)
                    .then(function(response) {
                        console.log("Profile is saved");
                        return response.data;
                    }, function(error) {
                        console.log("Failed to save profile : " + error.data.error.message);
                        return error.data;
                    })
            },

            // Get all profiles
            getAllProfiles: function(accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?access_token=" + accessToken)
                    .then(function(response) {
                        return response.data;
                    });
            },

            // Get profile by id
            getProfileById: function(userId, accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getProfileApi + "/" + userId + "?access_token=" + accessToken)
                    .then(function(response) {
                        return response.data;
                    });
            },

            // Get profile by user id
            getProfileByUserId: function(userId, accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId]=" + userId + "&access_token=" + accessToken)
                    .then(function(response) {
                        console.log('Profile retrieved');
                        if (response.data.length > 0) {
                            return response.data[0]; // return first content
                        } else {
                            return null;
                        }
                    }, function(error) {
                        consoloe.log('Failed to retrieve profile :' + error.data.error.message);
                        return error.data;
                    })
            },

            // Get stranger profiles
            getStrangerProfiles: function(userId, accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId][neq]=" + userId + "&access_token=" + accessToken)
                    .then(function(response) {
                        console.log('Profiles retrieved');
                        return response.data;
                    }, function(error) {
                        console.log('Failed to retrieve profiles : ' + error.data.error.message);
                        return error.data;
                    });
            },

            // Add friend
            addFriend: function(friendshipData, accessToken) {
                return $http.put(constant.apiBaseAddress + constant.addFriendshipApi + "?access_token=" + accessToken, friendshipData)
                    .then(function(response) {
                        console.log('Friendship created');
                        return response.data;
                    }, function(error) {
                        console.log('Failed to create friendship : ' + error.data.error.message);
                        return error.data;
                    });
            },

            // get Friends
            getFriends: function(userId, accessToken) {
                return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?filter[include][Befriend][where][id]=" + userId + "&access_token=" + accessToken)
                    .then(function(response) {
                        console.log('Friends retrieved')
                        return response.data.Befriend;
                    }, function(error) {
                        console.log('Failed to retrieve friends : ' + error.data.error.message);
                        return error.data;
                    });
            }
        }
    })

    .constant(
    "constant", {
        // apiBaseAddress: "http://localhost:3000/api",
        apiBaseAddress: "http://ec2-52-77-253-88.ap-southeast-1.compute.amazonaws.com:3000/api",
        loginApi: "/Users/login",
        logoutApi: "/Users/logout",
        getUserApi: "/Users",
        saveProfileApi: "/Profiles",
        getProfileApi: "/Profiles",
        createUserApi: "/Users",
        addFriendshipApi: "/Friendships",
        pending: "pending",
        friend: "friend"
    })

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login',
            {
                url: '/',
                controller: 'LoginCtrl',
                templateUrl: 'templates/login.html'
            })
            .state('home',
            {
                url: '/home',
                templateUrl: 'templates/home.html',
            })
            .state('home.map', {
                url: '/map',
                views: {
                    'home-map': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('home.profile', {
                url: '/profile',
                views: {
                    'home-profile': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('home.friends', {
                url: '/friends',
                views: {
                    'home-friends': {
                        templateUrl: 'templates/friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
    })

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

