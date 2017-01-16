/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] no-unused-vars: ["error", { "args": "none" }] */
'use strict'

/**
 * This Module holds the main entrence to the server and route functionality
 *
 * @summary   The module holds the server functionality and  is the place where we take care of all the error handeling
 *
 * @since     07.01.2017
 * @requires Node.js, mongoose, express & bodyparser
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    api = require('./routes/api.js'),
    mid = require('./middleware/mid'),
    path = require('path')

var app = express()

mongoose.connect('mongodb://localhost:27017/wikiMap') //We connect ot the database

var db = mongoose.connection

// set our port
app.set('port', process.env.PORT || 3000)

// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// vendor scripts
app.get('/vendor/angular.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules', 'angular', 'angular.js'));
})
app.get('/vendor/angular-route.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules', 'angular-route', 'angular-route.js'));
})
app.get('/vendor/angular-google-maps.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules', 'angular-google-maps/dist', 'angular-google-maps.js'));
})
app.get('/vendor/angular-simple-logger.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules', 'angular-simple-logger/dist', 'angular-simple-logger.js'));
})
app.get('/vendor/angular-base64.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../node_modules', 'angular-base64', 'angular-base64.js'));
})


app.use(mid.getAuth) //Setup the getAuth middleware

app.use('/', express.static('public')) //Setup the static server

app.use('/api', api)

// catch a 404 and forward the error to the handler
app.use(function(req, res, next) { //<-- see that this has no error, therefore this middleware is called last if there has been no other route to take up the request
    var err = new Error('404 File Not Found')
    err.status = 404 //Set status to 404
    next(err) //Send to error handler
})

//The error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    return res.json(err) //We send the error
})


//Incase of a database error
db.on('error', function(err) {
    console.log('Failed to connect to database')
    console.error('connection error:', err)
})

//When we open the database
db.once('open', function() {
    console.log('db connection successful')
    // start listening on our port
    var server = app.listen(app.get('port'), function() {
        console.log('Express server is listening on port ' + server.address().port)
    })
})
