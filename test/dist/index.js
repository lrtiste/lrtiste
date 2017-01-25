(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var zora = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Zora = factory());
}(commonjsGlobal, (function () { 'use strict';

/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `co`.
 */

var index = co['default'] = co.co = co;

/**
 * Wrap the given generator `fn` into a
 * function that returns a promise.
 * This is a separate function so that
 * every `co()` call doesn't create a new,
 * unnecessary closure.
 *
 * @param {GeneratorFunction} fn
 * @return {Function}
 * @api public
 */

co.wrap = function (fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return co.call(this, fn.apply(this, arguments));
  }
};

/**
 * Execute the generator function or a generator
 * and return a promise.
 *
 * @param {Function} fn
 * @return {Promise}
 * @api public
 */

function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

/**
 * Convert a `yield`ed value into a promise.
 *
 * @param {Mixed} obj
 * @return {Promise}
 * @api private
 */

function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

/**
 * Convert an array of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

/**
 * Convert an object of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Object} obj
 * @return {Promise}
 * @api private
 */

function objectToPromise(obj){
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */

function isObject(val) {
  return Object == val.constructor;
}

function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var keys = createCommonjsModule$$1(function (module, exports) {
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
});

var is_arguments = createCommonjsModule$$1(function (module, exports) {
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
}
});

var index$1 = createCommonjsModule$$1(function (module) {
var pSlice = Array.prototype.slice;
var objectKeys = keys;
var isArguments = is_arguments;

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}
});

const assertions = {
  ok(val, message = 'should be truthy'){
    const assertionResult = {pass: Boolean(val), expected: 'truthy', actual: val, operator: 'ok', message};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  deepEqual(actual, expected, message = 'should be equivalent'){
    const assertionResult = {pass: index$1(actual, expected), actual, expected, message, operator: 'deepEqual'};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  equal(actual, expected, message = 'should be equal'){
    const assertionResult = {pass: actual === expected, actual, expected, message, operator: 'equal'};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notOk(val, message = 'should not be truthy'){
    const assertionResult = {pass: !Boolean(val), expected: 'falsy', actual: val, operator: 'notOk', message};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notDeepEqual(actual, expected, message = 'should not be equivalent'){
    const assertionResult = {pass: !index$1(actual, expected), actual, expected, message, operator: 'notDeepEqual'};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notEqual(actual, expected, message = 'should not be equal'){
    const assertionResult = {pass: actual !== expected, actual, expected, message, operator: 'notEqual'};
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  fail(reason = 'fail called'){
    const assertionResult = {
      pass: false,
      actual: 'fail called',
      expected: 'fail not called',
      message: reason,
      operator: 'fail'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  }
};

function assertion (test) {
  return Object.create(assertions, {test: {value: test}});
}

const Test = {
  run: function () {
    const assert = assertion(this);
    const now = Date.now();
    return index(this.coroutine(assert))
      .then(() => {
        return {assertions: this.assertions, executionTime: Date.now() - now};
      });
  },
  addAssertion(){
    const newAssertions = [...arguments].map(a => Object.assign({description: this.description}, a));
    this.assertions.push(...newAssertions);
    return this;
  }
};

function test ({description, coroutine, only = false}) {
  return Object.create(Test, {
    description: {value: description},
    coroutine: {value: coroutine},
    assertions: {value: []},
    only: {value: only},
    length: {
      get(){
        return this.assertions.length
      }
    }
  });
}

function tapOut ({pass, message, index}) {
  const status = pass === true ? 'ok' : 'not ok';
  console.log([status, index, message].join(' '));
}

function canExit () {
  return typeof process !== 'undefined' && typeof process.exit === 'function';
}

function tap () {
  return function * () {
    let index = 1;
    let lastId = 0;
    let success = 0;
    let failure = 0;

    const starTime = Date.now();
    console.log('TAP version 13');
    try {
      while (true) {
        const assertion = yield;
        if (assertion.pass === true) {
          success++;
        } else {
          failure++;
        }
        assertion.index = index;
        if (assertion.id !== lastId) {
          console.log(`# ${assertion.description} - ${assertion.executionTime}ms`);
          lastId = assertion.id;
        }
        tapOut(assertion);
        if (assertion.pass !== true) {
          console.log(`  ---
  operator: ${assertion.operator}
  expected: ${JSON.stringify(assertion.expected)}
  actual: ${JSON.stringify(assertion.actual)}
  ...`);
        }
        index++;
      }
    } catch (e) {
      console.log('Bail out! unhandled exception');
      console.log(e);
      if (canExit()) {
        process.exit(1);
      }
    }
    finally {
      const execution = Date.now() - starTime;
      if (index > 1) {
        console.log(`
1..${index - 1}
# duration ${execution}ms
# success ${success}
# failure ${failure}`);
      }
      if (failure && canExit()) {
        process.exit(1);
      }
    }
  };
}

const Plan = {
  test(description, coroutine, opts = {}){
    const testItems = (!coroutine && description.tests) ? [...description] : [{description, coroutine}];
    this.tests.push(...testItems.map(t=>test(Object.assign(t, opts))));
    return this;
  },

  only(description, coroutine){
    return this.test(description, coroutine, {only: true});
  },

  run(sink = tap()){
    const sinkIterator = sink();
    sinkIterator.next();
    const hasOnly = this.tests.some(t=>t.only);
    const runnable = hasOnly ? this.tests.filter(t=>t.only) : this.tests;
    return index(function * () {
      let id = 1;
      try {
        const results = runnable.map(t=>t.run());
        for (let r of results) {
          const {assertions, executionTime} = yield r;
          for (let assert of assertions) {
            sinkIterator.next(Object.assign(assert, {id, executionTime}));
          }
          id++;
        }
      }
      catch (e) {
        sinkIterator.throw(e);
      } finally {
        sinkIterator.return();
      }
    }.bind(this))
  },

  * [Symbol.iterator](){
    for (let t of this.tests) {
      yield t;
    }
  }
};

function plan () {
  return Object.create(Plan, {
    tests: {value: []},
    length: {
      get(){
        return this.tests.length
      }
    }
  });
}

return plan;

})));
});

var stampit_full$1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * The 'src' argument plays the command role.
 * The returned values is always of the same type as the 'src'.
 * @param dst
 * @param src
 * @returns {*}
 */
function mergeOne(dst, src) {
  if (src === undefined) { return dst; }

  // According to specification arrays must be concatenated.
  // Also, the '.concat' creates a new array instance. Overrides the 'dst'.
  if (isArray(src)) { return (isArray(dst) ? dst : []).concat(src); }

  // Now deal with non plain 'src' object. 'src' overrides 'dst'
  // Note that functions are also assigned! We do not deep merge functions.
  if (!isPlainObject(src)) { return src; }

  // See if 'dst' is allowed to be mutated. If not - it's overridden with a new plain object.
  var returnValue = isObject(dst) ? dst : {};

  var keys = Object.keys(src);
  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];

    var srcValue = src[key];
    // Do not merge properties with the 'undefined' value.
    if (srcValue !== undefined) {
      var dstValue = returnValue[key];
      // Recursive calls to mergeOne() must allow only plain objects or arrays in dst
      var newDst = isPlainObject(dstValue) || isArray(srcValue) ? dstValue : {};

      // deep merge each property. Recursion!
      returnValue[key] = mergeOne(newDst, srcValue);
    }
  }

  return returnValue;
}

var merge = function (dst) {
  var srcs = [], len = arguments.length - 1;
  while ( len-- > 0 ) srcs[ len ] = arguments[ len + 1 ];

  return srcs.reduce(mergeOne, dst);
};

var assign = Object.assign;
var isArray = Array.isArray;

function isFunction(obj) {
  return typeof obj === 'function';
}

function isObject(obj) {
  var type = typeof obj;
  return !!obj && (type === 'object' || type === 'function');
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype;
}


var concat = Array.prototype.concat;
function extractFunctions() {
  var fns = concat.apply([], arguments).filter(isFunction);
  return fns.length === 0 ? undefined : fns;
}

function concatAssignFunctions(dstObject, srcArray, propName) {
  if (!isArray(srcArray)) { return; }

  var length = srcArray.length;
  var dstArray = dstObject[propName] || [];
  dstObject[propName] = dstArray;
  for (var i = 0; i < length; i += 1) {
    var fn = srcArray[i];
    if (isFunction(fn) && dstArray.indexOf(fn) < 0) {
      dstArray.push(fn);
    }
  }
}


function combineProperties(dstObject, srcObject, propName, action) {
  if (!isObject(srcObject[propName])) { return; }
  if (!isObject(dstObject[propName])) { dstObject[propName] = {}; }
  action(dstObject[propName], srcObject[propName]);
}

function deepMergeAssign(dstObject, srcObject, propName) {
  combineProperties(dstObject, srcObject, propName, merge);
}
function mergeAssign(dstObject, srcObject, propName) {
  combineProperties(dstObject, srcObject, propName, assign);
}

/**
 * Converts stampit extended descriptor to a standard one.
 * @param [methods]
 * @param [properties]
 * @param [props]
 * @param [refs]
 * @param [initializers]
 * @param [init]
 * @param [deepProperties]
 * @param [deepProps]
 * @param [propertyDescriptors]
 * @param [staticProperties]
 * @param [statics]
 * @param [staticDeepProperties]
 * @param [deepStatics]
 * @param [staticPropertyDescriptors]
 * @param [configuration]
 * @param [conf]
 * @param [deepConfiguration]
 * @param [deepConf]
 * @param [composers]
 * @returns {Descriptor}
 */
var standardiseDescriptor = function (ref) {
  if ( ref === void 0 ) ref = {};
  var methods = ref.methods;
  var properties = ref.properties;
  var props = ref.props;
  var refs = ref.refs;
  var initializers = ref.initializers;
  var init = ref.init;
  var composers = ref.composers;
  var deepProperties = ref.deepProperties;
  var deepProps = ref.deepProps;
  var propertyDescriptors = ref.propertyDescriptors;
  var staticProperties = ref.staticProperties;
  var statics = ref.statics;
  var staticDeepProperties = ref.staticDeepProperties;
  var deepStatics = ref.deepStatics;
  var staticPropertyDescriptors = ref.staticPropertyDescriptors;
  var configuration = ref.configuration;
  var conf = ref.conf;
  var deepConfiguration = ref.deepConfiguration;
  var deepConf = ref.deepConf;

  var p = isObject(props) || isObject(refs) || isObject(properties) ?
    assign({}, props, refs, properties) : undefined;

  var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
  dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

  var sp = isObject(statics) || isObject(staticProperties) ?
    assign({}, statics, staticProperties) : undefined;

  var dsp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
  dsp = isObject(staticDeepProperties) ? merge(dsp, staticDeepProperties) : dsp;

  var c = isObject(conf) || isObject(configuration) ?
    assign({}, conf, configuration) : undefined;

  var dc = isObject(deepConf) ? merge({}, deepConf) : undefined;
  dc = isObject(deepConfiguration) ? merge(dc, deepConfiguration) : dc;

  var ii = extractFunctions(init, initializers);

  var composerFunctions = extractFunctions(composers);
  if (composerFunctions) {
    dc = dc || {};
    concatAssignFunctions(dc, composerFunctions, 'composers');
  }

  var descriptor = {};
  if (methods) { descriptor.methods = methods; }
  if (p) { descriptor.properties = p; }
  if (ii) { descriptor.initializers = ii; }
  if (dp) { descriptor.deepProperties = dp; }
  if (sp) { descriptor.staticProperties = sp; }
  if (methods) { descriptor.methods = methods; }
  if (dsp) { descriptor.staticDeepProperties = dsp; }
  if (propertyDescriptors) { descriptor.propertyDescriptors = propertyDescriptors; }
  if (staticPropertyDescriptors) { descriptor.staticPropertyDescriptors = staticPropertyDescriptors; }
  if (c) { descriptor.configuration = c; }
  if (dc) { descriptor.deepConfiguration = dc; }

  return descriptor;
};

/**
 * Creates new factory instance.
 * @param {Descriptor} descriptor The information about the object the factory will be creating.
 * @returns {Function} The new factory function.
 */
function createFactory(descriptor) {
  return function Stamp(options) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    // Next line was optimized for most JS VMs. Please, be careful here!
    var obj = Object.create(descriptor.methods || null);

    merge(obj, descriptor.deepProperties);
    assign(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    if (!descriptor.initializers || descriptor.initializers.length === 0) { return obj; }

    if (options === undefined) { options = {}; }
    var inits = descriptor.initializers;
    var length = inits.length;
    for (var i = 0; i < length; i += 1) {
      var initializer = inits[i];
      if (isFunction(initializer)) {
        var returnedValue = initializer.call(obj, options,
          {instance: obj, stamp: Stamp, args: [options].concat(args)});
        obj = returnedValue === undefined ? obj : returnedValue;
      }
    }

    return obj;
  };
}

/**
 * Returns a new stamp given a descriptor and a compose function implementation.
 * @param {Descriptor} [descriptor={}] The information about the object the stamp will be creating.
 * @param {Compose} composeFunction The "compose" function implementation.
 * @returns {Stamp}
 */
function createStamp(descriptor, composeFunction) {
  var Stamp = createFactory(descriptor);

  merge(Stamp, descriptor.staticDeepProperties);
  assign(Stamp, descriptor.staticProperties);
  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

  var composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
  Stamp.compose = function _compose() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return composeImplementation.apply(this, args);
  };
  assign(Stamp.compose, descriptor);

  return Stamp;
}

/**
 * Mutates the dstDescriptor by merging the srcComposable data into it.
 * @param {Descriptor} dstDescriptor The descriptor object to merge into.
 * @param {Composable} [srcComposable] The composable
 * (either descriptor or stamp) to merge data form.
 * @returns {Descriptor} Returns the dstDescriptor argument.
 */
function mergeComposable(dstDescriptor, srcComposable) {
  var srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable;
  if (!isObject(srcDescriptor)) { return dstDescriptor; }

  mergeAssign(dstDescriptor, srcDescriptor, 'methods');
  mergeAssign(dstDescriptor, srcDescriptor, 'properties');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'deepProperties');
  mergeAssign(dstDescriptor, srcDescriptor, 'propertyDescriptors');
  mergeAssign(dstDescriptor, srcDescriptor, 'staticProperties');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'staticDeepProperties');
  mergeAssign(dstDescriptor, srcDescriptor, 'staticPropertyDescriptors');
  mergeAssign(dstDescriptor, srcDescriptor, 'configuration');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'deepConfiguration');
  concatAssignFunctions(dstDescriptor, srcDescriptor.initializers, 'initializers');

  return dstDescriptor;
}

/**
 * Given the list of composables (stamp descriptors and stamps) returns
 * a new stamp (composable factory function).
 * @typedef {Function} Compose
 * @param {...(Composable)} [composables] The list of composables.
 * @returns {Stamp} A new stamp (aka composable factory function)
 */
function compose() {
  var composables = [], len = arguments.length;
  while ( len-- ) composables[ len ] = arguments[ len ];

  var descriptor = [this]
    .concat(composables)
    .filter(isObject)
    .reduce(mergeComposable, {});
  return createStamp(descriptor, compose);
}


/**
 * The Stamp Descriptor
 * @typedef {Function|Object} Descriptor
 * @returns {Stamp} A new stamp based on this Stamp
 * @property {Object} [methods] Methods or other data used as object instances' prototype
 * @property {Array<Function>} [initializers] List of initializers called for each object instance
 * @property {Object} [properties] Shallow assigned properties of object instances
 * @property {Object} [deepProperties] Deeply merged properties of object instances
 * @property {Object} [staticProperties] Shallow assigned properties of Stamps
 * @property {Object} [staticDeepProperties] Deeply merged properties of Stamps
 * @property {Object} [configuration] Shallow assigned properties of Stamp arbitrary metadata
 * @property {Object} [deepConfiguration] Deeply merged properties of Stamp arbitrary metadata
 * @property {Object} [propertyDescriptors] ES5 Property Descriptors applied to object instances
 * @property {Object} [staticPropertyDescriptors] ES5 Property Descriptors applied to Stamps
 */

/**
 * The Stamp factory function
 * @typedef {Function} Stamp
 * @returns {*} Instantiated object
 * @property {Descriptor} compose - The Stamp descriptor and composition function
 */

/**
 * A composable object - stamp or descriptor
 * @typedef {Stamp|Descriptor} Composable
 */

/**
 * Returns true if argument is a stamp.
 * @param {*} obj
 * @returns {Boolean}
 */
function isStamp(obj) {
  return isFunction(obj) && isFunction(obj.compose);
}

function createUtilityFunction(propName, action) {
  return function composeUtil() {
    var i = arguments.length, argsArray = Array(i);
    while ( i-- ) argsArray[i] = arguments[i];

    return ((this && this.compose) || stampit).call(this, ( obj = {}, obj[propName] = action.apply(void 0, [ {} ].concat( argsArray )), obj ));
    var obj;
  };
}

var methods = createUtilityFunction('methods', assign);

var properties = createUtilityFunction('properties', assign);
function initializers() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return ((this && this.compose) || stampit).call(this, {
    initializers: extractFunctions.apply(void 0, args)
  });
}
function composers() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return ((this && this.compose) || stampit).call(this, {
    composers: extractFunctions.apply(void 0, args)
  });
}

var deepProperties = createUtilityFunction('deepProperties', merge);
var staticProperties = createUtilityFunction('staticProperties', assign);
var staticDeepProperties = createUtilityFunction('staticDeepProperties', merge);
var configuration = createUtilityFunction('configuration', assign);
var deepConfiguration = createUtilityFunction('deepConfiguration', merge);
var propertyDescriptors = createUtilityFunction('propertyDescriptors', assign);

var staticPropertyDescriptors = createUtilityFunction('staticPropertyDescriptors', assign);

var allUtilities = {
  methods: methods,

  properties: properties,
  refs: properties,
  props: properties,

  initializers: initializers,
  init: initializers,

  composers: composers,

  deepProperties: deepProperties,
  deepProps: deepProperties,

  staticProperties: staticProperties,
  statics: staticProperties,

  staticDeepProperties: staticDeepProperties,
  deepStatics: staticDeepProperties,

  configuration: configuration,
  conf: configuration,

  deepConfiguration: deepConfiguration,
  deepConf: deepConfiguration,

  propertyDescriptors: propertyDescriptors,

  staticPropertyDescriptors: staticPropertyDescriptors
};

/**
 * Infected stamp. Used as a storage of the infection metadata
 * @type {Function}
 * @return {Stamp}
 */
var baseStampit = compose(
  {staticProperties: allUtilities},
  {
    staticProperties: {
      create: function create() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return this.apply(void 0, args);
      },
      compose: stampit // infecting
    }
  }
);

/**
 * Infected compose
 * @param {...(Composable)} [args] The list of composables.
 * @return {Stamp}
 */
function stampit() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var composables = args.filter(isObject)
    .map(function (arg) { return isStamp(arg) ? arg : standardiseDescriptor(arg); });

  // Calling the standard pure compose function here.
  var stamp = compose.apply(this || baseStampit, composables);

  var composerFunctions = stamp.compose.deepConfiguration &&
    stamp.compose.deepConfiguration.composers;
  if (isArray(composerFunctions)) {
    for (var i = 0; i < composerFunctions.length; i += 1) {
      if (isFunction(composerFunctions[i])) {
        var returnedValue = composerFunctions[i]({stamp: stamp, composables: composables});
        stamp = isStamp(returnedValue) ? returnedValue : stamp;
      }
    }
  }

  return stamp;
}

var exportedCompose = stampit.bind(); // bind to 'undefined'
stampit.compose = exportedCompose;

// Setting up the shortcut functions
var stampit$1 = assign(stampit, allUtilities);

exports.methods = methods;
exports.properties = properties;
exports.refs = properties;
exports.props = properties;
exports.initializers = initializers;
exports.init = initializers;
exports.composers = composers;
exports.deepProperties = deepProperties;
exports.deepProps = deepProperties;
exports.staticProperties = staticProperties;
exports.statics = staticProperties;
exports.staticDeepProperties = staticDeepProperties;
exports.deepStatics = staticDeepProperties;
exports.configuration = configuration;
exports.conf = configuration;
exports.deepConfiguration = deepConfiguration;
exports.deepConf = deepConfiguration;
exports.propertyDescriptors = propertyDescriptors;
exports.staticPropertyDescriptors = staticPropertyDescriptors;
exports.compose = exportedCompose;
exports['default'] = stampit$1;
module.exports = exports['default'];

});

var compose = stampit_full$1.compose;













var init = stampit_full$1.init;




var methods = stampit_full$1.methods;

function element ({propertyName = 'el'}={propertyName: 'el'}) {
  return init(function assertElement(opts = {}) {
    const el = opts[propertyName];
    if (!el) {
      throw new Error(`You must provide a dom element as "${propertyName}" property`);
    }
    Object.defineProperty(this, propertyName, {value: el});
  });
}

function ariaElement ({ariaRole, propertyName = 'el'}) {
  const elStamp = element({propertyName});
  return compose(elStamp, init(function assertAriaRole() {
    const role = this.el.getAttribute('role');
    if (role !== ariaRole) {
      throw new Error(`the element used to create the component is expected to have the aria role ${ariaRole}`);
    }
  }));
}

var elements = zora().test('throw an error if element argument is not provided', function * (t) {
  try {
    const elStamp = element();
    const comp = elStamp();
    t.fail('should have thrown an error');
  } catch (e) {
    t.equal(e.message, 'You must provide a dom element as "el" property');
  }
})
  .test('should set the readonly prop "el" on the instance', function * (t) {
    try {
      const elStamp = element();
      const domEl = 'dom element';
      const comp = elStamp({el: domEl});
      t.equal(comp.el, domEl);
      comp.el = 'foo';
      t.fail('should have thrown an error');
    } catch (e) {
      t.ok(e, 'error should be defined');
    }
  })
  .test('should be able to rename the property', function * (t) {
    try {
      const elStamp = element({propertyName: 'foo'});
      const domEl = 'dom element';
      const comp = elStamp({foo: domEl});
      t.equal(comp.foo, domEl);
      comp.foo = 'foo';
      t.fail('should have thrown an error');
    } catch (e) {
      t.ok(e, 'the error should be defined');
    }
  });

function observable$1 (...properties$$1) {
  return init(function () {
    const listeners = {};

    if (!this.$onChange || !this.$on) {
      this.$onChange = (prop, newVal) => {
        const ls = listeners[prop] || [];
        for (let cb of ls) {
          cb(newVal);
        }
        return this;
      };

      this.$on = (property, cb)=> {
        const listenersList = listeners[property] || [];
        listenersList.push(cb);
        listeners[property] = listenersList;
        return this;
      };
    }

    for (let prop of properties$$1) {
      let value = this[prop];
      Object.defineProperty(this, prop, {
        get(){
          return value;
        },
        set(val){
          value = val;
          this.$onChange(prop, val);
        }
      });
    }
  });
}

const mandatoryEl = element();

function mapToAria (prop, ...attributes) {
  const ariaAttributes = attributes.map(attr=> {
    const isNot = /^\!/.test(attr);
    const att = isNot ? attr.substr(1) : attr;
    const fn = isNot ? v => !v : v=>v;
    return {attr: ['aria', att].join('-'), fn};
  });
  return compose(
    mandatoryEl,
    observable$1(prop),
    init(function () {
      this.$on(prop, newVal => {
        for (let att of ariaAttributes) {
          this.el.setAttribute(att.attr, att.fn(newVal));
        }
      });
    })
  );
}

function mockElement () {
  return {
    setAttribute(attr, val){
      this[attr] = val;
    }
  }
}

var observable$$1 = zora()
  .test('observe a property and get notified with the new value', t=> {
    const obsStamp = observable$1('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
  })
  .test('do not get notified if the value remains the same', t=> {
    const obsStamp = observable$1('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
    comp.myProp = 'foo';
  })
  .test('manually emit a change event', t=> {
    const obsStamp = observable$1('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    comp.$onChange('myProp', 'bar');
  })
  .test('use arrity n api', t=> {
    const obsStamp = observable$1('myProp', 'myPropBis');
    const obs = obsStamp();
    obs.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', myPropBis=> {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  })
  .test('compose multiple times with observable', t=> {
    const obsStamp = compose(observable$1('myProp'), observable$1('myPropBis'));
    const obs = obsStamp();
    obs.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', myPropBis=> {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  })
  .test('have multiple listeners', t=> {
    const obsStamp = observable$1('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.$on('myProp', myProp => {
      t.ok(true);
    });
    comp.myProp = 'foo';
  })
  .test('map a property to aria attribute', t=> {
    const stamp = mapToAria('foo', 'bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
  })
  .test('map a property to aria attribute negating the value', t=> {
    const stamp = mapToAria('foo', '!bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], false);
  })
  .test('use arrity n api', t=> {
    const stamp = mapToAria('foo', 'bar', '!blah', 'woot');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-blah'], false);
    t.equal(inst.el['aria-woot'], true);
  })
  .test('should compose multiple times mapToAria', t=> {
    const stamp = compose(mapToAria('foo', 'bar'), mapToAria('blah', 'woot'));
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    inst.blah = false;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-woot'], false);
  });

function toggle$1 (prop = 'isOpen') {
  return methods({
    toggle(){
      this[prop] = !this[prop];
    }
  });
}

var toggle$$1 = zora()
  .test('toggle "isOpen" by default', function * (t) {
    const stamp = toggle$1();
    const inst = stamp();
    inst.isOpen = true;
    inst.toggle();
    t.equal(inst.isOpen, false);
  })
  .test('toggle a given property', function * (t) {
    const stamp = toggle$1('foo');
    const inst = stamp();
    inst.foo = false;
    inst.toggle();
    t.equal(inst.foo, true);
  });

const abstractListMediatorStamp = init(function({ items = [] }) {
  Object.defineProperty(this, 'items', { value: items });
}).methods({
  addItem(item) {
    this.items.push(item);
  },
  selectItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      for (let i of this.items) {
        i.isSelected = i === item;
      }
    }
  },
  selectNextItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      const newIndex = index === this.items.length - 1 ? 0 : index + 1;
      this.selectItem(this.items[newIndex]);
    }
  },
  selectPreviousItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      const newIndex = index === 0 ? this.items.length - 1 : index - 1;
      this.selectItem(this.items[newIndex]);
    }
  }
});

const listItem = init(function({ listMediator, isOpen }) {
  if (!listMediator) {
    throw new Error('you must provide a listMediator to the listItem');
  }
  this.isOpen = this.isOpen ? this.isOpen : isOpen === true;
  Object.defineProperty(this, 'listMediator', { value: listMediator });
  listMediator.addItem(this);
}).methods({
  toggle() {
    this.listMediator.toggleItem(this);
  },
  select() {
    this.listMediator.selectItem(this);
  },
  selectPrevious() {
    this.listMediator.selectPreviousItem(this);
  },
  selectNext() {
    this.listMediator.selectNextItem(this);
  }
});

const multiSelectListMediator = compose(
  abstractListMediatorStamp,
  methods({
    toggleItem(item) {
      const index = this.items.indexOf(item);
      if (index !== -1) {
        item.isOpen = !item.isOpen;
      }
    }
  })
);

const listMediator = compose(
  abstractListMediatorStamp,
  methods({
    toggleItem(item) {
      for (let i of this.items) {
        i.isOpen = i === item ? !i.isOpen : false;
      }
      return this;
    }
  })
);

var list = zora().test('list mediator: add item', function*(t) {
  const instance = listMediator();
  t.equal(instance.items.length, 0);
  const item = {};
  instance.addItem(item);
  t.deepEqual(instance.items, [ item ]);
}).test('list mediator: open an item and close all others', function*(t) {
  const instance = listMediator();
  const item = { isOpen: false };
  const item2 = { isOpen: false };
  const item3 = { isOpen: true };
  instance.addItem(item);
  instance.addItem(item2);
  instance.addItem(item3);

  instance.toggleItem(item2);
  t.equal(item.isOpen, false);
  t.equal(item2.isOpen, true);
  t.equal(item3.isOpen, false);

  instance.toggleItem(item2);
  t.equal(item.isOpen, false);
  t.equal(item2.isOpen, false);
  t.equal(item3.isOpen, false);
}).test('select an item and unselect the others', function*(t) {
  const instance = listMediator();
  const item = { isSelected: false };
  const item2 = { isSelected: false };
  const item3 = { isSelected: true };
  instance.addItem(item);
  instance.addItem(item2);
  instance.addItem(item3);

  instance.selectItem(item2);
  t.equal(item.isSelected, false);
  t.equal(item2.isSelected, true);
  t.equal(item3.isSelected, false);
}).test('select the next item or loop back to the first', function*(t) {
  const instance = listMediator();
  const item = { isSelected: false };
  const item2 = { isSelected: true };
  const item3 = { isSelected: false };
  instance.addItem(item);
  instance.addItem(item2);
  instance.addItem(item3);

  instance.selectNextItem(item2);
  t.equal(item.isSelected, false);
  t.equal(item2.isSelected, false);
  t.equal(item3.isSelected, true);

  instance.selectNextItem(item3);
  t.equal(item.isSelected, true);
  t.equal(item2.isSelected, false);
  t.equal(item3.isSelected, false);
}).test('select the previous item or loop back to the last', function*(t) {
  const instance = listMediator();
  const item = { isSelected: false };
  const item2 = { isSelected: true };
  const item3 = { isSelected: false };
  instance.addItem(item);
  instance.addItem(item2);
  instance.addItem(item3);

  instance.selectPreviousItem(item2);
  t.equal(item.isSelected, true);
  t.equal(item2.isSelected, false);
  t.equal(item3.isSelected, false);

  instance.selectPreviousItem(item);
  t.equal(item.isSelected, false);
  t.equal(item2.isSelected, false);
  t.equal(item3.isSelected, true);
}).test('multiselect list mediator: toggle any item', function*(t) {
  const instance = multiSelectListMediator();
  const item = { isOpen: false };
  const item2 = { isOpen: false };
  const item3 = { isOpen: true };
  instance.addItem(item);
  instance.addItem(item2);
  instance.addItem(item3);

  instance.toggleItem(item);

  t.equal(item.isOpen, true);
  t.equal(item2.isOpen, false);
  t.equal(item3.isOpen, true);
});

var behaviours = zora()
  .test(elements)
  .test(observable$$1)
  .test(toggle$$1)
  .test(list);

const mandatoryElement = element();
const tablist = ariaElement({ariaRole: 'tablist'});

const accordionTabEventBinding = init(function () {
  this.el.addEventListener('click', event => {
    this.toggle();
    this.select();
  });

  this.el.addEventListener('keydown', event => {
    const {key: k, code, target} = event;
    if (k === 'Enter' || code === 'Space') {
      if (target.tagName !== 'BUTTON' || target.tagName === 'A') {
        this.toggle();
        this.select();
        event.preventDefault();
      }
    } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowRight' || k === 'ArrowDown') {
      this.selectNext();
      event.preventDefault();
    }
  });
});
const accordionTabpanelEventBinding = init(function () {
  this.el.addEventListener('focusin', event => {
    this.tab.select();
  });
  this.el.addEventListener('click', event => {
    this.tab.select();
  });
});

const accordionTabpanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  toggle$1(),
  methods({
    hasFocus() {
      return this.el.querySelector(':focus') !== null;
    }
  }),
  mapToAria('isOpen', '!hidden'),
  init(function initializeAccordionTabpanel ({tab}) {
    Object.defineProperty(this, 'tab', {value: tab});
  }),
  accordionTabpanelEventBinding
);

const accordionTabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItem,
  mapToAria('isOpen', 'expanded'),
  mapToAria('isSelected', 'selected'),
  init(function initializeAccordionTab ({tabpanelEl}) {
    const tabpanel = accordionTabpanelStamp({el: tabpanelEl, tab: this});
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});
    this.$on('isOpen', isOpen => {
      this.tabpanel.toggle();
    });

    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected && !this.tabpanel.hasFocus()) {
        this.el.focus();
      }
    });

    this.isSelected = this.el.getAttribute('aria-selected') == 'true' ||
      this.el.getAttribute('tabindex') === '0';
    this.isOpen = this.el.getAttribute('aria-expanded') === 'true';
    this.tabpanel.isOpen = this.isOpen;
  }),
  accordionTabEventBinding
);





function accordion () {
  return compose(
    mandatoryElement,
    multiSelectListMediator,
    init(function initializeAccordionTablist () {
      Object.defineProperty(this, 'tablist', {
        value: tablist({
          el: this.el.querySelector('[role=tablist]') || this.el
        })
      });
      this.tablist.el.setAttribute('aria-multiselectable', true);
      for (let tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(tab);
          throw new Error(
            'for the accordion tab element above, you must specify which tabpanel is controlled using aria-controls'
          );
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if (!tabpanelEl) {
          console.log(tab);
          throw new Error(
            `for the tab element above, could not find the related tabpanel with the id ${controlledId}`
          );
        }
        accordionTabStamp({tabpanelEl, el: tab, listMediator: this});
      }
    })
  );
}

function click (el, opts = {bubbles: true, cancelable: true}) {
  const event = new MouseEvent('click', opts);
  el.dispatchEvent(event);
}

function keydown (el, opts = {}) {
  const options = Object.assign({}, opts, {bubbles: true, cancelable: true});
  const event = new KeyboardEvent('keydown', options);
  el.focus();
  el.dispatchEvent(event);
}

const factory = accordion();

function createAccordion () {
  const container = document.createElement('div');
  container.setAttribute('role', 'tablist');
  container.innerHTML = `
  <h4 id="tab1" tabindex="0" role="tab" aria-controls="tabpanel1">Header one</h4>
  <p id="tabpanel1" aria-labelledby="tab1" role="tabpanel">Content of section 1 with a <a href="#foo">focusable element</a></p>
  <h4 id="tab2" role="tab" aria-controls="tabpanel2"><span class="adorner" aria-hidden="true"></span>Header two</h4>
  <p id="tabpanel2" aria-labelledby="tab2" role="tabpanel">Content of section 2 with a <a href="#foo">focusable element</a></p>
  <h4 id="tab3" role="tab" aria-controls="tabpanel3"><span class="adorner" aria-hidden="true"></span>Header three</h4>
  <p id="tabpanel3" aria-labelledby="tab3" role="tabpanel">Content of section 3 with a <a href="#foo">focusable element</a></p>
`;
  return container;
}

function testTab (accordion$$1, expected, t) {
  const tabs = accordion$$1.querySelectorAll('[role=tab]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `tabs[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}

function testTabPanels (accordion$$1, expected, t) {
  const tabs = accordion$$1.querySelectorAll('[role=tabpanel]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `tabpanel  [${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


var accordions = zora()
  .test('accordion: set up initial states ', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open an accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: close an accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open two accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    const tab3 = el.querySelector('#tab3');
    click(tab3);
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'true',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0',
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }], t);
  })
  .test('accordion: open on key down enter', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    keydown(tab2, {key: 'Enter'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down space', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    keydown(tab2, {code: 'Space'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select previous item on left arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab1 = el.querySelector('#tab1');
    tab2.focus();
    keydown(tab2, {key: 'ArrowLeft'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab1.focus();
    keydown(tab1, {key: 'ArrowLeft'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select previous item on up arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab1 = el.querySelector('#tab1');
    tab2.focus();
    keydown(tab2, {key: 'ArrowUp'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab1.focus();
    keydown(tab1, {key: 'ArrowUp'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select next item on right arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab3 = el.querySelector('#tab3');
    tab2.focus();
    keydown(tab2, {key: 'ArrowRight'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab3.focus();
    keydown(tab3, {key: 'ArrowRight'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select next item on down arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab3 = el.querySelector('#tab3');
    tab2.focus();
    keydown(tab2, {key: 'ArrowDown'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab3.focus();
    keydown(tab3, {key: 'ArrowDown'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  });

const mandatoryElement$1 = element();
const tablist$1 = ariaElement({ariaRole: 'tablist'});

const tabEventBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'ArrowLeft' || k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowDown' || k === 'ArrowRight') {
      this.selectNext();
      event.preventDefault();
    }
  });
  this.el.addEventListener('click', event => {
    this.select();
  });
});

const tabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItem,
  mapToAria('isSelected', 'selected'),
  init(function initializeTab ({tabpanel}) {
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});
    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected !== this.tabpanel.isOpen) {
        this.tabpanel.toggle();
      }
      if (isSelected) {
        this.el.focus();
      }
    });
    this.isSelected = this.el.getAttribute('aria-selected') === 'true';
    this.tabpanel.isOpen = this.isSelected;
  }),
  tabEventBinding
);

const tabPanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  toggle$1(),
  mapToAria('isOpen', '!hidden')
);





function tabList ({tabpanelFactory = tabPanelStamp, tabFactory = tabStamp} = {}) {
  return compose(
    mandatoryElement$1,
    listMediator,
    init(function initializeTablist () {
      Object.defineProperty(this, 'tablist', {
        value: tablist$1({
          el: this.el.querySelector('[role=tablist]') || this.el
        })
      });
      for (let tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(tab);
          throw new Error(
            'for the tab element above, you must specify which tabpanel is controlled using aria-controls'
          );
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if (!tabpanelEl) {
          console.log(tab);
          throw new Error(
            `for the tab element above, could not find the related tabpanel with the id ${controlledId}`
          );
        }
        const tabpanel = tabpanelFactory({el: tabpanelEl});
        tabFactory({el: tab, listMediator: this, tabpanel});
      }
    })
  );
}

const factory$1 = tabList();

function createTablist() {
  const container = document.createElement('div');
  container.innerHTML = `
<ul role="tablist">
  <li role="presentation"><a href="#panel1" role="tab"
                             aria-controls="panel1" aria-selected="true">Markup</a></li>
  <li role="presentation"><a href="#panel2" role="tab"
                             aria-controls="panel2">Style</a>
  </li>
  <li role="presentation"><a href="#panel3" role="tab"
                             aria-controls="panel3">Script</a>
  </li>
</ul>
<div id="panel1" role="tabpanel"><h4 tabindex="0">panel 1 !!</h4>
  <p>panel content</p>
</div>
<div id="panel2" role="tabpanel"><h4 tabindex="0">panel 2 !!</h4>
  <p>panel content 2</p>
</div>
<div id="panel3" role="tabpanel"><h4 tabindex="0">panel 3 !!</h4>
  <p>panel content 3</p>
</div>
`;
  return container;
}

function testTab$1(accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=tab]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(
        tabs[i].getAttribute(attr),
        expected[i][attr],
        `tabs[${i}] attribute ${attr} should equal ${expected[i][attr]}`
      );
    }
  }
}

function testTabPanels$1(accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=tabpanel]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(
        tabs[i].getAttribute(attr),
        expected[i][attr],
        `tabpanel  [${i}] attribute ${attr} should equal ${expected[i][attr]}`
      );
    }
  }
}

var tabs = zora().test('tabs: set up initial states', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
}).test('select an other tab closing the others', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  const [ tab1, tab2, tab3 ] = el.querySelectorAll('[role=tab]');
  click(tab2);
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
}).test('select previous tab using left arrow', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  const [ tab1, tab2, tab3 ] = el.querySelectorAll('[role=tab]');
  tab1.focus();
  keydown(tab1, { key: 'ArrowLeft' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' }
    ],
    t
  );
  keydown(tab3, { key: 'ArrowLeft' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
}).test('select previous tab using up arrow', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  const [ tab1, tab2, tab3 ] = el.querySelectorAll('[role=tab]');
  tab1.focus();
  keydown(tab1, { key: 'ArrowUp' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' }
    ],
    t
  );
  keydown(tab3, { key: 'ArrowUp' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
}).test('select next tab using right arrow', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  const [ tab1, tab2, tab3 ] = el.querySelectorAll('[role=tab]');
  tab1.focus();
  keydown(tab1, { key: 'ArrowRight' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  keydown(tab2, { key: 'ArrowRight' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' }
    ],
    t
  );
  keydown(tab3, { key: 'ArrowRight' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
}).test('select next tab using down arrow', function*(t) {
  const el = createTablist();
  const tabList$$1 = factory$1({ el });

  const [ tab1, tab2, tab3 ] = el.querySelectorAll('[role=tab]');
  tab1.focus();
  keydown(tab1, { key: 'ArrowDown' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
  keydown(tab2, { key: 'ArrowDown' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'true', 'tabindex': '0' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'false' }
    ],
    t
  );
  keydown(tab3, { key: 'ArrowDown' });
  testTab$1(
    tabList$$1.el,
    [
      { 'aria-selected': 'true', 'tabindex': '0' },
      { 'aria-selected': 'false', 'tabindex': '-1' },
      { 'aria-selected': 'false', 'tabindex': '-1' }
    ],
    t
  );
  testTabPanels$1(
    tabList$$1.el,
    [
      { 'aria-hidden': 'false' },
      { 'aria-hidden': 'true' },
      { 'aria-hidden': 'true' }
    ],
    t
  );
});

const mandatoryElement$2 = element();
const menuElement = ariaElement({ariaRole: 'menu'});

const abstractMenuItem = compose(
  ariaElement({ariaRole: 'menuitem'}),
  listItem,
  observable$1('isSelected'),
  init(function () {
    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected === true) {
        this.el.focus();
      }
    });
  })
);

const menuItemEvenBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'ArrowLeft' || k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowRight' || k === 'ArrowDown') {
      this.selectNext();
      event.preventDefault();
    }
  });
});

const menuItemStamp = compose(abstractMenuItem, menuItemEvenBinding);

const subMenuItemEventBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowDown') {
      this.selectNext();
      event.preventDefault();
    }
  });
});

const subMenuItemStamp = compose(abstractMenuItem, subMenuItemEventBinding);

const menuEventBinding = init(function () {
  this.toggler.addEventListener('click', () => {
    this.toggle();
  });
  this.toggler.addEventListener('keydown', event => {
    const {key: k, code} = event;
    const toggle$$1 = ev => {
      this.toggle();
      ev.preventDefault();
    };
    if (k === 'Enter' || code === 'Space') {
      toggle$$1(event);
    } else if (k === 'ArrowDown' && !this.isOpen) {
      toggle$$1(event);
    } else if (k === 'ArrowUp' && this.isOpen) {
      toggle$$1(event);
    }
  });

  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'Escape' && this.isOpen) {
      this.toggle();
      this.toggler.focus();
    } else if (k == 'Tab') {
      if (this.el.querySelector(':focus') !== null && this.isOpen) {
        this.toggle();
      }
    }
  });
});

const subMenuEventBinding = init(function () {
  const next = ev => {
    this.selectNext();
    if (this.isOpen) {
      this.toggle();
    }
    ev.preventDefault();
  };

  const previous = ev => {
    this.selectPrevious();
    if (this.isOpen) {
      this.toggle();
    }
    ev.preventDefault();
  };

  this.toggler.addEventListener('click', () => {
    this.toggle();
  });
  this.toggler.addEventListener('keydown', event => {
    const {key: k, code, target} = event;
    if ((k === 'Enter' || code === 'Space') && target === this.toggler) {
      this.toggle();
    } else if (k === 'ArrowRight') {
      next(event);
    } else if (k === 'ArrowLeft') {
      previous(event);
    } else if (k === 'ArrowDown' && target === this.toggler) {
      if (!this.isOpen) {
        this.toggle();
      } else {
        this.selectNext();
      }
    } else if (k === 'ArrowUp' && target === this.toggler) {
      if (this.isOpen) {
        this.toggle();
      } else {
        this.selectPrevious();
      }
    }

    if (
      ['ArrowDown', 'ArrowUp', 'Enter'].indexOf(k) !== -1 || code === 'Space'
    ) {
      event.preventDefault();
    }
  });

  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'ArrowRight') {
      next(event);
    } else if (k === 'ArrowLeft') {
      previous(event);
    } else if (k === 'Escape' && this.isOpen) {
      this.toggle();
      if (k === 'Escape') {
        this.toggler.focus();
      }
    } else if (k == 'Tab') {
      if (this.el.querySelector(':focus') !== null && this.isOpen) {
        this.toggle();
      }
    }
  });
});

function menuInitStamp ({menuItem = menuItemStamp} = {}) {
  return init(function () {
    const menu = menuElement({
      el: this.el.querySelector('[role=menu]') || this.el
    });
    const toggler = this.el.querySelector('[aria-haspopup]') || this.el;

    Object.defineProperty(this, 'toggler', {value: toggler});
    Object.defineProperty(this, 'menu', {value: menu});

    for (const el of this.menu.el.querySelectorAll('[role="menuitem"]')) {
      menuItem({listMediator: this, el});
    }

    this.$on('isOpen', isOpen => {
      this.toggler.setAttribute('aria-expanded', isOpen);
      this.menu.el.setAttribute('aria-hidden', !isOpen);
      if (isOpen && this.items.length) {
        this.selectItem(this.items[0]);
      }
    });
    this.$on('isSelected', isSelected => {
      this.toggler.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected) {
        this.toggler.focus();
      }
    });
    this.isOpen = !!this.toggler.getAttribute('aria-expanded');
  });
}

const abstractMenuStamp = compose(
  mandatoryElement$2,
  listMediator,
  toggle$1(),
  observable$1('isOpen')
);

function dropdown ({menuItem = menuItemStamp} = {}) {
  return compose(
    abstractMenuStamp,
    menuInitStamp({menuItem}),
    menuEventBinding
  );
}

function subMenu ({menuItem = subMenuItemStamp} = {}) {
  return compose(
    listItem,
    abstractMenuStamp,
    observable$1('isSelected'),
    menuInitStamp({menuItem}),
    subMenuEventBinding
  );
}

const subMenuStamp = subMenu({menuItem: subMenuItemStamp});

function menubar ({menuItem = menuItemStamp, subMenu = subMenuStamp} = {}) {
  return compose(
    ariaElement({ariaRole: 'menubar'}),
    listMediator,
    init(function () {
      for (const item of findChildrenMenuItem(this.el)) {
        if (item.querySelector('[role=menu]') !== null) {
          subMenu({el: item, listMediator: this});
        } else {
          menuItem({listMediator: this, el: item});
        }
      }
    })
  );
}






function expandable () {
  return compose(
    element(),
    toggle$1(),
    observable$1('isOpen'),
    init(function () {
      const toggler = this.el.querySelector('[aria-haspopup=true]');
      const controlledId = toggler.getAttribute('aria-controls');
      const section = this.el.querySelector(`#${controlledId}`);
      Object.defineProperty(this, 'section', {value: section});
      Object.defineProperty(this, 'toggler', {value: toggler});

      this.$on('isOpen', isOpen => {
        this.section.setAttribute('aria-hidden', !isOpen);
        this.toggler.setAttribute('aria-expanded', isOpen);
      });

      this.isOpen = Boolean(this.toggler.getAttribute('aria-expanded'));

    }),
    menuEventBinding
  );
}
function findChildrenMenuItem (base) {
  const items = [];
  for (const c of base.children) {
    const role = c.getAttribute('role');
    if (role === 'menu') {
      continue;
    }
    if (role === 'menuitem') {
      items.push(c);
    } else {
      items.push(...findChildrenMenuItem(c));
    }
  }
  return items;
}

const factory$2 = expandable();

function createExpandableSection () {
  const container = document.createElement('DIV');
  container.innerHTML = `
  <button id="toggler" type="button" aria-haspopup="true" aria-controls="expandable">Expand</button>
  <div id="expandable"></div>
`;
  return container;
}

var exp = zora()
  .test('expandable init states', function * (t) {
    const el = createExpandableSection();
    const comp = factory$2({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
  })
  .test('expand section on click', function * (t) {
    const el = createExpandableSection();
    const comp = factory$2({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('expand on keydown arrow down', function * (t) {
    const el = createExpandableSection();
    const comp = factory$2({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('close on click', function * (t) {
    const el = createExpandableSection();
    const comp = factory$2({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  })
  .test('close on arrow up', function * (t) {
    const el = createExpandableSection();
    const comp = factory$2({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  });

const factory$3 = dropdown();

function createDropdown () {
  const container = document.createElement('DIV');
  container.innerHTML = `
      <button aria-controls="menu-sample" type="button" aria-haspopup="true">Actions</button>
      <ul id="menu-sample" role="menu">
        <li role="menuitem">action 1</li>
        <li role="menuitem">action 2</li>
        <li role="menuitem">action 3</li>
      </ul>
    `;
  return container;
}

function testMenuItems (dropdown$$1, expected, t) {
  const tabs = dropdown$$1.querySelectorAll('[role=menuitem]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `menuitem[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


var dropdown$1 = zora()
  .test('dropdown: init states', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open on click', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close on click', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open menu on arrow down', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Enter', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'Enter'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Space', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {code: 'Space'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on arrow up', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: select previous item with left arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowLeft'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowLeft'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select previous item with up arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowUp'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowUp'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with right arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with down arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on escape keydown', function * (t) {
    const el = createDropdown();
    const dropDown = factory$3({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1,{key:'Escape'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  });

const factory$4 = menubar();

function createMenubar () {
  const menuBar = document.createElement('UL');
  menuBar.setAttribute('role', 'menubar');
  menuBar.innerHTML = `
        <li role="menuitem">
          <button id="b1" type="button" aria-haspopup="true" tabindex="0" aria-controls="submenu1">Menu 1</button>
          <ul id="submenu1" aria-labelledby="b1" role="menu">
            <li role="menuitem">sub action 1.1</li>
            <li role="menuitem">sub action 1.2</li>
            <li role="menuitem">sub action 1.3</li>
            <li role="menuitem">sub action 1.4</li>
          </ul>
        </li>
        <li role="menuitem">
          <button id="b2" type="button" aria-haspopup="true" tabindex="-1" aria-controls="submenu2">Menu 2</button>
          <ul id="submenu2" aria-labelledby="b2" role="menu">
            <li role="menuitem">sub action 2.1</li>
            <li role="menuitem">sub action 2.2</li>
            <li role="menuitem">sub action 2.3</li>
          </ul>
        </li>
        <li role="menuitem"><span>Some single action</span></li>
        <li role="menuitem">
          <button id="b4" type="button" aria-haspopup="true" tabindex="-1" aria-controls="submenu4">Menu 3</button>
          <ul id="submenu4" aria-labelledby="b4" role="menu">
            <li role="menuitem">sub action 4.1</li>
            <li role="menuitem">sub action 4.2</li>
          </ul>
        </li>
`;
  return menuBar;
}


var menubar$1 = zora()
  .test('menubars: init states', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu on click', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    const items = m2.querySelectorAll('li[role=menuitem]');
    click(b2);
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with keydown', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Enter', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'Enter'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Space', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    keydown(b2, {code: 'Space'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: navigate to next menu with right arrow', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    keydown(b1,{key:'ArrowRight'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '0');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    keydown(b3,{key:'ArrowRight'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: select previous menu item with left arrow',function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    keydown(b1,{key:'ArrowLeft'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '0');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    keydown(b2,{key:'ArrowLeft'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('submenu: select previous menu item using up arrow', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    //open menu
    keydown(b1,{key:'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1,si2,si3,si4] = m1.querySelectorAll('[role=menuitem]');
    t.equal(si1.getAttribute('tabindex'),'0');
    t.equal(si2.getAttribute('tabindex'),'-1');
    t.equal(si3.getAttribute('tabindex'),'-1');
    t.equal(si4.getAttribute('tabindex'),'-1');
    keydown(si1,{key:'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'),'-1');
    t.equal(si2.getAttribute('tabindex'),'-1');
    t.equal(si3.getAttribute('tabindex'),'-1');
    t.equal(si4.getAttribute('tabindex'),'0');
    keydown(si4,{key:'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'),'-1');
    t.equal(si2.getAttribute('tabindex'),'-1');
    t.equal(si3.getAttribute('tabindex'),'0');
    t.equal(si4.getAttribute('tabindex'),'-1');
  })
  .test('submenu: select next menu item using down arrow', function * (t) {
    const el = createMenubar();
    const mb = factory$4({el});
    const [b1, b2, b3] = el.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = el.querySelectorAll('ul[role=menu]');
    //open menu
    keydown(b1,{key:'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1,si2,si3,si4] = m1.querySelectorAll('[role=menuitem]');
    t.equal(si1.getAttribute('tabindex'),'0');
    t.equal(si2.getAttribute('tabindex'),'-1');
    t.equal(si3.getAttribute('tabindex'),'-1');
    t.equal(si4.getAttribute('tabindex'),'-1');
    keydown(si1,{key:'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'),'-1');
    t.equal(si2.getAttribute('tabindex'),'0');
    t.equal(si3.getAttribute('tabindex'),'-1');
    t.equal(si4.getAttribute('tabindex'),'-1');
    keydown(si4,{key:'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'),'0');
    t.equal(si2.getAttribute('tabindex'),'-1');
    t.equal(si3.getAttribute('tabindex'),'-1');
    t.equal(si4.getAttribute('tabindex'),'-1');
  })
;

const tooltipEventBindingStamp = init(function tooltipEventBinding () {
  this.target.addEventListener('focus', this.show.bind(this));
  this.target.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'Escape') {
      this.hide();
    }
  });
  this.target.addEventListener('blur', this.hide.bind(this));
  this.target.addEventListener('mouseenter', this.show.bind(this));
  this.target.addEventListener('mouseleave', this.hide.bind(this));
});

function tooltip$1 () {
  return compose(
    ariaElement({ariaRole: 'tooltip'}),
    observable$1('isOpen'),
    methods({
      hide() {
        if (this.el.parentNode !== null) {
          this.el.remove();
        }
        this.isOpen = false;
      },
      show() {
        if (this.el.parentNode === null) {
          //always reuse the same element
          this.target.insertAdjacentElement('afterend', this.el);
        }
        this.isOpen = true;
      }
    }),
    init(function initializeTooltip () {
      const id = this.el.getAttribute('id');
      if (!id) {
        console.log(this.el);
        throw new Error('the above tooltip element must have an id');
      }
      const targetElement = document.querySelector(`[aria-describedby=${id}]`);
      if (!targetElement) {
        console.warn(
          'there is no target element described by the tooltip ' + id
        );
      }
      Object.defineProperty(this, 'target', {value: targetElement});
      this.hide();
    }),
    tooltipEventBindingStamp
  );
}

const factory$5 = tooltip$1();

function createContent () {
  document.body = document.body || document.createElement('body');
  const contentString = `<div id="container">
      <a aria-describedby="tooltip" href="#"> some link</a>
      <p role="tooltip" id="tooltip">I am the tooltip</p>
    </div>`;
  document.body.innerHTML = contentString;
}

var tooltip$$1 = zora()
  .test('tooltip: hide by default', function* (t) {
    createContent();
    const tt = factory$5({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
  })
  .test('tooltip: show tooltip', function* (t) {
    createContent();
    const tt = factory$5({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
    tt.show();
    t.equal(document.getElementById('tooltip'), tt.el);
  })
  .test('tooltip hide tooltip', function * (t) {
    createContent();
    const tt = factory$5({el: document.getElementById('tooltip')});
    t.equal(document.getElementById('tooltip'),null);
    tt.show();
    t.equal(document.getElementById('tooltip'), tt.el);
    tt.hide();
    t.equal(document.getElementById('tooltip'), null);
  });

var components = zora()
  .test(tabs)
  .test(accordions)
  .test(exp)
  .test(dropdown$1)
  .test(menubar$1)
  .test(tooltip$$1);

zora().test(behaviours).test(components).run();

}());
//# sourceMappingURL=index.js.map
