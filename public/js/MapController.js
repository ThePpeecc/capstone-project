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
        .controller('MapController', function($location, dataService, uiGmapGoogleMapApi) {

            var mapCtr = this

            // The "then" callback function provides the google.maps object.
            uiGmapGoogleMapApi.then(function(maps) {
              console.log('Google Maps loaded')
              mapCtr.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 }
            })

        })
})()
