/* global angular*/
/**
 * This file holds the data service module
 *
 * @summary   The module holds all of the networking functionality for this app
 *
 * @since     21.11.2016
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

            var baseURL = 'http://localhost:3000', auth = '', headers = {}

            communicationFactory.updateUserLoginInfo = function(email, pass) {
              auth = $base64.encode(email + ':' + pass),
              headers = {headers: {'Authorization': 'Basic ' + auth}}
            }


            this.getArticles = function(coords) {
                var qs = $httpParamSerializer(coords) //Turn coordinates into query string
                return $http.get(baseURL + '/api/articles?' + qs) //We return a promise
            }

            this.getArticle = function(id) {
              return $http.get(baseURL + '/api/article/' + id)
            }

            this.createUser = function(user) {
              return $http.post(baseURL + '/api/user', user)
            }

            this.getUserInfomation = function() {
              return $http.get(baseURL + '/api/user', headers)
            }

            this.saveArticle = function(article) {
              return $http.post(baseURL + '/api/save/article/', article, headers)
            }

            this.deleteArticle = function(id) {
              return $http.delete(baseURL + '/api/delete/article/' + id, headers)
            }

            this.savePlace = function(place) {
              return $http.post(baseURL + '/api/save/place/', place, headers)
            }

            this.deletePlace = function(id) {
              return $http.delete(baseURL + '/api/delete/place/' + id, headers)
            }

        })
})()
