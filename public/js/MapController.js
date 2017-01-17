/* global angular*/
/**
 * This file holds the map controller module
 *
 * @summary   The module holds all of the ui functionality for the map view
 *
 * @since     04.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The map controller
 * @type controller
 */
(function() {
    angular.module('app') // We get the app module
        .controller('MapController', function($scope, $location, dataService, uiGmapGoogleMapApi, communicationFactory, $routeParams, errorHandeler) {

            var mapCtr = this,
                demoCoords = { //The demo coordinates are the first place that we load in so the app can load in google maps
                    latitude: 0,
                    longitude: 0
                }

            mapCtr.locationErr = ''
            mapCtr.placeTitle = ''

            /**
             * Shows the error if an error happens when getting a geolocation
             * @param  {Error} error The error we get
             */
            function showError(error) {
                switch (error.code) {
                case error.PERMISSION_DENIED:
                    mapCtr.locationErr = 'User denied the request for Geolocation.'
                    break
                case error.POSITION_UNAVAILABLE:
                    mapCtr.locationErr = 'Location information is unavailable.'
                    break
                case error.TIMEOUT:
                    mapCtr.locationErr = 'The request to get user location timed out.'
                    break
                case error.UNKNOWN_ERROR:
                    mapCtr.locationErr = 'An unknown error occurred.'
                    break
                }
                $scope.$apply() //We apply
            }

            /**
             * This function is called every time a click happens on a marker
             * @param  {Object} googleMarker A marker object
             * @param  {Object} eventName    an event object
             * @param  {Object} modelMarker  The model that has been saved with the marker
             * @return {null}                We don't return anything
             */
            mapCtr.markersEvents = function(googleMarker, eventName, modelMarker) {
                communicationFactory.articleID = modelMarker.articleID //we add the article id to our factory that communicates between controllers
                communicationFactory.articleModel = modelMarker

                mapCtr.showDetail = true //We show the detail controller

                if (communicationFactory.reloadArticle) { //If our reloadArticle function has been added
                    communicationFactory.reloadArticle() //We reload our data in the detail controller
                }
                $scope.$apply() //Force the change
            }

            /**
             * This functions saves the current area the user is looking at
             * @param  {object} place The places coordinates
             */
            mapCtr.savePlace = function(place) {
                dataService.savePlace({ //We try to save the place
                    'title': mapCtr.placeTitle,
                    'latitude': place.latitude,
                    'longitude': place.longitude
                }).then(function() {
                    if (communicationFactory.reloadUserInfo) {
                        communicationFactory.reloadUserInfo() //We reload the users information
                    }
                }).catch(function(err) {
                    errorHandeler.unexpectedErr(err)
                })
            }

            /**
             * This functions converts the articles that we download from the api into map markers that can be used on google maps
             * @param  {array} articles This is an array of articles
             * @return {array}          We return an array of markers ready to be used in google maps
             */
            var convertToGMapsMarkers = function(articles) {
                var markers = [] //Create an empty array of the markers we will return

                if (articles) {
                    articles.forEach(function(article, index) {
                        var marker = { //We fill out a marker
                            latitude: article.lat,
                            longitude: article.lon,
                            title: article.title,
                            articleID: article.pageid,
                            id: index
                        }
                        markers.push(marker) //We add the marker to the array of markers
                    })
                }

                return markers //We return a list of markers
            }

            /**
             * Function that downloads the articles in an area and returns them as markers
             * @param  {object} coords The coordinates we use to search
             * @return {array}         An array of map markers
             */
            var getArticles = function(coords) {
                var searchCoords = {
                    lat: coords.latitude,
                    long: coords.longitude
                }
                dataService.getArticles(searchCoords)
                    .then(function(json) { //We get some wikipedia articles from our api
                        var geoData = json.data.geosearch //We take out the articles
                        return mapCtr.wikiArticles = convertToGMapsMarkers(geoData) //We get convert the geoData into the form of map markers here
                    }).catch(function(err) {
                        errorHandeler.networkErr(err)
                    })
            }

            /**
             * Shows the map at a certain posisiton
             * @param  {Object} position A set of coordinates we foucus around
             * @param  {int} zoom        The zoom level of the map
             */
            var showGMap = function(position, zoom) {
                uiGmapGoogleMapApi.then(function() {
                    mapCtr.map = {
                        center: {
                            latitude: position.latitude,
                            longitude: position.longitude
                        },
                        zoom: zoom
                    }
                })
            }

            /**
             * This funciton looks up the the articles in a given area and displays them
             * @param  {object} coords The coordinates to look up
             */
            mapCtr.lookupPlace = function(coords) {
                getArticles(coords) //We download the articles
                showGMap(coords, 17) //And show the map at the users location
            }

            /**
             * Function is that is called when we find the users location and want to load in the articles around their place
             * @param  {object} position The coordinates of the user
             */
            function showPosition(position) {
                var coords = position.coords //We take the coordinates out of our posistion
                mapCtr.notFound = false
                mapCtr.lookupPlace(coords) //We lookup the articles in their area
            }

            /**
             * This function gets the users location
             */
            var getLocation = function() { //funtion that gets the current location of the user
                if (navigator.geolocation) {
                    mapCtr.notFound = true
                    navigator.geolocation.getCurrentPosition(showPosition, showError)
                } else {
                    mapCtr.locationErr = 'Geolocation is not supported by this browser'
                }
            }

            //Initial calls
            if ($location.url().split('/')[1] === 'map') { //If we are at the maps page
                var convertToNumbers = {
                    latitude: Number($routeParams.lat),
                    longitude: Number($routeParams.long)
                }
                getArticles(convertToNumbers)
                showGMap(convertToNumbers, 17)
            } else {
                getLocation()
                showGMap(demoCoords, 2)
            }
        })
})()
