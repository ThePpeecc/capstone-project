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
        .controller('UserController', function($scope, $location, dataService, communicationFactory) {

            var userCtr = this
            userCtr.user = communicationFactory.userData

            userCtr.tjekArticle = function(id) {
                communicationFactory.articleID = id

                userCtr.showDetail = true //We show the detail controller
                
                if (communicationFactory.reloadArticle) { //If our reloadArticle function has been added
                    communicationFactory.reloadArticle() //We reload our data in the detail controller
                }
            }

            userCtr.tjekPlace = function(place) {
                $location.path('/map/' + place.latitude + '/' + place.longitude)
            }

            userCtr.removeArticle = function(id, index) {
              if (confirm('Are you sure you want to remove this article?')) { //We ask if they are sure that they want to delte the article
                    dataService.deleteArticle(id)
                    .then(function() {
                        userCtr.user.articles.splice(index, 1) //We remove the article from the array
                    })
                }
            }

            userCtr.removePlace = function(id, index) {
              if (confirm('Are you sure you want to remove this place?')) { //We ask if they are sure that they want to delte the place
                    dataService.deletePlace(id)
                    .then(function() {
                        userCtr.user.savedPlaces.splice(index, 1) //We remove the place from the array
                    })
                }
            }



            if (communicationFactory.loggedIn) {
              dataService.getUserInfomation().then(function(json) {
                communicationFactory.userData = json.data
                $scope.$apply()
              }).catch(function(err) {
                console.log(err)
              })
            }else {
            }


            console.log(userCtr.user)

        })
})()
