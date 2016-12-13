'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var stampit_full$1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  function isObject(obj) {
    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    return !!obj && (type === 'object' || type === 'function');
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  var concat = Array.prototype.concat;
  var extractFunctions = function extractFunctions() {
    var fns = concat.apply([], arguments).filter(isFunction);
    return fns.length === 0 ? undefined : fns;
  };

  function isPlainObject(value) {
    return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && Object.getPrototypeOf(value) === Object.prototype;
  }

  /**
   * The 'src' argument plays the command role.
   * The returned values is always of the same type as the 'src'.
   * @param dst
   * @param src
   * @returns {*}
   */
  function mergeOne(dst, src) {
    if (src === undefined) {
      return dst;
    }

    // According to specification arrays must be concatenated.
    // Also, the '.concat' creates a new array instance. Overrides the 'dst'.
    if (Array.isArray(src)) {
      return (Array.isArray(dst) ? dst : []).concat(src);
    }

    // Now deal with non plain 'src' object. 'src' overrides 'dst'
    // Note that functions are also assigned! We do not deep merge functions.
    if (!isPlainObject(src)) {
      return src;
    }

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
        var newDst = isPlainObject(dstValue) || Array.isArray(srcValue) ? dstValue : {};

        // deep merge each property. Recursion!
        returnValue[key] = mergeOne(newDst, srcValue);
      }
    }

    return returnValue;
  }

  var merge = function merge(dst) {
    var srcs = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      srcs[len] = arguments[len + 1];
    }return srcs.reduce(mergeOne, dst);
  };

  var assign$1 = Object.assign;

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
   * @returns {Descriptor}
   */
  var standardiseDescriptor = function standardiseDescriptor(ref) {
    if (ref === void 0) ref = {};
    var methods = ref.methods;
    var properties = ref.properties;
    var props = ref.props;
    var refs = ref.refs;
    var initializers = ref.initializers;
    var init = ref.init;
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

    var p = isObject(props) || isObject(refs) || isObject(properties) ? assign$1({}, props, refs, properties) : undefined;

    var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
    dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

    var sp = isObject(statics) || isObject(staticProperties) ? assign$1({}, statics, staticProperties) : undefined;

    var dsp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
    dsp = isObject(staticDeepProperties) ? merge(dsp, staticDeepProperties) : dsp;

    var c = isObject(conf) || isObject(configuration) ? assign$1({}, conf, configuration) : undefined;

    var dc = isObject(deepConf) ? merge({}, deepConf) : undefined;
    dc = isObject(deepConfiguration) ? merge(dc, deepConfiguration) : dc;

    return {
      methods: methods,
      properties: p,
      initializers: extractFunctions(init, initializers),
      deepProperties: dp,
      staticProperties: sp,
      staticDeepProperties: dsp,
      propertyDescriptors: propertyDescriptors,
      staticPropertyDescriptors: staticPropertyDescriptors,
      configuration: c,
      deepConfiguration: dc
    };
  };

  var assign$2 = Object.assign;

  /**
   * Creates new factory instance.
   * @param {Descriptor} descriptor The information about the object the factory will be creating.
   * @returns {Function} The new factory function.
   */
  function createFactory(descriptor) {
    return function Stamp(options) {
      var args = [],
          len = arguments.length - 1;
      while (len-- > 0) {
        args[len] = arguments[len + 1];
      } // Next line was optimized for most JS VMs. Please, be careful here!
      var obj = Object.create(descriptor.methods || null);

      merge(obj, descriptor.deepProperties);
      assign$2(obj, descriptor.properties);
      Object.defineProperties(obj, descriptor.propertyDescriptors || {});

      if (!descriptor.initializers || descriptor.initializers.length === 0) {
        return obj;
      }

      if (options === undefined) {
        options = {};
      }
      return descriptor.initializers.filter(isFunction).reduce(function (resultingObj, initializer) {
        var returnedValue = initializer.call(resultingObj, options, { instance: resultingObj, stamp: Stamp, args: [options].concat(args) });
        return returnedValue === undefined ? resultingObj : returnedValue;
      }, obj);
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
    assign$2(Stamp, descriptor.staticProperties);
    Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

    var composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
    Stamp.compose = function _compose() {
      var args = [],
          len = arguments.length;
      while (len--) {
        args[len] = arguments[len];
      }return composeImplementation.apply(this, args);
    };
    assign$2(Stamp.compose, descriptor);

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
    var srcDescriptor = srcComposable && srcComposable.compose || srcComposable;
    if (!isObject(srcDescriptor)) {
      return dstDescriptor;
    }

    var combineProperty = function combineProperty(propName, action) {
      if (!isObject(srcDescriptor[propName])) {
        return;
      }
      if (!isObject(dstDescriptor[propName])) {
        dstDescriptor[propName] = {};
      }
      action(dstDescriptor[propName], srcDescriptor[propName]);
    };

    combineProperty('methods', assign$2);
    combineProperty('properties', assign$2);
    combineProperty('deepProperties', merge);
    combineProperty('propertyDescriptors', assign$2);
    combineProperty('staticProperties', assign$2);
    combineProperty('staticDeepProperties', merge);
    combineProperty('staticPropertyDescriptors', assign$2);
    combineProperty('configuration', assign$2);
    combineProperty('deepConfiguration', merge);
    if (Array.isArray(srcDescriptor.initializers)) {
      dstDescriptor.initializers = srcDescriptor.initializers.reduce(function (result, init) {
        if (isFunction(init) && result.indexOf(init) < 0) {
          result.push(init);
        }
        return result;
      }, Array.isArray(dstDescriptor.initializers) ? dstDescriptor.initializers : []);
    }

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
    var composables = [],
        len = arguments.length;
    while (len--) {
      composables[len] = arguments[len];
    }var descriptor = [this].concat(composables).filter(isObject).reduce(mergeComposable, {});
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

  var assign = Object.assign;

  function createUtilityFunction(propName, action) {
    return function composeUtil() {
      var i = arguments.length,
          argsArray = Array(i);
      while (i--) {
        argsArray[i] = arguments[i];
      }var descriptor = {};
      descriptor[propName] = action.apply(void 0, [{}].concat(argsArray));
      return (this && this.compose || stampit).call(this, descriptor);
    };
  }

  var methods = createUtilityFunction('methods', assign);

  var properties = createUtilityFunction('properties', assign);
  function initializers() {
    var args = [],
        len = arguments.length;
    while (len--) {
      args[len] = arguments[len];
    }return (this && this.compose || stampit).call(this, {
      initializers: extractFunctions.apply(void 0, args)
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
  var baseStampit = compose({ staticProperties: allUtilities }, {
    staticProperties: {
      create: function create() {
        var args = [],
            len = arguments.length;
        while (len--) {
          args[len] = arguments[len];
        }return this.apply(void 0, args);
      },
      compose: stampit // infecting
    }
  });

  /**
   * Infected compose
   * @param {...(Composable)} [args] The list of composables.
   * @return {Stamp}
   */
  function stampit() {
    var args = [],
        len = arguments.length;
    while (len--) {
      args[len] = arguments[len];
    }args = args.filter(isObject).map(function (arg) {
      return isStamp(arg) ? arg : standardiseDescriptor(arg);
    });

    // Calling the standard pure compose function here.
    return compose.apply(this || baseStampit, args);
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

function element() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { propertyName: 'el' },
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'el' : _ref$propertyName;

  return init(function assertElement() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var el = opts[propertyName];
    if (!el) {
      throw new Error('You must provide a dom element as "' + propertyName + '" property');
    }
    Object.defineProperty(this, propertyName, { value: el });
  });
}

function test$1(tape) {

  tape('throw an error if element argument is not provided', function (t) {
    try {
      var elStamp = element();
      var comp = elStamp();
      t.end(new Error('should have thrown'));
    } catch (e) {
      t.equal(e.message, 'You must provide a dom element as "el" property');
      t.end();
    }
  });

  tape('should set the readonly prop "el" on the instance', function (t) {
    try {
      var elStamp = element();
      var domEl = 'dom element';
      var comp = elStamp({ el: domEl });
      t.equal(comp.el, domEl);
      comp.el = 'foo';
    } catch (e) {
      t.end();
    }
  });

  tape('should be able to rename the property', function (t) {
    try {
      var elStamp = element({ propertyName: 'foo' });
      var domEl = 'dom element';
      var comp = elStamp({ foo: domEl });
      t.equal(comp.foo, domEl);
      comp.foo = 'foo';
    } catch (e) {
      t.end();
    }
  });
}

function observable() {
  for (var _len = arguments.length, properties$$1 = Array(_len), _key = 0; _key < _len; _key++) {
    properties$$1[_key] = arguments[_key];
  }

  return init(function () {
    var _this = this;

    var listeners = {};

    if (!this.$onChange || !this.$on) {
      this.$onChange = function (prop, newVal) {
        var ls = listeners[prop] || [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = ls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cb = _step.value;

            cb(newVal);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return _this;
      };

      this.$on = function (property, cb) {
        var listenersList = listeners[property] || [];
        listenersList.push(cb);
        listeners[property] = listenersList;
        return _this;
      };
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      var _loop = function _loop() {
        var prop = _step2.value;

        var value = _this[prop];
        Object.defineProperty(_this, prop, {
          get: function get() {
            return value;
          },
          set: function set(val) {
            var isDifferent = val !== value;
            value = val;
            if (isDifferent) {
              this.$onChange(prop, val);
            }
          }
        });
      };

      for (var _iterator2 = properties$$1[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
}

var mandatoryEl = element();

function mapToAria(prop) {
  for (var _len2 = arguments.length, attributes = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    attributes[_key2 - 1] = arguments[_key2];
  }

  var ariaAttributes = attributes.map(function (attr) {
    var isNot = /^\!/.test(attr);
    var att = isNot ? attr.substr(1) : attr;
    var fn = isNot ? function (v) {
      return !v;
    } : function (v) {
      return v;
    };
    return { attr: ['aria', att].join('-'), fn: fn };
  });
  return compose(mandatoryEl, observable(prop), init(function () {
    var _this2 = this;

    this.$on(prop, function (newVal) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = ariaAttributes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var att = _step3.value;

          _this2.el.setAttribute(att.attr, att.fn(newVal));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    });
  }));
}

function test$2(tape) {

  function mockElement() {
    return {
      setAttribute: function setAttribute(attr, val) {
        this[attr] = val;
      }
    };
  }

  tape('observe a property and get notified with the new value', function (t) {
    var obsStamp = observable('myProp');
    var comp = obsStamp();
    comp.$on('myProp', function (myProp) {
      t.equal(myProp, 'foo');
      t.end();
    });
    comp.myProp = 'foo';
  });

  tape('do not get notified if the value remains the same', function (t) {
    t.plan(1);
    var obsStamp = observable('myProp');
    var comp = obsStamp();
    comp.$on('myProp', function (myProp) {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
    comp.myProp = 'foo';
  });

  tape('manually emit a change event', function (t) {
    var obsStamp = observable('myProp');
    var comp = obsStamp();
    comp.$on('myProp', function (myProp) {
      t.equal(myProp, 'bar');
      t.end();
    });
    comp.$onChange('myProp', 'bar');
  });

  tape('use arrity n api', function (t) {
    t.plan(2);
    var obsStamp = observable('myProp', 'myPropBis');
    var obs = obsStamp();
    obs.$on('myProp', function (myProp) {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', function (myPropBis) {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  });

  tape('compose multiple times with observable', function (t) {
    t.plan(2);
    var obsStamp = compose(observable('myProp'), observable('myPropBis'));
    var obs = obsStamp();
    obs.$on('myProp', function (myProp) {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', function (myPropBis) {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  });

  tape('have multiple listeners', function (t) {
    t.plan(2);
    var obsStamp = observable('myProp');
    var comp = obsStamp();
    comp.$on('myProp', function (myProp) {
      t.equal(myProp, 'foo');
    });
    comp.$on('myProp', function (myProp) {
      t.ok(true);
    });
    comp.myProp = 'foo';
  });

  tape('map a property to aria attribute', function (t) {
    var stamp = mapToAria('foo', 'bar');
    var inst = stamp({ el: mockElement() });
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.end();
  });

  tape('map a property to aria attribute negating the value', function (t) {
    var stamp = mapToAria('foo', '!bar');
    var inst = stamp({ el: mockElement() });
    inst.foo = true;
    t.equal(inst.el['aria-bar'], false);
    t.end();
  });

  tape('use arrity n api', function (t) {
    var stamp = mapToAria('foo', 'bar', '!blah', 'woot');
    var inst = stamp({ el: mockElement() });
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-blah'], false);
    t.equal(inst.el['aria-woot'], true);
    t.end();
  });

  tape('should compose multiple times mapToAria', function (t) {
    var stamp = compose(mapToAria('foo', 'bar'), mapToAria('blah', 'woot'));
    var inst = stamp({ el: mockElement() });
    inst.foo = true;
    inst.blah = false;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-woot'], false);
    t.end();
  });
}

function toggle$1() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'isOpen';

  return methods({
    toggle: function toggle$1() {
      this[prop] = !this[prop];
    }
  });
}

function test$3(tape) {
  tape('toggle "isOpen" by default', function (t) {
    var stamp = toggle$1();
    var inst = stamp();
    inst.isOpen = true;
    inst.toggle();
    t.equal(inst.isOpen, false);
    t.end();
  });

  tape('toggle a given property', function (t) {
    var stamp = toggle$1('foo');
    var inst = stamp();
    inst.foo = false;
    inst.toggle();
    t.equal(inst.foo, true);
    t.end();
  });
}

var abstractListMediatorStamp = init(function (_ref) {
  var _ref$items = _ref.items,
      items = _ref$items === undefined ? [] : _ref$items;

  Object.defineProperty(this, 'items', { value: items });
}).methods({
  addItem: function addItem(item) {
    this.items.push(item);
  },
  selectItem: function selectItem(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          i.isSelected = i === item;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  },
  selectNextItem: function selectNextItem(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      var newIndex = index === this.items.length - 1 ? 0 : index + 1;
      this.selectItem(this.items[newIndex]);
    }
  },
  selectPreviousItem: function selectPreviousItem(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      var newIndex = index === 0 ? this.items.length - 1 : index - 1;
      this.selectItem(this.items[newIndex]);
    }
  }
});

var listItemStamp = init(function (_ref2) {
  var listMediator = _ref2.listMediator,
      isOpen = _ref2.isOpen;

  if (!listMediator) {
    throw new Error('you must provide a listMediator to the listItem');
  }
  this.isOpen = this.isOpen ? this.isOpen : isOpen === true;
  Object.defineProperty(this, 'listMediator', { value: listMediator });
  listMediator.addItem(this);
}).methods({
  toggle: function toggle() {
    this.listMediator.toggleItem(this);
  },
  select: function select() {
    this.listMediator.selectItem(this);
  },
  selectPrevious: function selectPrevious() {
    this.listMediator.selectPreviousItem(this);
  },
  selectNext: function selectNext() {
    this.listMediator.selectNextItem(this);
  }
});

var multiSelectMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem: function toggleItem(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      item.isOpen = !item.isOpen;
    }
  }
}));

var listMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem: function toggleItem(item) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var i = _step2.value;

        i.isOpen = i === item ? !i.isOpen : false;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return this;
  }
}));

function test$4(tape) {
  tape('list mediator: add item', function (t) {
    var instance = listMediatorStamp();
    t.equal(instance.items.length, 0);
    var item = {};
    instance.addItem(item);
    t.deepEqual(instance.items, [item]);
    t.end();
  });

  tape('list mediator: open an item and close all others', function (t) {
    var instance = listMediatorStamp();
    var item = { isOpen: false };
    var item2 = { isOpen: false };
    var item3 = { isOpen: true };
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

    t.end();
  });

  tape('select an item and unselect the others', function (t) {
    var instance = listMediatorStamp();
    var item = { isSelected: false };
    var item2 = { isSelected: false };
    var item3 = { isSelected: true };
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.selectItem(item2);
    t.equal(item.isSelected, false);
    t.equal(item2.isSelected, true);
    t.equal(item3.isSelected, false);
    t.end();
  });

  tape('select the next item or loop back to the first', function (t) {
    var instance = listMediatorStamp();
    var item = { isSelected: false };
    var item2 = { isSelected: true };
    var item3 = { isSelected: false };
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

    t.end();
  });

  tape('select the previous item or loop back to the last', function (t) {
    var instance = listMediatorStamp();
    var item = { isSelected: false };
    var item2 = { isSelected: true };
    var item3 = { isSelected: false };
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

    t.end();
  });

  tape('multiselect list mediator: toggle any item', function (t) {
    var instance = multiSelectMediatorStamp();
    var item = { isOpen: false };
    var item2 = { isOpen: false };
    var item3 = { isOpen: true };
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.toggleItem(item);

    t.equal(item.isOpen, true);
    t.equal(item2.isOpen, false);
    t.equal(item3.isOpen, true);
    t.end();
  });
}

function test$$1(tape) {
  test$1(tape);
  test$2(tape);
  test$3(tape);
  test$4(tape);
}

exports.test = test$$1;
