angular.module('starter.friendsController', ['ngCordova'])
    .controller('FriendsCtrl', function ($scope, $ionicPlatform, $ionicModal, $http, constant, dataService) {
        $scope.isLoggedOn = window.localStorage.getItem('isLoggedOn');
        $scope.accessToken = window.localStorage.getItem('accessToken');
        $scope.loggedUserId = window.localStorage.getItem('loggedUserId');

        // $scope.showProfile = function (profile) {
        //     $scope.showProfileModal();
        //     $scope.chosenProfile = profile;
        // }

        $scope.addFriend = function(friendProfile){
            var friendshipData = {
                "userId" : $scope.loggedUserId,
                "friendsId" : friendProfile.id,
                "status" : constant.pending
            }

            var addFriendResData = dataService.addFriend(friendshipData, $scope.accessToken);
            addFriendResData.then(function(resData){
                // Refresh page somehow
            });
        }

        $scope.initializeData = function (userId, accessToken) {
            // Get logged user data
            var getUserByIdResData = dataService.getUserById(userId, accessToken);
            getUserByIdResData.then(function (resData) {
                if (resData.error == undefined) {
                    $scope.user = resData;
                    // get stranger profiles data
                    var getStrangerProfilesResData = dataService.getStrangerProfiles(userId, accessToken);
                    getStrangerProfilesResData.then(function (resData) {
                        if (resData.error == undefined) {
                            $scope.strangerProfiles = resData;
                        }
                    });
                }
            });
        }

        // // Preparing profile modal
        // $scope.registerProfileModal = function () {
        //     $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        //         scope: $scope,
        //         animation: 'slide-in-up',
        //     }).then(function (modal) {
        //         $scope.profileModal = modal;
        //     });
        // }

        // // Show profile modal
        // $scope.showProfileModal = function () {
        //     $scope.profileModal.show();
        // }

        // // Close profile modal
        // $scope.closeProfileModal = function () {
        //     $scope.profileModal.hide();
        // }

        // // Profile modal on remove action
        // $scope.$on('profileModal.removed', function () {
        //     // Do something
        // })

        // // Modals cleanup
        // $scope.$on('$destroy', function () {
        //     $scope.profileModal.remove();
        // });

        $ionicPlatform.ready(function () {
            $scope.initializeData($scope.loggedUserId, $scope.accessToken);
            // $scope.registerProfileModal();
        });
    });