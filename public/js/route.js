/* global angular*/
(function() {
    'use strict'

    // The Angular $routeProvider is used to configure routes for your application.

    // Three routes are configured below:
    // 1) The root of the application "/" which serves up the "Recipes" view.
    // 2) The recipe edit route "/edit/:id" which serves up the "Recipe Detail" view.
    // 3) The recipe add route "/add" which also serves up the "Recipe Detail" view.

    // TODO Uncomment this code after you've configured the `app` module.

    angular
        .module('app')
        .config(config)

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'MapController',
                controllerAs: 'vm',
                templateUrl: 'templates/map.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
})()
