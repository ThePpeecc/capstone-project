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
        .controller('UserLoginController', function($scope, $location, dataService, communicationFactory, $rootScope) {

            var userLogCtr = this

            userLogCtr.pass = ''
            userLogCtr.confirmPass = ''
            userLogCtr.email = ''
            userLogCtr.name = ''

            userLogCtr.signUp = false

            function errorHandeler(err) {
                console.log(err);
                if (err.data.name == 'ValidationError' || err.data.name == 'LoginErr') {
                    userLogCtr.errors = err.data.errors
                } else {
                    userLogCtr.errors = {
                        'Error': {
                            message: 'An unknown error has occurred'
                        }
                    }
                }
            }

            function loadUser() {
                return dataService.getUserInfomation()
                    .then(function(json) {
                        communicationFactory.userData = json.data
                    })
            }


            userLogCtr.login = function() {
                if (communicationFactory.updateUserLoginInfo) {
                    communicationFactory.updateUserLoginInfo(userLogCtr.email, userLogCtr.pass)
                    loadUser()
                        .then(function() {

                            $rootScope.loggedIn = true
                            $location.path('/user')
                        })
                        .catch(errorHandeler)
                }
            }

            userLogCtr.signUpNewUser = function() {
                dataService.createUser({
                    "name": userLogCtr.name,
                    "emailAddress": userLogCtr.email,
                    "password": userLogCtr.pass,
                    "confirmPassword": userLogCtr.confirmPass
                }).then(function(json) {
                    console.log(json);
                    userLogCtr.signUp = false
                }).catch(errorHandeler)
            }

            communicationFactory.reloadUserInfo = function() {
                loadUser()
            }
        })
})()
