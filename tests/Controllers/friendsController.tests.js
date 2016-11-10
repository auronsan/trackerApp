describe('Friends Controller', function () {
    beforeEach(function () {
        module('starter.friendsController', function ($provide) {
            // Mock constant
            constant = {
                apiBaseAddress: "http://localhost:3000/api",
                getUserApi: "/Users",
                getProfileApi: "/Profiles",
            };

            // Mock service
            services = function ($http, constant) {
                return {
                    // Get user by id
                    getUserById: function () {
                        return $http.get(constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
                            .then(function (response) {
                                console.log("User retrieved");
                                return response.data;
                            }, function (error) {
                                console.log("Failed to retrieve user : " + error.data.error.message);
                                return error.data;
                            });
                    },

                    // Get stranger profiles
                    getStrangerProfiles: function () {
                        return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId][neq]=1&access_token=validAccessToken")
                            .then(function (response) {
                                console.log('Profiles retrieved');
                                return response.data;
                            }, function (error) {
                                console.log('Failed to retrieve profiles : ' + error.data.error.message);
                                return error.data;
                            });
                    }
                }
            };
            $provide.constant('constant', constant);
            $provide.service('dataService', services);
            $provide.value('$ionicPlatform', {
                ready: jasmine.createSpy('$ionicPlatform.ready').and.callFake(function () {
                    //console.log("$ionicPlatform.ready() spy fake");
                    return {
                        then: jasmine.createSpy('$ionicPlatform.ready.then').and.callFake(function (callbackFn) {
                            readyThenCallbackFn = callbackFn;
                        })
                    };
                }),
                registerBackButtonAction: jasmine.createSpy()
            });
        });
    });

    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend

        $controller('FriendsCtrl', {
            $scope: scope
        })
    }));

    // Test scope
    it('should have scope defined', function () {
        expect(scope).toBeDefined();
    });

    // Test initializeData method
    it('should retrieve user and stranger profiles', function () {
        var userMockData = {
            "realm": null,
            "username": "zul",
            "credentials": null,
            "challenges": null,
            "email": "zul@mail.com",
            "emailVerified": null,
            "status": null,
            "created": null,
            "lastUpdated": null,
            "id": 1
        };

        var strangerProfilesMockData = [{
            "name": "navi",
            "latestLocation": {
                "lat": -6.8823473,
                "lng": 107.5814072
            },
            "latestUpdateDate": "2016-11-09T09:37:31.000Z",
            "userId": 2,
            "id": 2
        }];

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
            .respond(userMockData);

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId][neq]=1&access_token=validAccessToken")
            .respond(userMockData);

        scope.initializeData(1, "validAccessToken");
        httpBackend.flush();
        expect(scope.user).toEqual(userMockData);
    })
})









