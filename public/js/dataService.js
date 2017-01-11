/* global angular*/
/**
 * This file holds the data service module
 *
 * @summary   The module holds all of the networking functionality for this app
 *
 * @since     21.11.2016
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * This is the data service module
 * @type service
 */
(function() {
    'use strict'

    //We get the app module
    angular.module('app')

    //We create our service
    .service('dataService', function($http) { //We depend on the $http functionality for our networking


    })
})()
