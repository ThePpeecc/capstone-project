/* global angular*/
/**
 * This file holds the data service module
 *
 * @summary   The module holds all of the networking functionality for this app
 *
 * @since     29.12.2016
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
        .service('dataService', function($http, $httpParamSerializer, $base64, communicationFactory) { //We depend on the $http functionality for our networking

            var baseURL = 'http://localhost:3000',
                auth = '',
                headers = {}

            /**
             * This funciton updates the users login information and then encodes them so they can pass for basic authentication
             * @param  {String} email The users email
             * @param  {String} pass  The users password
             */
            communicationFactory.updateUserLoginInfo = function(email, pass) {
                auth = $base64.encode(email + ':' + pass),
                    headers = {
                        headers: {
                            'Authorization': 'Basic ' + auth
                        }
                    }
            }

            /**
             * Gets a bunch of articles and their location coordinates
             * @param  {Object} coords  The coordinates that we want to search around
             * @return {promise}        We return a promise with the returned json
             */
            this.getArticles = function(coords) {
                var qs = $httpParamSerializer(coords) //Turn coordinates into query string
                return $http.get(baseURL + '/api/articles?' + qs) //We return a promise
            }

            /**
             * Gets a single articles information
             * @param  {Int} id    The id of the article
             * @return {promise}   We return a promise with the returned json
             */
            this.getArticle = function(id) {
                return $http.get(baseURL + '/api/article/' + id)
            }

            /**
             * Creates a user in the database
             * @param  {Object} user    The user object
             * @return {promise}        We return a promise with the returned json
             */
            this.createUser = function(user) {
                return $http.post(baseURL + '/api/user', user)
            }

            /**
             * Creates a user in the database
             * @return {promise}        We return a promise with the returned json
             */
            this.getUserInfomation = function() {
                return $http.get(baseURL + '/api/user', headers)
            }

            /**
             * Creates an article in the database with the user
             * @param  {Object} article    The article object
             * @return {promise}            We return a promise with the returned json
             */
            this.saveArticle = function(article) {
                return $http.post(baseURL + '/api/save/article/', article, headers)
            }

            /**
             * Deletes an article in the database at the user
             * @param  {int} id    The id of the article in the user
             * @return {promise}   We return a promise with the returned json
             */
            this.deleteArticle = function(id) {
                return $http.delete(baseURL + '/api/delete/article/' + id, headers)
            }

            /**
             * Creates a place in the database with the user
             * @param  {Object} place    The place object
             * @return {promise}         We return a promise with the returned json
             */
            this.savePlace = function(place) {
                return $http.post(baseURL + '/api/save/place/', place, headers)
            }

            /**
             * Deletes a place in the database at the user
             * @param  {int} id    The id of the place in the user
             * @return {promise}   We return a promise with the returned json
             */
            this.deletePlace = function(id) {
                return $http.delete(baseURL + '/api/delete/place/' + id, headers)
            }

        })
})()
