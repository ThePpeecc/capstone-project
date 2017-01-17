/* global angular*/
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/**
 * This file holds the article detail controller module
 *
 * @summary   The module holds all of the ui functionality for the article detail view
 *
 * @since     07.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The detail controller
 * @type controller
 */
(function() {
    angular.module('app') // We get the app module
        .controller('DetailController', function($scope, $location, dataService, communicationFactory) {

            var detailCtr = this

            /**
             * Function that loads the articles information into the detail Template
             */
            var loadArticle = function() {
                detailCtr.articleMarker = communicationFactory.articleModel //We save the articleModel for later use (it is needed if we save the article in the template)
                if (communicationFactory.articleID) {
                    dataService.getArticle(communicationFactory.articleID) //We download the article
                        .then(function(json) {
                            detailCtr.article = json.data

                            var image = json.data.info.images[0] //We take the first image as the image we want to use

                            if (image) {
                                detailCtr.imageURL = image.url //We load in the image
                            } else {
                                detailCtr.imageURL = ''
                            }

                        })
                }
            }

            /**
             * This function saves an article to the current logged in user
             * @param  {object} article This is the article object that we wan't to save
             */
            detailCtr.saveArticle = function(article) {
                dataService.saveArticle(article).then(function() { //We save the article
                    if (communicationFactory.reloadUserInfo) {
                        communicationFactory.reloadUserInfo() //We reload the users information
                    }
                })
                    .catch(function(err) {
                        console.log(err)
                    })
            }


            //Initial calls when the detail-view has been loaded
            if ($location.url().split('/')[1] === 'user') { //We make sure we don't show the save button when this view gets loaded into the users page. (we don't want to save an article twice now)
                detailCtr.showSaveButton = false
            } else {
                detailCtr.showSaveButton = true
            }

            //We assign our reload function to our communicationFactory
            communicationFactory.reloadArticle = loadArticle
            loadArticle() //We load the first article into our view
        })
})()
