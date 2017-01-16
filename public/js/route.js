/* global angular*/
(function() {
    'use strict'

    // The Angular $routeProvider is used to configure routes for my application.

    angular
        .module('app')
        .config(config)

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'MapController',
                controllerAs: 'mapCtr',
                templateUrl: 'templates/map.html'
            })
            .when('/map/:lat/:long', {
                controller: 'MapController',
                controllerAs: 'mapCtr',
                templateUrl: 'templates/map.html'
            })
            .when('/detail/:id', {
                controller: 'DetailController',
                controllerAs: 'detailCtr',
                templateUrl: 'templates/detail.html'
            })
            .when('/login', {
                controller: 'UserLoginController',
                controllerAs: 'userLogCtr',
                templateUrl: 'templates/login.html'
            })
            .when('/user', {
                controller: 'UserController',
                controllerAs: 'userCtr',
                templateUrl: 'templates/user.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
})()
