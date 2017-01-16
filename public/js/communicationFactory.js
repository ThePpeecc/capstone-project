
(function() {
    angular.module('app') // We get the app module
        .factory('communicationFactory', function() {
          return {
            url: '',
            userData: '',
            loggedIn: false,
          }

        })
})()
