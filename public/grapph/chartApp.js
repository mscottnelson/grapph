var angular = require('angular');

angular.module('grapph.chartApp', [])
.service('WeightChartService', function($http) {
  var weightList = [{"username":"foo", "weight":250, "createdAt":"2016-12-01T01:38:54.223Z"},{"username":"foo", "weight":253, "createdAt":"2016-12-01T01:38:57.501Z"},{"username":"foo", "weight":257, "createdAt":"2016-12-02T01:38:54.223Z"}]

  this.retrieveWeightList = function() {
    return $http.get('/weights/list')
    .then(function(res) {
      weightList = res.data;
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
.controller('WeightChartController', function(WeightChartService, $scope) {
  var vm = this;

  WeightChartService.getWeightList();

  vm.getWeightList = function() {
    return WeightChartService.getWeightList();
  };

  vm.addWeight = function(toAdd) {
    WeightChartService.addWeight(toAdd);
  };

  vm.deleteWeight = function(item) {
    WeightChartService.deleteWeight(item);
  };

  $scope.$watch(function() {
    return WeightChartService.getWeightList();
  }, function(newVal, oldVal) {
    vm.weightList = newVal;
  });
})
.directive('linearChart', function($parse, $window){
  return{
    restrict:'EA',
    controller: 'WeightChartController',
    controllerAs: 'weightChartController',
    template:"<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs, weightChartController){

      var weightDataToPlot = weightChartController.getWeightList();
      var padding = 20;
      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      scope.$watch(weightChartController.getWeightList(), function(newVal, oldVal){
        weightDataToPlot = newVal;
        redrawLineChart();
      });

      function setChartParameters(){
        var weightDataToPlot = weightChartController.getWeightList();

        console.log("weightA:" + JSON.stringify(Date.parse(weightDataToPlot[0].createdAt)));
        console.log("weightB:" + weightDataToPlot[0].username + Date.parse(weightDataToPlot[0].createdAt));

        xScale = d3.scale.linear()
        .domain([Date.parse(weightDataToPlot[0].createdAt), Date.parse(weightDataToPlot[weightDataToPlot.length-1].createdAt)])
        .range([padding + 5, rawSvg.attr("width") - padding]);

        yScale = d3.scale.linear()
        .domain([0, d3.max(weightDataToPlot, function (d) {
          return d.weight;
        })])
        .range([rawSvg.attr("height") - padding, 0]);

        xAxisGen = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(weightDataToPlot.length - 1);

        yAxisGen = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

        lineFun = d3.svg.line()
        .x(function (d) {
          return xScale(Date.parse(d.createdAt));
        })
        .y(function (d) {
          return yScale(d.weight);
        })
        .interpolate("basis");
      }

      function drawLineChart() {
        var weightDataToPlot = weightChartController.getWeightList();

        setChartParameters();

        svg.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,180)")
        .call(xAxisGen);

        svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(20,0)")
        .call(yAxisGen);

        svg.append("svg:path")
        .attr({
          d: lineFun(weightDataToPlot),
          "stroke": "blue",
          "stroke-width": 2,
          "fill": "none",
          "class": pathClass
        });
      }

      function redrawLineChart() {
        var weightDataToPlot = weightChartController.getWeightList();
        setChartParameters();

        svg.selectAll("g.y.axis").call(yAxisGen);

        svg.selectAll("g.x.axis").call(xAxisGen);

        svg.selectAll("."+pathClass)
        .attr({
          d: lineFun(weightDataToPlot)
        });
      }

      drawLineChart();
    }
  };
});

module.exports = angular.module('grapph.chartApp');
