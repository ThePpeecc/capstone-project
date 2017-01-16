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
        .controller('DetailController', function($scope, $location, dataService, communicationFactory) {

            var detailCtr = this

            //var articleID = $location.url().split('/')[2] //We get the id of the article


            var loadArticle = function() {
                detailCtr.articleMarker = communicationFactory.articleModel
                if (communicationFactory.articleID) {
                    dataService.getArticle(communicationFactory.articleID)
                        .then(function(json) {
                            console.log(json.data);
                            detailCtr.article = json.data

                            var image = json.data.info.images[0]

                            if (image) {
                                detailCtr.imageURL = image.url
                            } else {
                                detailCtr.imageURL = ''
                            }

                        })
                }
            }

            detailCtr.saveArticle = function(article) {
              dataService.saveArticle(article).then(function(json) {
                console.log(json)
                if (communicationFactory.reloadUserInfo) {
                  communicationFactory.reloadUserInfo()
                }
              })
              .catch(function(err) {
                console.log(err)
              })
            }

            if ($location.url().split('/')[1] === 'user') {
              detailCtr.showSaveButton = false
            }else {
              detailCtr.showSaveButton = true
            }

            communicationFactory.reloadArticle = loadArticle
            loadArticle()


        })
})()
