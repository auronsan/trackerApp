describe('Login Controller', function () {
    var rootScope, scope, ionicModalMock, http, httpBackend, state, stateMock, constant;

    beforeEach(function () {
        module('starter.loginController', function ($provide) {
            constant = {
                apiBaseAddress: "http://localhost:3000/api",
                loginApi: "/Users/login",
                getUserApi: "/Users",
                createUserApi: "/Users",
            };
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
                    // Register user
                    registerUser: function () {
                        return $http.put(constant.apiBaseAddress + constant.createUserApi, { "username": "canavar", "password": "canavar", "email": "canavar@mail.com" })
                            .then(function (response) {
                                console.log("Registration success");
                                return response.data;
                            }, function (error) {
                                console.log("Registration failed : " + error.data.error.message);
                                return error.data;
                            });
                    },

                    // Login
                    login: function (loginData) {
                        return $http.post(constant.apiBaseAddress + constant.loginApi, { "username": "canavar", "password": "canavar" })
                            .then(function (response) {
                                console.log("Login successful");
                                return response.data;
                            }, function (error) {
                                console.log("Login failed : " + error.data.error.message)
                                return error.data;
                            });
                    },
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
    beforeEach(inject(function ($rootScope, $controller, $q, $httpBackend, $http, $state) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        http = $http;
        httpBackend = $httpBackend;
        deferredModal = $q.defer();

        // state mock
        stateMock = {
            go: jasmine.createSpy('state.go').and.callFake(function () {
                return {
                    // then: function(){}
                }
            })
        }
        state = stateMock;

        // ionicModal mock
        ionicModalMock = {
            fromTemplateUrl: jasmine.createSpy('$ionicModal.fromTemplateUrl').and.returnValue(deferredModal.promise)
        }
        loginModalMock = jasmine.createSpyObj('modal', ['show', 'hide', 'remove']);
        regModalMock = jasmine.createSpyObj('modal', ['show', 'hide', 'remove']);
        scope.loginModal = loginModalMock;
        scope.regModal = regModalMock;

        $controller('LoginCtrl', {
            $scope: scope,
            $rootScope: rootScope,
            $ionicModal: ionicModalMock,
            $http: http,
            $state: state
        });
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // Test initializeData method
    it('should retrieve user successfully', function () {
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

        httpBackend.expect('GET', constant.apiBaseAddress + constant.getUserApi + "/1?access_token=validAccessToken")
            .respond(userMockData);

        scope.initializeData(1, "validAccessToken");
        httpBackend.flush();
        expect(scope.user).toEqual(userMockData);
    });

    // Test registerUser method
    it('should register user successfully', function () {

        var loginDataMock = { "username": "canavar", "password": "canavar" };
        var loginRespondMock = {
            "id": "validAccesToken",
            "ttl": 1209600,
            "created": "2016-11-09T08:03:26.491Z",
            "userId": 10
        };

        var registerUserRespondMock = {
            "username": "canavar",
            "email": "canavar@mail.com",
            "id": 10
        };
        var userMock = { "username": "canavar", "password": "canavar", "email": "canavar@mail.com" };
        httpBackend.expect('PUT', constant.apiBaseAddress + constant.createUserApi, userMock)
            .respond(registerUserRespondMock);

        httpBackend.expect('POST', constant.apiBaseAddress + constant.loginApi, loginDataMock)
            .respond(loginRespondMock);
        scope.registerUser(userMock);
        httpBackend.flush();
        expect(scope.loginModal.hide).toHaveBeenCalled();
    });

    // Test login modal registration
    it('should register login modal', function () {
        scope.registerLoginModal();
        deferredModal.resolve(loginModalMock);
        rootScope.$digest();
        expect(scope.loginModal).toBeDefined();
    });

    // Test reg modal registration
    it('should register registration modal', function () {
        scope.registerRegistrationModal();
        deferredModal.resolve(regModalMock);
        rootScope.$digest();
        expect(scope.regModal).toBeDefined();
    });

    // Test showLoginModal function
    it('should show login modal', function () {
        scope.showLoginModal();
        expect(scope.loginModal.show).toHaveBeenCalled();
    });

    // Test hideLoginModal function
    it('should hide login modal', function () {
        scope.closeLoginModal();
        expect(scope.loginModal.hide).toHaveBeenCalled();
    });

    // Test showRegModal function
    it('should show registration modal', function () {
        scope.showRegModal();
        expect(scope.regModal.show).toHaveBeenCalled();
    });

    // Test closeRegModal function
    it('should close registration modal', function () {
        scope.closeRegModal();
        expect(scope.regModal.hide).toHaveBeenCalled();
    });
});