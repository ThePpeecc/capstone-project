/* global angular*/
/**
 * This file holds the recipe detail controller module
 *
 * @summary   The module holds all of the ui functionality for the recipe detail view
 *
 * @since     21.11.2016
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The recipe detail controller
 * @type controller
 */
(function() {
    angular.module('app') // We get the app module
        .controller('indexController', function($scope, $location, dataService, communicationFactory, $rootScope) {

            var index = this


            index.home = function() {
              $location.path('/')
            }

            index.login = function() {
              $location.path('/login')
            }

            index.user = function() {
              $location.path('/user')
            }

            index.logOut = function() {
              communicationFactory.updateUserLoginInfo(null, null)
              communicationFactory.userData = null
              $rootScope.loggedIn = false;
              $location.path('/')
            }
        })
})()
