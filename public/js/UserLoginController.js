/* global angular*/
/**
 * This file holds the userlogin controller module
 *
 * @summary   The module holds all of the ui functionality for the userlogin view
 *
 * @since     11.01.2017
 * @requires  angular
 * @NOTE      [For devs only this module also uses eslint for code quality]
 **/

/**
 * The userlogin controller
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

            /**
             * The error handeler that takes care of any validations and login errors
             * @param  {Error} err The error
             */
            function errorHandeler(err) {
                if (err) {
                    if (err.data.name == 'ValidationError' || err.data.name == 'LoginErr') { //We tjek the error
                        userLogCtr.errors = err.data.errors //We can display the error
                    } else {
                        userLogCtr.errors = { //It is an unknown error so we display that
                            'Error': {
                                message: 'An unknown error has occurred'
                            }
                        }
                    }
                } else {
                    userLogCtr.errors = null
                }
            }

            /**
             * We load in the users data and save it
             */
            function loadUser() {
                return dataService.getUserInfomation() //We get the data
                    .then(function(json) {
                        communicationFactory.userData = json.data //We save it
                    })
            }

            /**
             * The function we use to login
             */
            userLogCtr.login = function() {
                if (communicationFactory.updateUserLoginInfo) {
                    communicationFactory.updateUserLoginInfo(userLogCtr.email, userLogCtr.pass) //We update the users login information with what the user has typed ind
                    loadUser() //We try to load in the user
                        .then(function() {
                            userLogCtr.errors = null
                            $rootScope.loggedIn = true
                            $location.path('/user') //It works so we redirect them to the user screen
                        })
                        .catch(errorHandeler)
                }
            }

            /**
             * Function that is used to create a new user
             */
            userLogCtr.signUpNewUser = function() {
                dataService.createUser({ //We try to create a user
                    'name': userLogCtr.name,
                    'emailAddress': userLogCtr.email,
                    'password': userLogCtr.pass,
                    'confirmPassword': userLogCtr.confirmPass
                }).then(function() {
                    userLogCtr.errors = null
                    userLogCtr.signUp = false //we get a succesfull response so we show the login details, so the user can login
                }).catch(errorHandeler)
            }

            /**
             * We assing our reloadUserInfo to our loadUser function so other controllers can call it
             */
            communicationFactory.reloadUserInfo = loadUser

            //Initial calls
            if ($rootScope.loggedIn) { //If the user is logged in
                $location.path('/user') //The user is  logged in so we redirect them to the user page
            }

        })
})()
