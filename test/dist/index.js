(function () {
'use strict';

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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var keys = createCommonjsModule(function (module, exports) {
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
});

var is_arguments = createCommonjsModule(function (module, exports) {
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

var index$1 = createCommonjsModule(function (module) {
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
  ok(val, message = 'should be truthy') {
    const assertionResult = {
      pass: Boolean(val),
      expected: 'truthy',
      actual: val,
      operator: 'ok',
      message
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  deepEqual(actual, expected, message = 'should be equivalent') {
    const assertionResult = {
      pass: index$1(actual, expected),
      actual,
      expected,
      message,
      operator: 'deepEqual'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  equal(actual, expected, message = 'should be equal') {
    const assertionResult = {
      pass: actual === expected,
      actual,
      expected,
      message,
      operator: 'equal'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notOk(val, message = 'should not be truthy') {
    const assertionResult = {
      pass: !Boolean(val),
      expected: 'falsy',
      actual: val,
      operator: 'notOk',
      message
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notDeepEqual(actual, expected, message = 'should not be equivalent') {
    const assertionResult = {
      pass: !index$1(actual, expected),
      actual,
      expected,
      message,
      operator: 'notDeepEqual'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  notEqual(actual, expected, message = 'should not be equal') {
    const assertionResult = {
      pass: actual !== expected,
      actual,
      expected,
      message,
      operator: 'notEqual'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  throws(func, expected, message) {
    let caught, pass, actual;
    if (typeof expected === 'string') {
      [expected, message] = [message, expected];
    }
    try {
      func();
    } catch (error) {
      caught = {error};
    }
    pass = caught !== undefined;
    actual = caught && caught.error;
    if (expected instanceof RegExp) {
      pass = expected.test(actual) || expected.test(actual && actual.message);
      expected = String(expected);
    } else if (typeof expected === 'function' && caught) {
      pass = actual instanceof expected;
      actual = actual.constructor;
    }
    const assertionResult = {
      pass,
      expected,
      actual,
      operator: 'throws',
      message: message || 'should throw'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  doesNotThrow(func, expected, message) {
    let caught;
    if (typeof expected === 'string') {
      [expected, message] = [message, expected];
    }
    try {
      func();
    } catch (error) {
      caught = {error};
    }
    const assertionResult = {
      pass: caught === undefined,
      expected: 'no thrown error',
      actual: caught && caught.error,
      operator: 'doesNotThrow',
      message: message || 'should not throw'
    };
    this.test.addAssertion(assertionResult);
    return assertionResult;
  },
  fail(reason = 'fail called') {
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

function plan$1 () {
  return Object.create(Plan, {
    tests: {value: []},
    length: {
      get(){
        return this.tests.length
      }
    }
  });
}

function emitter () {

  const listenersLists = {};
  const instance = {
    on(event, ...listeners){
      listenersLists[event] = (listenersLists[event] || []).concat(listeners);
      return instance;
    },
    dispatch(event, ...args){
      const listeners = listenersLists[event] || [];
      for (let listener of listeners) {
        listener(...args);
      }
      return instance;
    },
    off(event, ...listeners){
      if (!event) {
        Object.keys(listenersLists).forEach(ev => instance.off(ev));
      } else {
        const list = listenersLists[event] || [];
        listenersLists[event] = listeners.length ? list.filter(listener => !listeners.includes(listener)) : [];
      }
      return instance;
    }
  };
  return instance;
}

function proxyListener$1 (eventMap) {
  return function ({emitter}) {

    const proxy = {};
    let eventListeners = {};

    for (let ev of Object.keys(eventMap)) {
      const method = eventMap[ev];
      eventListeners[ev] = [];
      proxy[method] = function (...listeners) {
        eventListeners[ev] = eventListeners[ev].concat(listeners);
        emitter.on(ev, ...listeners);
        return proxy;
      };
    }

    return Object.assign(proxy, {
      off(ev){
        if (!ev) {
          Object.keys(eventListeners).forEach(eventName => proxy.off(eventName));
        }
        if (eventListeners[ev]) {
          emitter.off(ev, ...eventListeners[ev]);
        }
        return proxy;
      }
    });
  }
}

var events = Object.freeze({
	emitter: emitter,
	proxyListener: proxyListener$1
});

const {proxyListener: proxyListener$2, emitter:createEmitter$1} =events;

const DOM_CLICK = 'DOM_CLICK';
const DOM_KEYDOWN = 'DOM_KEYDOWN';
const DOM_FOCUS = 'DOM_FOCUS';

const domListener = proxyListener$2({
  [DOM_CLICK]: 'onclick',
  [DOM_KEYDOWN]: 'onkeydown',
  [DOM_FOCUS]: 'onfocus'
});

var elementFactory = ({element, emitter: emitter$$1 = createEmitter$1()}) => {

  if (!element) {
    throw new Error('a dom element must be provided');
  }

  const domListenerHandler = (eventName) => (ev) => emitter$$1.dispatch(eventName, ev);

  const listener = domListener({emitter: emitter$$1});
  const clickListener = domListenerHandler(DOM_CLICK);
  const keydownListener = domListenerHandler(DOM_KEYDOWN);
  const focusListener = domListenerHandler(DOM_FOCUS);

  const api = {
    element(){
      return element;
    },
    attr(attributeName, value){
      if (value === void 0) {
        return element.getAttribute(attributeName);
      } else {
        element.setAttribute(attributeName, value);
      }
    },
    addClass(...classNames){
      element.classList.add(...classNames);
    },
    removeClass(...classNames){
      element.classList.remove(...classNames);
    },
    clean(){
      element.removeEventListener('click', clickListener);
      element.removeEventListener('keydown', keydownListener);
      element.removeEventListener('focus', focusListener);
      listener.off(DOM_CLICK);
      listener.off(DOM_KEYDOWN);
      listener.off(DOM_FOCUS);
    }
  };

  element.addEventListener('click', clickListener);
  element.addEventListener('keydown', keydownListener);
  element.addEventListener('focus', focusListener);

  return Object.assign(listener, api);
};

const key = ev => ({key: ev.key, keyCode: ev.keyCode, code: ev.code});
const checkKey = (keyName, keyCode) => ev => {
  const k = key(ev);
  return k.key ? k.key === keyName : k.keyCode === keyCode;
};

const isArrowLeft = checkKey('ArrowLeft', 37);
const isArrowUp = checkKey('ArrowUp', 38);
const isArrowRight = checkKey('ArrowRight', 39);
const isArrowDown = checkKey('ArrowDown', 40);
const isEscape = checkKey('Escape', 27);
const isEnter = checkKey('Enter', 13);
const isSpace = ev => {
  const k = key(ev);
  return k.code ? k.code === 'Space' : k.keyCode === 32;
};

var checkKeys = Object.freeze({
	isArrowLeft: isArrowLeft,
	isArrowUp: isArrowUp,
	isArrowRight: isArrowRight,
	isArrowDown: isArrowDown,
	isEscape: isEscape,
	isEnter: isEnter,
	isSpace: isSpace
});

const {proxyListener, emitter:createEmitter} = events;

const EXPANDED_CHANGED = 'EXPANDED_CHANGED';
const proxy = proxyListener({[EXPANDED_CHANGED]: 'onExpandedChange'});

const expandableFactory = ({emitter: emitter$$1 = createEmitter(), expanded}) => {
  const state = {expanded};
  const dispatch = () => emitter$$1.dispatch(EXPANDED_CHANGED, Object.assign({}, state));
  const setAndDispatch = (val) => () => {
    if (val !== undefined) {
      state.expanded = val;
    }
    dispatch();
  };
  const target = proxy({emitter: emitter$$1});
  return Object.assign(target, {
    expand: setAndDispatch(true),
    collapse: setAndDispatch(false),
    toggle(){
      state.expanded = !state.expanded;
      dispatch();
    },
    refresh(){
      dispatch();
    },
    clean(){
      target.off();
    }
  });
};

var expandableFactory$1 = ({expandKey = 'isArrowDown', collapseKey = 'isArrowUp'} = {}) =>
  ({element}) => {
    const expander = element.querySelector('[aria-expanded]');
    const expanded = expander.getAttribute('aria-expanded') !== 'false';

    const emitter$$1 = createEmitter();

    const expandableComp = expandableFactory({emitter: emitter$$1, expanded});
    const elementComp = elementFactory({element, emitter: emitter$$1});

    const expandableId = expander.getAttribute('aria-controls') || '';
    const expandable = element.querySelector(`#${expandableId}`) || document.getElementById(expandableId);

    const expanderComp = elementFactory({element: expander, emitter: createEmitter()});
    const expandedComp = elementFactory({element: expandable, emitter: createEmitter()});

    expandableComp.onExpandedChange(({expanded}) => {
      expanderComp.attr('aria-expanded', expanded);
      expandedComp.attr('aria-hidden', !expanded);
    });

    expanderComp.onkeydown((ev) => {
      if (isEnter(ev) || isSpace(ev)) {
        expandableComp.toggle();
        ev.preventDefault();
      } else if (collapseKey && checkKeys[collapseKey](ev)) {
        expandableComp.collapse();
        ev.preventDefault();
      } else if (expandKey && checkKeys[expandKey](ev)) {
        expandableComp.expand();
        ev.preventDefault();
      }
    });

    expanderComp.onclick((ev) => {
      const {clientX, clientY} = ev;
      // to differentiate a click generated from a keypress or an actual click
      // preventDefault does not seem enough on FF
      if (clientX !== 0 && clientY !== 0) {
        expandableComp.toggle();
      }
    });

    expandableComp.refresh();

    return Object.assign({}, expandableComp, elementComp, {
      expander(){
        return expanderComp;
      },
      expandable(){
        return expandedComp;
      },
      clean(){
        elementComp.clean();
        expanderComp.clean();
        expandedComp.clean();
        expandableComp.clean();
      }
    });
  };

const {proxyListener: proxyListener$3, emitter: createEmitter$2} = events;

const ACTIVE_ITEM_CHANGED = 'ACTIVE_ITEM_CHANGED';
const proxy$1 = proxyListener$3({[ACTIVE_ITEM_CHANGED]: 'onActiveItemChange'});

var itemList = ({emitter: emitter$$1 = createEmitter$2(), activeItem = 0, itemCount}) => {
	const state = {activeItem, itemCount};
	const event = proxy$1({emitter: emitter$$1});
	const dispatch = (opts = {}) => emitter$$1.dispatch(ACTIVE_ITEM_CHANGED, Object.assign({}, state, opts));
	const api = {
		activateItem(index) {
			state.activeItem = index < 0 ? itemCount - 1 : index % itemCount;
			dispatch();
		},
		activateNextItem() {
			api.activateItem(state.activeItem + 1);
		},
		activatePreviousItem() {
			api.activateItem(state.activeItem - 1);
		},
		refresh(opts) {
			dispatch(opts);
		}
	};

	return Object.assign(event, api);
};

const tabFactory = ({element, index, tablist}) => {
  const comp = elementFactory({element});
  comp.onclick(() => tablist.activateItem(index));
  comp.onkeydown(ev => {
    if (isArrowLeft(ev)) {
      tablist.activatePreviousItem();
    } else if (isArrowRight(ev)) {
      tablist.activateNextItem();
    }
  });

  tablist.onActiveItemChange(({activeItem, focus = true}) => {
    comp.attr('aria-selected', activeItem === index);
    comp.attr('tabindex', activeItem === index ? '0' : '-1');
    if (activeItem === index && focus) {
      element.focus();
    }
  });
  return comp;
};

const tabPanelFactory = ({element, index, tablist}) => {
  const comp = elementFactory({element});

  tablist.onActiveItemChange(({activeItem}) => {
    comp.attr('aria-hidden', activeItem !== index);
  });

  return comp;
};

var tablistFactory = ({element}) => {

  const emitter$$1 = emitter();

  const tablistEl = element.querySelector('[role=tablist]');

  if (!tablistEl) {
    console.log(element);
    throw new Error('could not find an element with the role tablist in the element above');
  }

  const pairs = [...tablistEl.querySelectorAll('[role=tab]')].map(tab => {
    const tabPanelId = tab.getAttribute('aria-controls') || '';
    const tabpanel = element.querySelector(`#${tabPanelId}`);
    if (!tabpanel) {
      console.log(tab);
      throw new Error('could not find the tabpanel associate to the tab above. Are you missing the aria-controls attribute ?');
    }
    return {tab, tabpanel};
  });

  const tabListComp = elementFactory({emitter: emitter$$1, element});
  const itemListComp = itemList({emitter: emitter$$1, itemCount: pairs.length});

  const tabs = pairs.map((pair, index) => {
    return {
      tab: tabFactory({element: pair.tab, tablist: itemListComp, index}),
      tabPanel: tabPanelFactory({element: pair.tabpanel, tablist: itemListComp, index})
    };
  });

  itemListComp.refresh({focus:false});

  return Object.assign({}, tabListComp, itemListComp, {
    tabPanel(index){
      return tabs[index].tabPanel;
    },
    tab(index){
      return tabs[index].tab;
    },
    clean(){
      itemListComp.off();
      tabListComp.clean();
      tabs.forEach(({tab, tabPanel}) => {
        tab.clean();
        tabPanel.clean();
      });
    }
  });
};

const createMenuItem = ({previousKey, nextKey}) =>
  ({menu, element, index}) => {
    const comp = elementFactory({element});
    comp.attr('role', 'menuitem');
    comp.onclick(() => {
      menu.activateItem(index);
    });
    comp.onkeydown((ev) => {
      if (checkKeys[nextKey](ev)) {
        menu.activateNextItem();
        ev.preventDefault();
      } else if (checkKeys[previousKey](ev)) {
        menu.activatePreviousItem();
        ev.preventDefault();
      }
    });

    menu.onActiveItemChange(({activeItem}) => {
      if (activeItem === index) {
        activated();
      } else {
        deactivated();
      }
    });

    const activated = () => {
      comp.attr('tabindex', '0');
      element.focus();
    };

    const deactivated = () => {
      comp.attr('tabindex', '-1');
    };
    return comp;
  };


const verticalMenuItem = createMenuItem({previousKey: 'isArrowUp', nextKey: 'isArrowDown'});
const horizontalMenuItem = createMenuItem({previousKey: 'isArrowLeft', nextKey: 'isArrowRight'});

var menuFactory = (menuItemFactory = verticalMenuItem) =>
  ({element}) => {
    const emitter$$1 = emitter();
    const menuItems = Array.from(element.children).filter(child => child.getAttribute('role') === 'menuitem');
    const listComp = itemList({emitter: emitter$$1, itemCount: menuItems.length});
    const menuComp = elementFactory({element, emitter: emitter$$1});

    menuComp.attr('role', 'menu');

    const menuItemComps = menuItems.map((element, index) => menuItemFactory({menu: listComp, element, index}));

    return Object.assign({}, listComp, menuComp, {
      item(index){
        return menuItemComps[index];
      },
      clean(){
        listComp.off();
        menuComp.clean();
        menuItemComps.forEach(comp => {
          comp.clean();
        });
      }
    });
  };

const verticalMenu = menuFactory();
const expandable$1 = expandableFactory$1();

var dropdown$1 = ({element}) => {
  const expandableComp = expandable$1({element});
  expandableComp.expander().attr('aria-haspopup', 'true');
  const menuComp = verticalMenu({element: expandableComp.expandable().element()});

  expandableComp.onExpandedChange(({expanded}) => {
    if (expanded) {
      menuComp.activateItem(0);
    }
  });

  menuComp.onkeydown(ev => {
    if (isEscape(ev)) {
      expandableComp.collapse();
      expandableComp.expander().element().focus();
    }
  });

  expandableComp.refresh();

  return Object.assign({}, expandableComp, {
    menu(){
      return menuComp;
    },
    clean(){
      expandableComp.clean();
      menuComp.clean();
    }
  });
};

const horizontalMenu = menuFactory(horizontalMenuItem);


const regularSubMenu = ({index, menu}) => menu.item(index);

const dropDownSubMenu = ({index, element, menu}) => {
  const subMenuComp = dropdown$1({element});
  menu.onActiveItemChange(({activeItem}) => {
    if (activeItem !== index) {
      subMenuComp.expander().attr('tabindex', '-1');
      subMenuComp.collapse();
    } else {
      subMenuComp.attr('tabindex', '-1');
      subMenuComp.expander().attr('tabindex', '0');
      subMenuComp.expander().element().focus();
    }
  });
  return subMenuComp;
};

const createSubMenuComponent = (arg) => {
  const {element} =arg;
  return element.querySelector('[role=menu]') !== null ?
    dropDownSubMenu(arg) :
    regularSubMenu(arg);
};

var menubarFactory = ({element}) => {
  const menubarComp = horizontalMenu({element});
  menubarComp.attr('role', 'menubar');
  const subMenus = Array.from(element.children).map((element, index) => createSubMenuComponent({
    index,
    element,
    menu: menubarComp
  }));

  menubarComp.refresh();

  return Object.assign({}, menubarComp, {
    item(index){
      return subMenus[index];
    },
    clean(){
      menubarComp.clean();
      subMenus.forEach(sm => sm.clean());
    }
  });
};

const expandable$2 = expandableFactory$1({expandKey: '', collapseKey: ''});

var accordionFactory = ({element}) => {
  const emitter$$1 = emitter();
  const accordionHeaders = element.querySelectorAll('[data-lrtiste-accordion-header]');
  const itemListComp = itemList({itemCount: accordionHeaders.length});
  const containerComp = elementFactory({element, emitter: emitter$$1});

  const expandables = [...accordionHeaders].map(element => expandable$2({element}));

  expandables.forEach((exp, index) => {
    // let expanded
    const expander = exp.expander();
    expander.onkeydown(ev => {
      if (isArrowDown(ev)) {
        itemListComp.activateNextItem();
        ev.preventDefault();
      } else if (isArrowUp(ev)) {
        itemListComp.activatePreviousItem();
        ev.preventDefault();
      }
    });

    expander.onfocus(_ => {
      itemListComp.activateItem(index);
    });

    itemListComp.onActiveItemChange(({activeItem}) => {
      if (activeItem === index) {
        exp.expander().element().focus();
      }
    });
  });

  return Object.assign({}, itemListComp, containerComp, {
    section(index){
      return expandables[index]
    },
    clean(){
      itemListComp.off();
      containerComp.clean();
      expandables.forEach(item => item.clean());
    }
  });
};

const expandable = expandableFactory$1();
const dropdown = dropdown$1;
const tablist = tablistFactory;
const menubar = menubarFactory;
const accordion$1 = accordionFactory;

function click (el, opts = {bubbles: true, cancelable: true, clientX: 23, clientY: 234}) {
  const event = new MouseEvent('click', opts);
  el.dispatchEvent(event);
}

function keydown (el, opts = {}) {
  const options = Object.assign({}, opts, {bubbles: true, cancelable: true});
  const event = new KeyboardEvent('keydown', options);
  el.focus();
  el.dispatchEvent(event);
}

function createAccordion () {
  const container = document.createElement('div');
  container.innerHTML = `<div data-lrtiste-accordion-header><h4 id="tab1">
    <button aria-controls="tabpanel1" aria-expanded="true" class="focus-adorner">Header one</button>
  </h4>
  <div id="tabpanel1" role="region" aria-labelledby="tab1">Content of section 1 with a <a href="#foo">focusable
    element</a>
  </div>
  </div>
  <div data-lrtiste-accordion-header>
  <h4 id="tab2">
    <button aria-controls="tabpanel2" aria-expanded="false" class="focus-adorner">Header Two</button>
  </h4>
  <div id="tabpanel2" aria-labelledby="tab2" role="region">Content of section 2 with a <a href="#foo">focusable
    element</a></div>
   </div>
   <div data-lrtiste-accordion-header>
  <h4 id="tab3">
    <button aria-controls="tabpanel3" aria-expanded="false" class="focus-adorner">Third Header</button>
  </h4>
  <div id="tabpanel3" aria-labelledby="tab3" role="region">Content of section 3 with a <a href="#foo">focusable
    element</a></div>
    </div>
    `;
  return container;
}

function testAccordionActioners (accordion, expected, t) {
  const actioners = accordion.querySelectorAll('[data-lrtiste-accordion-header] button');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(actioners[i].getAttribute(attr), expected[i][attr], `accordion header[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}

function testAccordionSections (accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=region]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `accordion section  [${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


var accordion = plan$1()
  .test('accordion: set up initial states ', function * (t) {
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false',
      }, {
        'aria-expanded': 'false',
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open an accordion on click', function * (t) {
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    const tab2 = element$$1.querySelector('[aria-controls=tabpanel2]');
    click(tab2);
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: close an accordion on click', function * (t) {
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    const tab2 = element$$1.querySelector('[aria-controls=tabpanel2]');
    click(tab2);
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
    click(tab2);
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down enter', function * (t) {
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    const tab2 = element$$1.querySelector('[aria-controls=tabpanel2]');
    keydown(tab2, {key: 'Enter'});
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down space', function * (t) {
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    const tab2 = element$$1.querySelector('[aria-controls=tabpanel2');
    keydown(tab2, {code: 'Space'});
    testAccordionActioners(element$$1, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element$$1, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: clean', function * (t) {
    let counter = 0;
    const increment = () => counter++;
    const element$$1 = createAccordion();
    const acc = accordion$1({element: element$$1});
    acc.onActiveItemChange(increment);
    acc.onclick(increment);
    acc.onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      acc.section(i).expander().onclick(increment);
      acc.section(i).expander().onkeydown(increment);
      acc.section(i).expandable().onclick(increment);
      acc.section(i).expandable().onkeydown(increment);
    }

    acc.clean();

    acc.refresh();
    click(acc.element());
    keydown(acc.element(),{});
    for (let i = 0; i < 3; i++) {
      click(acc.section(i).expander().element());
      keydown(acc.section(i).expander().element(), {});
      click(acc.section(i).expandable().element());
      keydown(acc.section(i).expandable().element(), {});
    }

    t.equal(counter,0);
  });

function createTablist () {
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

function testTab (container, expected, t) {
  const tabs = container.querySelectorAll('[role=tab]');
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

function testTabPanels (container, expected, t) {
  const tabs = container.querySelectorAll('[role=tabpanel]');
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

var tablist$1 = plan$1()
  .test('tabs: set up initial states', function* (t) {
    const element$$1 = createTablist();
    const tabList = tablist({element: element$$1});
    testTab(
      element$$1,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select an other tab closing the others', function* (t) {
    const element$$1 = createTablist();
    const tabList = tablist({element: element$$1});
    testTab(
      element$$1,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element$$1.querySelectorAll('[role=tab]');
    click(tab2);
    testTab(
      element$$1,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select previous tab using left arrow', function* (t) {
    const element$$1 = createTablist();
    const tabList = tablist({element: element$$1});
    testTab(
      element$$1,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element$$1.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowLeft'});
    testTab(
      element$$1,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'}
      ],
      t
    );
    keydown(tab3, {key: 'ArrowLeft'});
    testTab(
      element$$1,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select next tab using right arrow', function* (t) {
    const element$$1 = createTablist();
    const tabList = tablist({element: element$$1});
    testTab(
      element$$1,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element$$1.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowRight'});
    testTab(
      element$$1,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    keydown(tab2, {key: 'ArrowRight'});
    testTab(
      element$$1,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'}
      ],
      t
    );
    keydown(tab3, {key: 'ArrowRight'});
    testTab(
      element$$1,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element$$1,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('tab: clean', function* (t) {
    let counter = 0;
    const increment = () => counter++;
    const element$$1 = createTablist();
    const tabList = tablist({element: element$$1});

    tabList.onActiveItemChange(increment);
    tabList.onclick(increment);
    tabList.onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      tabList.tabPanel(i).onclick(increment);
      tabList.tab(i).onclick(increment);
      tabList.tabPanel(i).onkeydown(increment);
      tabList.tab(i).onkeydown(increment);
    }

    tabList.clean();

    tabList.refresh();
    click(tabList.element());
    keydown(tabList.element(), {});
    for (let i = 0; i < 3; i++) {
      click(tabList.tabPanel(i).element());
      keydown(tabList.tab(i).element(), {});
    }

    t.equal(counter, 0);
  });

function createDropdown () {
  const container = document.createElement('DIV');
  container.innerHTML = `
      <button aria-controls="menu-sample" type="button" aria-expanded="false" aria-haspopup="true">Actions</button>
      <ul id="menu-sample" role="menu">
        <li role="menuitem">action 1</li>
        <li role="menuitem">action 2</li>
        <li role="menuitem">action 3</li>
      </ul>
    `;
  return container;
}

function testMenuItems (dropdown$$1, expected, t) {
  const menuitems = dropdown$$1.querySelectorAll('[role=menuitem]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(menuitems[i].getAttribute(attr), expected[i][attr], `menuitem[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


var dropdown$2 = plan$1()
  .test('dropdown: init states', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open on click', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close on click', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open menu on arrow down', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Enter', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'Enter'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Space', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {code: 'Space'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on arrow up', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: select previous item with up arrow', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = element$$1.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowUp'});
    testMenuItems(element$$1, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowUp'});
    testMenuItems(element$$1, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with down arrow', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = element$$1.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowDown'});
    testMenuItems(element$$1, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowDown'});
    testMenuItems(element$$1, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowDown'});
    testMenuItems(element$$1, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on escape keydown', function * (t) {
    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    const [item1, item2, item3] = element$$1.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'Escape'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: clean', function * (t) {
    let counter = 0;

    const increment = () => counter++;

    const element$$1 = createDropdown();
    const dropDown = dropdown({element: element$$1});
    const button = element$$1.querySelector('button');
    const menu = element$$1.querySelector('#menu-sample');

    dropDown.onclick(increment);
    dropDown.onkeydown(increment);
    dropDown.onExpandedChange(increment);
    dropDown.expander().onclick(increment);
    dropDown.menu().onclick(increment);
    dropDown.expandable().onclick(increment);
    dropDown.expander().onkeydown(increment);
    dropDown.menu().onkeydown(increment);
    dropDown.expandable().onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      dropDown.menu().item(i).onkeydown(increment);
      dropDown.menu().item(i).onclick(increment);
    }

    dropDown.clean();

    dropDown.refresh();
    click(button);
    click(menu);
    click(element$$1);
    keydown(button, {});
    keydown(menu, {});
    keydown(element$$1, {});
    for (let i = 0; i < 3; i++) {
      click(dropDown.menu().item(i).element());
      keydown(dropDown.menu().item(i).element(),{});
    }

    t.equal(counter, 0);

  });

function createExpandableSection () {
  const container = document.createElement('DIV');
  container.innerHTML = `
  <button id="toggler" type="button" aria-expanded="false" aria-controls="expandable">Expand</button>
  <div id="expandable"></div>
`;
  return container;
}

var expandable$3 = plan$1()
  .test('expandable init states', function * (t) {
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
  })
  .test('expand section on click', function * (t) {
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('expand on keydown arrow down', function * (t) {
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('close on click', function * (t) {
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');
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
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  })
  .test('expandable: clean', function * (t) {
    let counter = 0;
    const element$$1 = createExpandableSection();
    const comp = expandable({element: element$$1});
    const increment = () => counter++;
    comp.onExpandedChange(increment);
    comp.onclick(increment);
    comp.onkeydown(increment);
    comp.expander().onkeydown(increment);
    comp.expander().onclick(increment);
    comp.expandable().onkeydown(increment);
    comp.expandable().onclick(increment);
    const button = element$$1.querySelector('#toggler');
    const section = element$$1.querySelector('#expandable');

    comp.clean();

    comp.refresh();
    click(button);
    click(section);
    keydown(button, {});
    keydown(section, {});
    t.equal(counter, 0);
  });

function createMenubar () {
  const menuBar = document.createElement('UL');
  menuBar.setAttribute('role', 'menubar');
  menuBar.innerHTML = `
        <li role="menuitem">
          <button id="b1" type="button" aria-expanded="false" aria-haspopup="true" tabindex="0" aria-controls="submenu1">Menu 1</button>
          <ul id="submenu1" aria-labelledby="b1" role="menu">
            <li role="menuitem">sub action 1.1</li>
            <li role="menuitem">sub action 1.2</li>
            <li role="menuitem">sub action 1.3</li>
            <li role="menuitem">sub action 1.4</li>
          </ul>
        </li>
        <li role="menuitem">
          <button id="b2" type="button" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-controls="submenu2">Menu 2</button>
          <ul id="submenu2" aria-labelledby="b2" role="menu">
            <li role="menuitem">sub action 2.1</li>
            <li role="menuitem">sub action 2.2</li>
            <li role="menuitem">sub action 2.3</li>
          </ul>
        </li>
        <li role="menuitem"><span>Some single action</span></li>
        <li role="menuitem">
          <button id="b4" type="button" aria-expanded="false" aria-haspopup="true" tabindex="-1" aria-controls="submenu4">Menu 3</button>
          <ul id="submenu4" aria-labelledby="b4" role="menu">
            <li role="menuitem">sub action 4.1</li>
            <li role="menuitem">sub action 4.2</li>
          </ul>
        </li>
`;
  return menuBar;
}


var menubar$1 = plan$1()
  .test('menubars: init states', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
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
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
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
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Enter', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'Enter'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Space', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    keydown(b2, {code: 'Space'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: navigate to next menu with right arrow', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    keydown(b1, {key: 'ArrowRight'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '0');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    mb.activateItem(3);
    keydown(b3, {key: 'ArrowRight'});
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
  .test('menubars: select previous menu item with left arrow', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    keydown(b1, {key: 'ArrowLeft'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '0');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    mb.activateItem(1);
    keydown(b2, {key: 'ArrowLeft'});
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
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
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
    keydown(b1, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1, si2, si3, si4] = m1.querySelectorAll('[role=menuitem]');
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    keydown(si1, {key: 'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '0');
    keydown(si4, {key: 'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '0');
    t.equal(si4.getAttribute('tabindex'), '-1');
  })
  .test('submenu: select next menu item using down arrow', function * (t) {
    const element$$1 = createMenubar();
    const mb = menubar({element: element$$1});
    const [b1, b2, b3] = element$$1.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element$$1.querySelectorAll('ul[role=menu]');
    //open menu
    keydown(b1, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1, si2, si3, si4] = m1.querySelectorAll('[role=menuitem]');
    const firstSubMenuComp = mb.item(0).menu();
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    keydown(si1, {key: 'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '0');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    //artificially set last sub item
    firstSubMenuComp.activateItem(3);
    keydown(si4, {key: 'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
  });

plan$1()
  .test(tablist$1)
  .test(dropdown$2)
  .test(expandable$3)
  .test(menubar$1)
  .test(accordion)
  .run();

}());
//# sourceMappingURL=index.js.map
