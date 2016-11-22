
var angular = require('angular');

angular.module("grapph", [require('./grapph/registration').name, require('angular-route/index')])

angular.bootstrap(document, ['grapph']);
