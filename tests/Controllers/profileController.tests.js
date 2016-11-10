describe('Profile Controller', function () {
    beforeEach(function () {
        module('starter.profileController', function ($provide) {
            var constant = {
                apiBaseAddress: "http://localhost:3000/api",
                getUserApi: "/Users",
                getProfileApi: "/Profiles"
            };
            var services = function ($http, constant) {
                return {
                    // Get user by id
                    getUserById: function (id, accessToken) {
                        return $http.get(constant.apiBaseAddress + constant.getUserApi + "/" + "1" + "?access_token=" + "validAccessToken")
                            .then(function (response) {
                                console.log("User retrieved");
                                return response.data;
                            },
                            function (error) {
                                console.log("Failed to retrieve user : " + error.data.error.message);
                                return error.data;
                            });
                    },

                    // Get profile by user id
                    getProfileByUserId: function (userId, accessToken) {
                        return $http.get(constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId]=1&access_token=validAccessToken")
                            .then(function (response) {
                                console.log('Profile retrieved');
                                if (response.data.length > 0) {
                                    return response.data[0]; // return first content
                                } else {
                                    return null;
                                }
                            }, function (error) {
                                consoloe.log('Failed to retrieve profile :' + error.data.error.message);
                                return error.data;
                            })
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
        httpBackend = $httpBackend;
        $controller('ProfileCtrl', {
            $scope: scope
        })
    }));

    // Test scope
    it('should have scope defined', function () {
        expect(scope).toBeDefined();
    });

    //Test initializeData method with existing profile
    it('should retrieve user and profile successfully', function () {
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

        var profilesMockData = [{
            "name": "zul",
            "latestLocation": {
                "lat": -6.8823473,
                "lng": 107.5814072
            },
            "latestUpdateDate": "2016-11-09T09:37:31.000Z",
            "userId": 1,
            "id": 1
        }];

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
            .respond(userMockData);

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId]=1&access_token=validAccessToken")
            .respond(profilesMockData);

        scope.initializeData(1, "validAccessToken");
        httpBackend.flush();
        expect(scope.user).toEqual(userMockData);
        expect(scope.profile).toEqual(profilesMockData[0]);
    });

    //Test initializeData method with non existing profile
    it('should retrieve user and profile successfully', function () {
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

        var profilesMockData = [];

        var newProfileMockData = {
            "name": "zul",
            "latestLocation": {
                "lat": 0,
                "lng": 0
            },
            "latestUpdateDate": "",
            "userId": 1
        }

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
            .respond(userMockData);

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId]=1&access_token=validAccessToken")
            .respond(profilesMockData);

        scope.initializeData(1, "validAccessToken");
        httpBackend.flush();
        expect(scope.user).toEqual(userMockData);
        expect(scope.profile).toEqual(newProfileMockData);
    });
});