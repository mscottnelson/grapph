var angular = require('angular');

angular.module('grapph.weight', [])
.service('WeightListService', function($http) {
  var weightList = ['150', '150.5', '150.7878'];

  this.retrieveWeightList = function() {
    return $http.get('/weights/list')
    .then(function(res) {
      weightList = res.data;
      console.log("**********weightList: " + JSON.stringify(weightList));
    })
    .catch(function(err) {
      console.log("Error: " + err);
    });
  };

  this.getWeightList = function() {
    return weightList;
  };

  this.addWeight = function(toAdd) {
    $http.post('/weights/new', { weight: toAdd })
    .then(function(res) {
      weightList = res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err);
    });
  };

  this.deleteWeight = function(item) {
    $http.post('/weights/delete', item)
    .then(function(res){
      weightList = res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err);
    });
  };

})
.controller('WeightListController', function(WeightListService, $scope) {
  var vm = this;

  WeightListService.retrieveWeightList();

  vm.addWeight = function(toAdd) {
    WeightListService.addWeight(toAdd);
  };

  vm.deleteWeight = function(item) {
    WeightListService.deleteWeight(item);
  };

  $scope.$watch(function() {
    return WeightListService.getWeightList();
  }, function(newVal, oldVal) {
    vm.weightList = newVal;
  });

});

module.exports = angular.module('grapph.weight');
