/* */ 
(function(process) {
  var path = require('path');
  exports.intercept = function(clazz, method, interceptor) {
    var proto = clazz.prototype,
        _super = proto[method],
        unwrapArgs = interceptor.length > 2;
    proto[method] = function() {
      if (unwrapArgs) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(_super, arguments);
        return interceptor.apply(this, args);
      } else {
        return interceptor.call(this, _super, arguments);
      }
    };
  };
  exports.toFileUrl = function(fileName) {
    var pathname = path.resolve(process.cwd(), fileName).replace(/\\/g, '/');
    if (pathname[0] !== '/') {
      pathname = '/' + pathname;
    }
    return 'file://' + pathname;
  };
  exports.defineSetter = function defineSetter(object, property, setterFn) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property) || {
      configurable: true,
      enumerable: true
    };
    descriptor.set = setterFn;
    Object.defineProperty(object, property, descriptor);
  };
  exports.defineGetter = function defineGetter(object, property, getterFn) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property) || {
      configurable: true,
      enumerable: true
    };
    descriptor.get = getterFn;
    Object.defineProperty(object, property, descriptor);
  };
  exports.createFrom = function createFrom(prototype, properties) {
    properties = properties || {};
    var descriptors = {};
    Object.getOwnPropertyNames(properties).forEach(function(name) {
      descriptors[name] = Object.getOwnPropertyDescriptor(properties, name);
    });
    return Object.create(prototype, descriptors);
  };
  exports.inheritFrom = function inheritFrom(Superclass, Subclass, properties) {
    properties = properties || {};
    Object.defineProperty(properties, 'constructor', {
      value: Subclass,
      writable: true,
      configurable: true
    });
    Subclass.prototype = exports.createFrom(Superclass.prototype, properties);
  };
})(require('process'));
