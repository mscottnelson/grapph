var angular = require('angular');

angular.module('grapph.registration', [])
  .directive('uniqueUsername', function($http, $q) {
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.uniqueUsername = function(modelValue) {
          // /users/isAvailable { isAvailable: true/false }
          return $http.post('/users/available', { username: modelValue })
            .then(function(res) {
              if (!res.data.isAvailable) {
                return $q.reject('Not available');
              } else {
                return true;
              }
            });
        };
      }
    };
  })
  .directive('registrationPasswordMatch', function() {
    return {
      restrict: 'A',
      require: ['^ngModel', '^form'],
      link: function(scope, element, attrs, ctrl) {
        var passwordController = ctrl[0];
        var formController = ctrl[1];
        var confirmPasswordController = formController[attrs.registrationPasswordMatch];

        scope.$watch(function() {
          return confirmPasswordController.$viewValue;
        }, function() {
          passwordController.$$parseAndValidate();
        });

        scope.$watch(function() {
          return passwordController.$viewValue;
        }, function() {
          confirmPasswordController.$$parseAndValidate();
        })

        passwordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !confirmPasswordController.$viewValue) ||
            (modelValue === confirmPasswordController.$viewValue);
        };

        confirmPasswordController.$validators.passwordMatch = function(modelValue) {
          return (!modelValue && !passwordController.$viewValue) ||
            (modelValue === passwordController.$viewValue);
        };
      }
    };
  }).
  directive('myMap', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
          var map;

          function initMap() {
            map = new google.maps.Map(element[0], {
              center: { lat: 39.2766654, lng: -76.6142658 },
              zoom: 18,
              mapTypeId: 'roadmap'
            });
          }

          initMap();
        }
      }

  });

module.exports = angular.module('grapph.registration');
