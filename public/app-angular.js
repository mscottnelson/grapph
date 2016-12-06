var angular = require('angular');

angular.module("grapph", [require('./grapph/registration').name, require('./grapph/user-weight').name, require('./grapph/chartApp').name, require('angular-route/index')]);

angular.bootstrap(document, ['grapph']);
