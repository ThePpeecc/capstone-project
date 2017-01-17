'use strict'

/**
 * @summary   This Module holds the main api router
 *
 * @since     07.01.2017
 * @requires Node.js & express
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

//We get our required module
var express = require('express'),
    rp = require('request-promise'),
    wikiParser = require('wtf_wikipedia'),
    userModel = require('../models/user'),
    mid = require('../middleware/mid')

var router = express.Router()

var baseURL = 'https://en.wikipedia.org/w/api.php'

var errorHandler = mid.errorHandler

/**
 * Function that adds a json object as a query string to the end of a url
 * @param  {String} url  The Url that gets appended a query string to
 * @param  {object} json The json data that needs to be converted into a query string
 * @return {String}      We return the url with the json data appended
 */
var queryfi = function(url, json) {
    var newURL = url + '?' //We add the query starter
    for (let prop in json) {
        var propString = prop + '=' + json[prop] + '&' //We create a string for every property
        newURL += propString //Add the property with its data to the url
    }
    return newURL //Return the url
}

/**
 * Returns a json object containing a list of articles with thier respective coordinates and distance
 * @type {Get}
 */
router.get('/articles', function(req, res, next) {

    var latitude = req.query.lat,
        longitude = req.query.long

    rp(queryfi(baseURL, {
        action: 'query',
        list: 'geosearch',
        gscoord: latitude + '|' + longitude,
        format: 'json'
    }))
    .then(function(json) {
        return res.json(JSON.parse(json).query)
        // Process html...
    })
    .catch(function(err) {
        // Crawling failed...
        errorHandler(err, req, res, next)
    })
})

/**
 * Returns a json object containing detailed information about an article
 * @type {Get}
 */
router.get('/article/:id', function(req, res, next) {

    var pageId = req.params.id

    rp(queryfi(baseURL, { //We send a request to the api
        action: 'query',
        pageids: pageId,
        prop: 'revisions',
        rvprop: 'content',
        format: 'json'
    })).then(function(data) {

        var json = JSON.parse(data) //We parse the data

        var wikiArticle = json.query.pages[pageId] //We get the article out of the nested data

        var articleToReturn = { //We process the wikipedia data into a more usefull format
            title: wikiArticle.title,
            _id: wikiArticle.pageid,
            info: wikiParser.parse(wikiArticle.revisions[0]['*']),
            text: wikiParser.plaintext(wikiArticle.revisions[0]['*'])
        }

        return res.json(articleToReturn)
    }).catch(err => {
        return next(err)
    })
})

/**
 * Create a new user
 * @type {userModel / Post}
 */
router.post('/user', function(req, res, next) {
    var user = new userModel(req.body)
    user.save(function(err) { //We try to save the user
        errorHandler(err, req, res, next)
        res.status(201)
        return res.end()
    })
})

/**
 * get user information
 * @type {Get}
 */
router.get('/user', mid.isAuth, function(req, res, next) {
    res.status(200)
    userModel.findOne({ //We find the user
        'emailAddress': req.currentUser.emailAddress
    })
    .select('-password -confirmPassword -_id -__v') //We don't wan't to send any of these informations to the user
    .exec(function(err, user) {
        errorHandler(err, req, res, next, 404)
        return res.json(user)
    })
})

/**
 * Save an article to the current user
 * @type {Post}
 */
router.post('/save/article', mid.isAuth, function(req, res, next) {
    userModel.findOne({ //Find the user
        'emailAddress': req.currentUser.emailAddress
    })
    .exec(function(err, user) {
        errorHandler(err, req, res, next, 404)

        user.articles.push(req.body) //add the article
        user.update(user, function(err) { //Update the user with the article
            errorHandler(err, req, res, next)
            res.status(201)
            return res.end()
        })
    })
})

/**
 * Delete article from the current user
 * @type {Delete}
 */
router.delete('/delete/article/:id', mid.isAuth, function(req, res, next) {
    userModel.findOne({
        'emailAddress': req.currentUser.emailAddress //We find the user
    })
    .exec(function(err, user) {
        errorHandler(err, req, res, next, 404)

        user.articles.forEach(function(article, index) { //We find and remove the article
            if (article._id == req.params.id) {
                user.articles.splice(index, 1)
            }
        })

        user.update(user, function(err) { //We update the user
            errorHandler(err, req, res, next, 404)
            res.status(204)
            return res.end()
        })
    })
})


/**
 * Save a location to the current user
 * @type {Post}
 */
router.post('/save/place', mid.isAuth, function(req, res, next) {
    userModel.findOne({
        'emailAddress': req.currentUser.emailAddress //We find the user
    })
    .exec(function(err, user) {
        errorHandler(err, req, res, next, 404)

        user.savedPlaces.push(req.body) //We add a place
        user.update(user, function(err) { //We try to update the user
            errorHandler(err, req, res, next)
            res.status(201)
            return res.end()
        })
    })
})


/**
 * Delete location from the current user
 * @type {Delete}
 */
router.delete('/delete/place/:id', mid.isAuth, function(req, res, next) {
    userModel.findOne({ //We find the user
        'emailAddress': req.currentUser.emailAddress
    })
    .exec(function(err, user) {
        errorHandler(err, req, res, next, 404)

        user.savedPlaces.forEach(function(place, index) { //We find and remove the place from the user
            if (place._id == req.params.id) {
                user.savedPlaces.splice(index, 1)
            }
        })

        user.update(user, function(err) { //we try to update the user
            errorHandler(err, req, res, next, 404)
            res.status(204)
            return res.end()
        })
    })
})


module.exports = router
