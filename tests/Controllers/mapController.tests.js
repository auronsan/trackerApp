describe('Map Controller', function () {
    var scope, httpBackend, constant, state, stateMock;
    beforeEach(function () {
        module('starter.mapController', function ($provide) {
            constant = {
                apiBaseAddress: "http://localhost:3000/api",
                getUserApi: "/Users",
                saveProfileApi: "/Profiles",
                getProfileApi: "/Profiles",
            };
            services = function ($http, constant) {
                return {
                    // Get user by id
                    getUserById: function (id, accessToken) {
                        return $http.get(constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
                            .then(function (response) {
                                console.log("User retrieved");
                                return response.data;
                            }, function (error) {
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

    beforeEach(module('ui.router'));
    beforeEach(inject(function ($rootScope, $controller, $httpBackend, $state) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend;

        // state mock
        stateMock = {
            go: jasmine.createSpy('state.go').and.callFake(function () {
                return {
                    // then: function(){}
                }
            })
        }
        state = stateMock;

        $controller('MapCtrl', {
            $scope: scope,
            $state: state
        })
    }));

    it('should initialize data successfully', function () {
        var userMockResponse = {
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

        var profilesMockResponse = [{
            "name": "zul",
            "latestLocation": {
                "lat": -6.8823473,
                "lng": 107.5814072
            },
            "latestUpdateDate": "2016-11-09T09:37:31.000Z",
            "userId": 1,
            "id": 1
        }];

        var saveProfileData = {
            "name": "zul",
            "latestLocation": {
                "lat": -6.8823475,
                "lng": 107.5814075
            },
            "latestUpdateDate": "2016-11-09T09:40:00.000Z",
            "userId": 1,
            "id": 1
        };

        var saveProfileResponse = saveProfileData;

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
        .respond(userMockResponse);

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getProfileApi + "?filter[where][userId]=1&access_token=validAccessToken")
        .respond(profilesMockResponse); 

        scope.initializeData();
        httpBackend.flush();
        expect(scope.user).toEqual(userMockResponse);
        expect(scope.profile).toEqual(profilesMockResponse[0]);
    });
});