/* global angular*/
/**
 * This file holds the app module
 *
 * @summary   The module holds the angular app module
 *
 * @since     08.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The app module
 * @type angular module
 */
(function() {
    'use strict'
    angular.module('app', ['ngRoute', 'nemLogging', 'uiGmapgoogle-maps', 'base64'])
})()
