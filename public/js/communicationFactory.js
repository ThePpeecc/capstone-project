/* global angular*/
/**
 * This file holds the communicationFactory factory module
 *
 * @summary   This factory is used for communication between our different controllers
 *
 * @since     08.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

(function() {
    angular.module('app') // We get the app module
        .factory('communicationFactory', function() {
          return {
            url: '',
            userData: '',
            loggedIn: false,
          }
        })
})()
