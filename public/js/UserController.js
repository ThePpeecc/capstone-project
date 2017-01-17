/* global angular*/
/**
 * This file holds the user detail controller module
 *
 * @summary   The module holds all of the ui functionality for the user detail view
 *
 * @since     09.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The user detail controller
 * @type controller
 */
(function() {
    angular.module('app') // We get the app module
        .controller('UserController', function($scope, $location, dataService, communicationFactory, $rootScope, errorHandeler) {

            var userCtr = this
            userCtr.user = communicationFactory.userData

            /**
             * Fucntion that fires when the user clicks on an article link on the user page
             * @param  {int} id   The id of the article
             */
            userCtr.tjekArticle = function(id) {
                communicationFactory.articleID = id

                userCtr.showDetail = true //We show the detail controller

                if (communicationFactory.reloadArticle) { //If our reloadArticle function has been added
                    communicationFactory.reloadArticle() //We reload our data in the detail controller
                }
            }

            /**
             * Fucntion that fires when the user clicks on a place link on the user page, it redirets to the map page
             * @param  {object} place The coordiantes of the page
             */
            userCtr.tjekPlace = function(place) {
                $location.path('/map/' + place.latitude + '/' + place.longitude)
            }

            /**
             * Function that removes the article from both the user and the user page
             * @param  {int} id    id of the article
             * @param  {int} index THe index of the article in the articles array
             */
            userCtr.removeArticle = function(id, index) {
                if (confirm('Are you sure you want to remove this article?')) { //We ask if they are sure that they want to delte the article
                    dataService.deleteArticle(id)
                        .then(function() {
                            userCtr.user.articles.splice(index, 1) //We remove the article from the array
                        })
                        .catch(function(err) {
                            errorHandeler.unexpectedErr(err)
                        })
                }
            }

            /**
             * Function that removes the place from both the user and the user page
             * @param  {int} id    id of the place
             * @param  {int} index THe index of the place in the savedPlaces array
             */
            userCtr.removePlace = function(id, index) {
                if (confirm('Are you sure you want to remove this place?')) { //We ask if they are sure that they want to delte the place
                    dataService.deletePlace(id)
                        .then(function() {
                            userCtr.user.savedPlaces.splice(index, 1) //We remove the place from the array
                        })
                        .catch(function(err) {
                            errorHandeler.unexpectedErr(err)
                        })
                }
            }

            //Initial calls
            if (!$rootScope.loggedIn) { //If the user is logged in
                $location.path('/') //The user is not logged in so we redirect them to the front page
            }
        })
})()
