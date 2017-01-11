'use strict'

/**
 * @summary   This Module holds the main authentication middleware
 *
 * @since     25.12.2016
 * @requires Node.js, bcrypt & auth
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

//we get the needed modules
var User = require('../models/user'),
    auth = require('basic-auth'),
    bcrypt = require('bcrypt')


var errorHandler = function(err, req, res, next, status = 500) {
    if (err) {
        err.status = status
        return next(err)
    }
}

var getAuth = function(req, res, next) {
    var userAuth = auth(req) //We get the authentication parameters from the browser
    if (userAuth) { //If they have sendt us any authentication
        User.findOne({
                'emailAddress': userAuth.name //We find the user by the email
            })
            .exec(function(err, user) {
                errorHandler(err, req, res, next)
                if (user) {
                    bcrypt.compare(userAuth.pass, user.password, function(err, res) { //We compare the user we found password with the supplied authentication
                        errorHandler(err, req, res, next)
                        if (res) { //true if they match false else
                            req.currentUser = user //we assign the logged in user to currentUser
                        }
                        next()
                    })
                } else {
                    next()
                }
            })
    } else {
        next()
    }
}

//we tjek if the user is authenticated, or aka this middleware tjeks if they are logged in
var isAuth = function(req, res, next) {
    if (req.currentUser) { //if there is a currentUser
        next() //They are Authorized to do whatever requires them to be logged in
    } else {
        var err = new Error('Not Authorized, please login')
        err.status = 401
        next(err)
    }
}

module.exports.errorHandler = errorHandler
module.exports.getAuth = getAuth
module.exports.isAuth = isAuth
