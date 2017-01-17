'use strict'

/**
 * @summary   This Module holds the main authentication middleware as well as the error handeler funciton
 *
 * @since     25.12.2016
 * @requires Node.js, bcrypt & auth
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

//we get the needed modules
var User = require('../models/user'),
    auth = require('basic-auth'),
    bcrypt = require('bcrypt')

/**
 * The error handeler that is used for the api
 * @param  {Error}   err           The that has been passed to the handeler
 * @param  {request}   req         The request object that we get
 * @param  {response}   res        The response object
 * @param  {Function} next         The next function, for when we need to send the error to the next handeler
 * @param  {Number}   [status=500] The status of the error, 500 is standard
 */
var errorHandler = function(err, req, res, next, status = 500) {
    if (err) { //We tjek for an error
        if (err.name == 'LoginErr') { //If it is the login error type
            err.errors = { //We manually add the error message
                'err': {
                    message: err.message
                }
            }
        }
        err.status = status //We set the status
        return next(err) //Send the error off to the next object
    }
}

/**
 * This pice of middleware takes care of getting the user credentials and giving the rest of the api access to them
 * @param  {request}   req         The request object that we get
 * @param  {response}  res         The response object
 * @param  {Function}  next        The next function, for when we need to send the error to the next handeler
 */
var getAuth = function(req, res, next) {
    var userAuth = auth(req) //We get the authentication parameters from the browser
    if (userAuth) { //If they have sendt us any authentication
        User.findOne({
            'emailAddress': userAuth.name.toLowerCase() //We find the user by the email
        })
            .exec(function(err, user) {
                errorHandler(err, req, res, next)
                if (user) {
                    bcrypt.compare(userAuth.pass, user.password, function(err, res) { //We compare the user we found password with the supplied authentication
                        errorHandler(err, req, res, next)
                        if (res) { //true if they match false else
                            req.currentUser = user //we assign the logged in user to currentUser
                        } else { //We passwords dose not match
                            var newError = new Error('The password or email dose not match')
                            newError.name = 'LoginErr' //So we send a login error
                            errorHandler(newError, req, res, next, 401)
                        }
                        next()
                    })
                } else { //We don't get a user
                    var newError = new Error('The password or email dose not match') //So we send a login error
                    newError.name = 'LoginErr'
                    errorHandler(newError, req, res, next, 401)
                }
            })
    } else {
        next() //No basic-auth in the request so we just continue
    }
}

/**
 * We tjek if the user is authenticated, or aka this middleware tjeks if they are logged in
 * @param  {request}   req         The request object that we get
 * @param  {response}  res         The response object
 * @param  {Function}  next        The next function, for when we need to send the error to the next handeler
 */
var isAuth = function(req, res, next) {
    if (req.currentUser) { //if there is a currentUser
        next() //They are Authorized to do whatever requires them to be logged in
    } else {
        var err = new Error('Not Authorized, please login') //They are not Authorized so we send them away
        err.status = 401
        next(err)
    }
}

//Our exports
module.exports.errorHandler = errorHandler
module.exports.getAuth = getAuth
module.exports.isAuth = isAuth
