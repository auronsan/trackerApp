angular.module('starter.homeController', ['ngCordova'])
.controller('HomeCtrl', function($scope, $state){
        
        // Navigate to login screen
        $scope.goToLogin = function () {
            $state.go('login', null, { reload: true });
        }
});