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
        .controller('MapController', function($scope, $location, dataService, uiGmapGoogleMapApi, communicationFactory, $routeParams) {

            var mapCtr = this,
            demoCoords = {
                latitude: 55.6791,
                longitude: 12.5779
            }

            mapCtr.locationErr = ''
            mapCtr.placeTitle = ''

            //Shows the error if an error happens when getting a geolocation
            function showError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        mapCtr.locationErr = "User denied the request for Geolocation."
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mapCtr.locationErr = "Location information is unavailable."
                        break;
                    case error.TIMEOUT:
                        mapCtr.locationErr = "The request to get user location timed out."
                        break;
                    case error.UNKNOWN_ERROR:
                        mapCtr.locationErr = "An unknown error occurred."
                        break;
                }
                $scope.$apply()
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

            mapCtr.savePlace = function(place) {
              dataService.savePlace({
                "title": mapCtr.placeTitle,
                "latitude": place.latitude,
                "longitude": place.longitude
              }).then(function(json) {
                console.log(json)
                if (communicationFactory.reloadUserInfo) {
                  communicationFactory.reloadUserInfo()
                }
              }).catch(function(err) {
                console.log(err)
              })
            }

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

            var getArticles = function(coords) {
              var searchCoords = {
                lat: coords.latitude,
                long: coords.longitude
              }
                dataService.getArticles(searchCoords)
                    .then(function(json) { //We get some wikipedia articles from our api
                        console.log(json);
                        var geoData = json.data.geosearch //We take out the articles

                        return mapCtr.wikiArticles = convertToGMapsMarkers(geoData) //We get convert the geoData into the form of map markers here

                    })
            }

            var showGMap = function(position, zoom) {
                uiGmapGoogleMapApi.then(function(maps) {
                    console.log('Google Maps loaded')
                    mapCtr.map = {
                        center: {
                            latitude: position.latitude,
                            longitude: position.longitude
                        },
                        zoom: zoom
                    }
                })
            }

            function showPosition(position) {
                var coords = position.coords //We take the coordinates out of our posistion
                mapCtr.notFound = false
                getArticles(coords)
                showGMap(coords, 17)
            }

            var getLocation = function() { //funtion that gets the current location of the user
                if (navigator.geolocation) {
                    mapCtr.notFound = true
                    navigator.geolocation.getCurrentPosition(showPosition, showError)
                } else {
                    mapCtr.locationErr = "Geolocation is not supported by this browser"
                }
            }

            mapCtr.lookupPlace = function(coords) {
              getArticles(coords)
              showGMap(coords, 17)
            }

            //Initial calls
            if ($location.url().split('/')[1] === 'map') {
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
