/* global angular*/
/**
 * This file holds the index controller module
 *
 * @summary   The module holds all of the ui functionality for index view. This is primarily the menu
 *
 * @since     21.11.2016
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The index controller
 * @type controller
 */
(function() {
    angular.module('app') // We get the app module
        .controller('indexController', function($scope, $location, dataService, communicationFactory, $rootScope) {

            var index = this

            /**
             * Redirects to the lading page
             */
            index.home = function() {
                $location.path('/')
            }

            /**
             * Redirects to the login page
             */
            index.login = function() {
                $location.path('/login')
            }

            /**
             * Redirects to the user page
             */
            index.user = function() {
                $location.path('/user')
            }

            /**
             * Logs the user out and redirects to the landing page
             */
            index.logOut = function() {
                communicationFactory.updateUserLoginInfo(null, null) //We delete the users information
                communicationFactory.userData = null //And the users data
                $rootScope.loggedIn = false
                $location.path('/')
            }
        })
})()
