var angular = require('angular');

angular.module('grapph.chartApp', ['grapph.weight'])
.controller('WeightChartController', function(WeightListService, $scope) {
  var vm = this;

  WeightListService.getWeightList();

  vm.getWeightList = function() {
    return WeightListService.getWeightList();
  };

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
})
.directive('linearChart', function($parse, $window){
  return{
    restrict:'EA',
    controller: 'WeightChartController',
    controllerAs: 'weightChartController',
    template:"<svg width='100%' height='300px'></svg>",
    link: function(scope, elem, attrs, weightChartController){

  //    var svg = d3.select('.chart-container').append("svg")

      var weightDataToPlot = weightChartController.getWeightList();
      var padding = 20;
      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;


      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0])

      var $container = rawSvg,
        width = $container.width(),
        height = $container.height()

      rawSvg.attr("width", '100%')
      .attr("height", '300px')
      .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
      //.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");


      scope.$watch(function() {
        return weightChartController.getWeightList();
      }, function(newVal, oldVal){
        weightDataToPlot = newVal;
        redrawLineChart();
      });

      function setChartParameters(){
        var weightDataToPlot = weightChartController.getWeightList();

        var timeFormat = d3.time.format("%x");

        console.log("Date as given: ", weightDataToPlot[0].createdAt);
        console.log("Date as given: ", new Date(weightDataToPlot[0].createdAt));

        xScale = d3.time.scale()
        .domain([new Date(weightDataToPlot[0].createdAt), new Date(weightDataToPlot[weightDataToPlot.length-1].createdAt)])
        .range([padding + 5, width - padding]);

        // xScale = d3.scale.linear()
        // .domain([Date.parse(weightDataToPlot[0].createdAt)*1000, Date.parse(weightDataToPlot[weightDataToPlot.length-1].createdAt)*1000])
        // .range([padding + 5, rawSvg.attr("width") - padding]);

        yScale = d3.scale.linear()
        .domain([0, d3.max(weightDataToPlot, function (d) {
          return d.weight;
        })+20])
        .range([height - padding, 0]);

        xAxisGen = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(3)
        .tickFormat(timeFormat);

        yAxisGen = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

        lineFun = d3.svg.line()
        .x(function (d) {
          return xScale(new Date(d.createdAt));
        })
        .y(function (d) {
          return yScale(d.weight);
        });
        //.interpolate("cardinal");

        areaFun = d3.svg.area()
        .x(function (d) {
          return xScale(new Date(d.createdAt));
        })
        .y0(height-20)
        .y1(function (d) {
          return yScale(d.weight);
        });

      }

      function drawLineChart() {
        var weightDataToPlot = weightChartController.getWeightList();

        setChartParameters();

        svg.append("svg:path")
        .attr("d", lineFun(weightDataToPlot))
        .attr("class", pathClass)

        svg.append("svg:path")
        .datum(weightDataToPlot)
        .attr("class", "area")
        .attr("d", areaFun);

      	svg.selectAll('circle')
      	.data(weightDataToPlot)
      	.enter().append('circle')
      	  .attr('cx', function (d) { return xScale(new Date(d.createdAt)); })
      	  .attr('cy', function (d) { return yScale(d.weight); })
      	  .attr('r', 5)
          .attr("class","node")

        // axes

        svg.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,280)")
        .call(xAxisGen);

        svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate("+(width)+",0)")
        .call(yAxisGen);



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

        svg.selectAll(".area")
        .attr({
          d: areaFun(weightDataToPlot)
        });

        svg.selectAll(".node").remove()

        svg.selectAll('circle')
      	.data(weightDataToPlot)
      	.enter().append('circle')
      	  .attr('cx', function (d) { return xScale(new Date(d.createdAt)); })
      	  .attr('cy', function (d) { return yScale(d.weight); })
      	  .attr('r', 5)
          .attr("class","node")

      }

      drawLineChart();
    }
  };
});

module.exports = angular.module('grapph.chartApp');
