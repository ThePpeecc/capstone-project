/* global angular*/
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/**
 * This file holds the errorHandeler service module
 *
 * @summary   The module holds most of the errorHandeling functionality for this app
 *
 * @since     17.01.2017
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
        .service('errorHandeler', function() {


            this.unexpectedErr = function(err) {
                alert('An unexpected error has occurred, please try again later, see the console for specifics')
                console.error(err)
            }

            this.networkErr = function(err) {
                if (!err.data) {
                    alert('Lost the connection to the server')
                }else {
                    this.unexpectedErr()
                }
            }
        })
})()
