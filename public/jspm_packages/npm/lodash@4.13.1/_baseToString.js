/* */ 
(function(process) {
  var Symbol = require('./_Symbol'),
      isSymbol = require('./isSymbol');
  var INFINITY = 1 / 0;
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }
  module.exports = baseToString;
})(require('@empty'));
