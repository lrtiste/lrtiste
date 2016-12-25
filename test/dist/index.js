(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var runtime = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
   * additional grant of patent rights can be found in the PATENTS file in
   * the same directory.
   */

  !function (global) {
    "use strict";

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction ||
      // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function (arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            resolve(result);
          }, reject);
        }
      }

      if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.domain) {
        invoke = process.domain.bind(invoke);
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    runtime.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

      return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
              // A return or throw (when the delegate iterator has no throw
              // method) always terminates the yield* loop.
              context.delegate = null;

              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              var returnMethod = delegate.iterator["return"];
              if (returnMethod) {
                var record = tryCatch(returnMethod, delegate.iterator, arg);
                if (record.type === "throw") {
                  // If the return method threw an exception, let that
                  // exception prevail over the original return or throw.
                  method = "throw";
                  arg = record.arg;
                  continue;
                }
              }

              if (method === "return") {
                // Continue with the outer return, now that the delegate
                // iterator has been terminated.
                continue;
              }
            }

            var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

            if (record.type === "throw") {
              context.delegate = null;

              // Like returning generator.throw(uncaught), but without the
              // overhead of an extra function call.
              method = "throw";
              arg = record.arg;
              continue;
            }

            // Delegate generator ran and handled its own exceptions so
            // regardless of what the method was, we continue as if it is
            // "next" with an undefined arg.
            method = "next";
            arg = undefined;

            var info = record.arg;
            if (info.done) {
              context[delegate.resultName] = info.value;
              context.next = delegate.nextLoc;
            } else {
              state = GenStateSuspendedYield;
              return info;
            }

            context.delegate = null;
          }

          if (method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = arg;
          } else if (method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw arg;
            }

            if (context.dispatchException(arg)) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              method = "next";
              arg = undefined;
            }
          } else if (method === "return") {
            context.abrupt("return", arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            var info = {
              value: record.arg,
              done: context.done
            };

            if (record.arg === ContinueSentinel) {
              if (context.delegate && method === "next") {
                // Deliberately forget the last sent value so that we don't
                // accidentally pass it on to the delegate.
                arg = undefined;
              }
            } else {
              return info;
            }
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(arg) call above.
            method = "throw";
            arg = record.arg;
          }
        }
      };
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function stop() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;
          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.next = finallyEntry.finallyLoc;
        } else {
          this.complete(record);
        }

        return ContinueSentinel;
      },

      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = record.arg;
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }
      },

      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        return ContinueSentinel;
      }
    };
  }(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  _typeof(commonjsGlobal) === "object" ? commonjsGlobal : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : commonjsGlobal);
});

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = _typeof(commonjsGlobal) === "object" ? commonjsGlobal : (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === "object" ? window : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === "object" ? self : commonjsGlobal;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch (e) {
    g.regeneratorRuntime = undefined;
  }
}

var index = runtimeModule;

var zora = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Zora = factory();
  })(commonjsGlobal, function () {
    'use strict';

    /**
     * slice() reference.
     */

    var slice = Array.prototype.slice;

    /**
     * Expose `co`.
     */

    var index$$1 = co['default'] = co.co = co;

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
      return new Promise(function (resolve, reject) {
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
          return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' + 'but the following object was passed: "' + String(ret.value) + '"'));
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

    function objectToPromise(obj) {
      var results = new obj.constructor();
      var keys = Object.keys(obj);
      var promises = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var promise = toPromise.call(this, obj[key]);
        if (promise && isPromise(promise)) defer(promise, key);else results[key] = obj[key];
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
      exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

      exports.shim = shim;
      function shim(obj) {
        var keys = [];
        for (var key in obj) {
          keys.push(key);
        }return keys;
      }
    });

    var is_arguments = createCommonjsModule$$1(function (module, exports) {
      var supportsArgumentsClass = function () {
        return Object.prototype.toString.call(arguments);
      }() == '[object Arguments]';

      exports = module.exports = supportsArgumentsClass ? supported : unsupported;

      exports.supported = supported;
      function supported(object) {
        return Object.prototype.toString.call(object) == '[object Arguments]';
      }

      exports.unsupported = unsupported;
      function unsupported(object) {
        return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
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
        } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
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

      function isBuffer(x) {
        if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
        if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
          return false;
        }
        if (x.length > 0 && typeof x[0] !== 'number') return false;
        return true;
      }

      function objEquiv(a, b, opts) {
        var i, key;
        if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
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
        } catch (e) {
          //happens when one is a string literal and the other isn't
          return false;
        }
        // having the same number of owned properties (keys incorporates
        // hasOwnProperty)
        if (ka.length != kb.length) return false;
        //the same set of keys (although not necessarily the same order),
        ka.sort();
        kb.sort();
        //~~~cheap key test
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] != kb[i]) return false;
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!deepEqual(a[key], b[key], opts)) return false;
        }
        return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
      }
    });

    var assertions = {
      ok: function ok(val) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should be truthy';

        var assertionResult = { pass: Boolean(val), expected: 'truthy', actual: val, operator: 'ok', message: message };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      deepEqual: function deepEqual(actual, expected) {
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'should be equivalent';

        var assertionResult = { pass: index$1(actual, expected), actual: actual, expected: expected, message: message, operator: 'deepEqual' };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      equal: function equal(actual, expected) {
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'should be equal';

        var assertionResult = { pass: actual === expected, actual: actual, expected: expected, message: message, operator: 'equal' };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      notOk: function notOk(val) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should not be truthy';

        var assertionResult = { pass: !Boolean(val), expected: 'falsy', actual: val, operator: 'notOk', message: message };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      notDeepEqual: function notDeepEqual(actual, expected) {
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'should not be equivalent';

        var assertionResult = { pass: !index$1(actual, expected), actual: actual, expected: expected, message: message, operator: 'notDeepEqual' };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      notEqual: function notEqual(actual, expected) {
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'should not be equal';

        var assertionResult = { pass: actual !== expected, actual: actual, expected: expected, message: message, operator: 'notEqual' };
        this.test.addAssertion(assertionResult);
        return assertionResult;
      },
      fail: function fail() {
        var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fail called';

        var assertionResult = {
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

    function assertion(test) {
      return Object.create(assertions, { test: { value: test } });
    }

    var Test = {
      run: function run() {
        var _this = this;

        var assert = assertion(this);
        var now = Date.now();
        return index$$1(this.coroutine(assert)).then(function () {
          return { assertions: _this.assertions, executionTime: Date.now() - now };
        });
      },
      addAssertion: function addAssertion() {
        var _this2 = this,
            _assertions;

        var newAssertions = [].concat(Array.prototype.slice.call(arguments)).map(function (a) {
          return Object.assign({ description: _this2.description }, a);
        });
        (_assertions = this.assertions).push.apply(_assertions, toConsumableArray(newAssertions));
        return this;
      }
    };

    function _test(_ref) {
      var description = _ref.description,
          coroutine = _ref.coroutine,
          _ref$only = _ref.only,
          only = _ref$only === undefined ? false : _ref$only;

      return Object.create(Test, {
        description: { value: description },
        coroutine: { value: coroutine },
        assertions: { value: [] },
        only: { value: only },
        length: {
          get: function get() {
            return this.assertions.length;
          }
        }
      });
    }

    function tapOut(_ref2) {
      var pass = _ref2.pass,
          message = _ref2.message,
          index$$1 = _ref2.index;

      var status = pass === true ? 'ok' : 'not ok';
      console.log([status, index$$1, message].join(' '));
    }

    function canExit() {
      return typeof process !== 'undefined' && typeof process.exit === 'function';
    }

    function tap() {
      return index.mark(function _callee() {
        var index$$1, lastId, success, failure, starTime, _assertion, execution;

        return index.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                index$$1 = 1;
                lastId = 0;
                success = 0;
                failure = 0;
                starTime = Date.now();

                console.log('TAP version 13');
                _context.prev = 6;

              case 7:
                

                _context.next = 10;
                return;

              case 10:
                _assertion = _context.sent;

                if (_assertion.pass === true) {
                  success++;
                } else {
                  failure++;
                }
                _assertion.index = index$$1;
                if (_assertion.id !== lastId) {
                  console.log('# ' + _assertion.description + ' - ' + _assertion.executionTime + 'ms');
                  lastId = _assertion.id;
                }
                tapOut(_assertion);
                if (_assertion.pass !== true) {
                  console.log('  ---\n  operator: ' + _assertion.operator + '\n  expected: ' + JSON.stringify(_assertion.expected) + '\n  actual: ' + JSON.stringify(_assertion.actual) + '\n  ...');
                }
                index$$1++;
                _context.next = 7;
                break;

              case 19:
                _context.next = 26;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](6);

                console.log('Bail out! unhandled exception');
                console.log(_context.t0);
                if (canExit()) {
                  process.exit(1);
                }

              case 26:
                _context.prev = 26;
                execution = Date.now() - starTime;

                if (index$$1 > 1) {
                  console.log('\n1..' + (index$$1 - 1) + '\n# duration ' + execution + 'ms\n# success ' + success + '\n# failure ' + failure);
                }
                if (failure && canExit()) {
                  process.exit(1);
                }
                return _context.finish(26);

              case 31:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 21, 26, 31]]);
      });
    }

    var Plan = defineProperty({
      test: function test(description, coroutine) {
        var _tests;

        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var testItems = !coroutine && description.tests ? [].concat(toConsumableArray(description)) : [{ description: description, coroutine: coroutine }];
        (_tests = this.tests).push.apply(_tests, toConsumableArray(testItems.map(function (t) {
          return _test(Object.assign(t, opts));
        })));
        return this;
      },
      only: function only(description, coroutine) {
        return this.test(description, coroutine, { only: true });
      },
      run: function run() {
        var sink = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tap();

        var sinkIterator = sink();
        sinkIterator.next();
        var hasOnly = this.tests.some(function (t) {
          return t.only;
        });
        var runnable = hasOnly ? this.tests.filter(function (t) {
          return t.only;
        }) : this.tests;
        return index$$1(index.mark(function _callee2() {
          var id, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, r, _ref3, _assertions2, executionTime, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, assert;

          return index.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  id = 1;
                  _context2.prev = 1;
                  results = runnable.map(function (t) {
                    return t.run();
                  });
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context2.prev = 6;
                  _iterator = results[Symbol.iterator]();

                case 8:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context2.next = 38;
                    break;
                  }

                  r = _step.value;
                  _context2.next = 12;
                  return r;

                case 12:
                  _ref3 = _context2.sent;
                  _assertions2 = _ref3.assertions;
                  executionTime = _ref3.executionTime;
                  _iteratorNormalCompletion2 = true;
                  _didIteratorError2 = false;
                  _iteratorError2 = undefined;
                  _context2.prev = 18;

                  for (_iterator2 = _assertions2[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    assert = _step2.value;

                    sinkIterator.next(Object.assign(assert, { id: id, executionTime: executionTime }));
                  }
                  _context2.next = 26;
                  break;

                case 22:
                  _context2.prev = 22;
                  _context2.t0 = _context2['catch'](18);
                  _didIteratorError2 = true;
                  _iteratorError2 = _context2.t0;

                case 26:
                  _context2.prev = 26;
                  _context2.prev = 27;

                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }

                case 29:
                  _context2.prev = 29;

                  if (!_didIteratorError2) {
                    _context2.next = 32;
                    break;
                  }

                  throw _iteratorError2;

                case 32:
                  return _context2.finish(29);

                case 33:
                  return _context2.finish(26);

                case 34:
                  id++;

                case 35:
                  _iteratorNormalCompletion = true;
                  _context2.next = 8;
                  break;

                case 38:
                  _context2.next = 44;
                  break;

                case 40:
                  _context2.prev = 40;
                  _context2.t1 = _context2['catch'](6);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 44:
                  _context2.prev = 44;
                  _context2.prev = 45;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 47:
                  _context2.prev = 47;

                  if (!_didIteratorError) {
                    _context2.next = 50;
                    break;
                  }

                  throw _iteratorError;

                case 50:
                  return _context2.finish(47);

                case 51:
                  return _context2.finish(44);

                case 52:
                  _context2.next = 57;
                  break;

                case 54:
                  _context2.prev = 54;
                  _context2.t2 = _context2['catch'](1);

                  sinkIterator.throw(_context2.t2);

                case 57:
                  _context2.prev = 57;

                  sinkIterator.return();
                  return _context2.finish(57);

                case 60:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[1, 54, 57, 60], [6, 40, 44, 52], [18, 22, 26, 34], [27,, 29, 33], [45,, 47, 51]]);
        }).bind(this));
      }
    }, Symbol.iterator, index.mark(function _callee3() {
      var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, t;

      return index.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context3.prev = 3;
              _iterator3 = this.tests[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context3.next = 12;
                break;
              }

              t = _step3.value;
              _context3.next = 9;
              return t;

            case 9:
              _iteratorNormalCompletion3 = true;
              _context3.next = 5;
              break;

            case 12:
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](3);
              _didIteratorError3 = true;
              _iteratorError3 = _context3.t0;

            case 18:
              _context3.prev = 18;
              _context3.prev = 19;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 21:
              _context3.prev = 21;

              if (!_didIteratorError3) {
                _context3.next = 24;
                break;
              }

              throw _iteratorError3;

            case 24:
              return _context3.finish(21);

            case 25:
              return _context3.finish(18);

            case 26:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    }));

    function plan() {
      return Object.create(Plan, {
        tests: { value: [] },
        length: {
          get: function get() {
            return this.tests.length;
          }
        }
      });
    }

    return plan;
  });
});

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
  //# sourceMappingURL=stampit.full.js.map
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

function ariaElement(_ref2) {
  var ariaRole = _ref2.ariaRole,
      _ref2$propertyName = _ref2.propertyName,
      propertyName = _ref2$propertyName === undefined ? 'el' : _ref2$propertyName;

  var elStamp = element({ propertyName: propertyName });
  return compose(elStamp, init(function assertAriaRole() {
    var role = this.el.getAttribute('role');
    if (role !== ariaRole) {
      throw new Error('the element used to create the component is expected to have the aria role ' + ariaRole);
    }
  }));
}

var elements = zora().test('throw an error if element argument is not provided', index.mark(function _callee(t) {
  var elStamp, comp;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            elStamp = element();
            comp = elStamp();

            t.fail('should have thrown an error');
          } catch (e) {
            t.equal(e.message, 'You must provide a dom element as "el" property');
          }

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('should set the readonly prop "el" on the instance', index.mark(function _callee2(t) {
  var elStamp, domEl, comp;
  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            elStamp = element();
            domEl = 'dom element';
            comp = elStamp({ el: domEl });

            t.equal(comp.el, domEl);
            comp.el = 'foo';
            t.fail('should have thrown an error');
          } catch (e) {
            t.ok(e, 'error should be defined');
          }

        case 1:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})).test('should be able to rename the property', index.mark(function _callee3(t) {
  var elStamp, domEl, comp;
  return index.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          try {
            elStamp = element({ propertyName: 'foo' });
            domEl = 'dom element';
            comp = elStamp({ foo: domEl });

            t.equal(comp.foo, domEl);
            comp.foo = 'foo';
            t.fail('should have thrown an error');
          } catch (e) {
            t.ok(e, 'the error should be defined');
          }

        case 1:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
}));

function observable$1() {
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
            value = val;
            this.$onChange(prop, val);
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
  return compose(mandatoryEl, observable$1(prop), init(function () {
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

function mockElement() {
  return {
    setAttribute: function setAttribute(attr, val) {
      this[attr] = val;
    }
  };
}

var observable$$1 = zora().test('observe a property and get notified with the new value', function (t) {
  var obsStamp = observable$1('myProp');
  var comp = obsStamp();
  comp.$on('myProp', function (myProp) {
    t.equal(myProp, 'foo');
  });
  comp.myProp = 'foo';
}).test('do not get notified if the value remains the same', function (t) {
  var obsStamp = observable$1('myProp');
  var comp = obsStamp();
  comp.$on('myProp', function (myProp) {
    t.equal(myProp, 'foo');
  });
  comp.myProp = 'foo';
  comp.myProp = 'foo';
}).test('manually emit a change event', function (t) {
  var obsStamp = observable$1('myProp');
  var comp = obsStamp();
  comp.$on('myProp', function (myProp) {
    t.equal(myProp, 'bar');
  });
  comp.$onChange('myProp', 'bar');
}).test('use arrity n api', function (t) {
  var obsStamp = observable$1('myProp', 'myPropBis');
  var obs = obsStamp();
  obs.$on('myProp', function (myProp) {
    t.equal(myProp, 'bar');
  });
  obs.$on('myPropBis', function (myPropBis) {
    t.equal(myPropBis, 'foo');
  });
  obs.myProp = 'bar';
  obs.myPropBis = 'foo';
}).test('compose multiple times with observable', function (t) {
  var obsStamp = compose(observable$1('myProp'), observable$1('myPropBis'));
  var obs = obsStamp();
  obs.$on('myProp', function (myProp) {
    t.equal(myProp, 'bar');
  });
  obs.$on('myPropBis', function (myPropBis) {
    t.equal(myPropBis, 'foo');
  });
  obs.myProp = 'bar';
  obs.myPropBis = 'foo';
}).test('have multiple listeners', function (t) {
  var obsStamp = observable$1('myProp');
  var comp = obsStamp();
  comp.$on('myProp', function (myProp) {
    t.equal(myProp, 'foo');
  });
  comp.$on('myProp', function (myProp) {
    t.ok(true);
  });
  comp.myProp = 'foo';
}).test('map a property to aria attribute', function (t) {
  var stamp = mapToAria('foo', 'bar');
  var inst = stamp({ el: mockElement() });
  inst.foo = true;
  t.equal(inst.el['aria-bar'], true);
}).test('map a property to aria attribute negating the value', function (t) {
  var stamp = mapToAria('foo', '!bar');
  var inst = stamp({ el: mockElement() });
  inst.foo = true;
  t.equal(inst.el['aria-bar'], false);
}).test('use arrity n api', function (t) {
  var stamp = mapToAria('foo', 'bar', '!blah', 'woot');
  var inst = stamp({ el: mockElement() });
  inst.foo = true;
  t.equal(inst.el['aria-bar'], true);
  t.equal(inst.el['aria-blah'], false);
  t.equal(inst.el['aria-woot'], true);
}).test('should compose multiple times mapToAria', function (t) {
  var stamp = compose(mapToAria('foo', 'bar'), mapToAria('blah', 'woot'));
  var inst = stamp({ el: mockElement() });
  inst.foo = true;
  inst.blah = false;
  t.equal(inst.el['aria-bar'], true);
  t.equal(inst.el['aria-woot'], false);
});

function toggle$2() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'isOpen';

  return methods({
    toggle: function toggle$2() {
      this[prop] = !this[prop];
    }
  });
}

var toggle$1 = zora().test('toggle "isOpen" by default', index.mark(function _callee(t) {
  var stamp, inst;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          stamp = toggle$2();
          inst = stamp();

          inst.isOpen = true;
          inst.toggle();
          t.equal(inst.isOpen, false);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('toggle a given property', index.mark(function _callee2(t) {
  var stamp, inst;
  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          stamp = toggle$2('foo');
          inst = stamp();

          inst.foo = false;
          inst.toggle();
          t.equal(inst.foo, true);

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

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

var list = zora().test('list mediator: add item', index.mark(function _callee(t) {
  var instance, item;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          instance = listMediatorStamp();

          t.equal(instance.items.length, 0);
          item = {};

          instance.addItem(item);
          t.deepEqual(instance.items, [item]);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('list mediator: open an item and close all others', index.mark(function _callee2(t) {
  var instance, item, item2, item3;
  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          instance = listMediatorStamp();
          item = { isOpen: false };
          item2 = { isOpen: false };
          item3 = { isOpen: true };

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

        case 15:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})).test('select an item and unselect the others', index.mark(function _callee3(t) {
  var instance, item, item2, item3;
  return index.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          instance = listMediatorStamp();
          item = { isSelected: false };
          item2 = { isSelected: false };
          item3 = { isSelected: true };

          instance.addItem(item);
          instance.addItem(item2);
          instance.addItem(item3);

          instance.selectItem(item2);
          t.equal(item.isSelected, false);
          t.equal(item2.isSelected, true);
          t.equal(item3.isSelected, false);

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
})).test('select the next item or loop back to the first', index.mark(function _callee4(t) {
  var instance, item, item2, item3;
  return index.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          instance = listMediatorStamp();
          item = { isSelected: false };
          item2 = { isSelected: true };
          item3 = { isSelected: false };

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

        case 15:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
})).test('select the previous item or loop back to the last', index.mark(function _callee5(t) {
  var instance, item, item2, item3;
  return index.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          instance = listMediatorStamp();
          item = { isSelected: false };
          item2 = { isSelected: true };
          item3 = { isSelected: false };

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

        case 15:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
})).test('multiselect list mediator: toggle any item', index.mark(function _callee6(t) {
  var instance, item, item2, item3;
  return index.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          instance = multiSelectMediatorStamp();
          item = { isOpen: false };
          item2 = { isOpen: false };
          item3 = { isOpen: true };

          instance.addItem(item);
          instance.addItem(item2);
          instance.addItem(item3);

          instance.toggleItem(item);

          t.equal(item.isOpen, true);
          t.equal(item2.isOpen, false);
          t.equal(item3.isOpen, true);

        case 11:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, this);
}));

var behaviours = zora().test(elements).test(observable$$1).test(toggle$1).test(list);

var mandatoryElement = element();
var tablist = ariaElement({ ariaRole: 'tablist' });

var accordionTabEventBinding = init(function () {
  var _this = this;

  this.el.addEventListener('click', function (event) {
    _this.toggle();
    _this.select();
  });

  this.el.addEventListener('keydown', function (event) {
    var k = event.key,
        code = event.code,
        target = event.target;

    if (k === 'Enter' || code === 'Space') {
      if (target.tagName !== 'BUTTON' || target.tagName === 'A') {
        _this.toggle();
        _this.select();
        event.preventDefault();
      }
    } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
      _this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowRight' || k === 'ArrowDown') {
      _this.selectNext();
      event.preventDefault();
    }
  });
});
var accordionTabpanelEventBinding = init(function () {
  var _this2 = this;

  this.el.addEventListener('focusin', function (event) {
    _this2.tab.select();
  });
  this.el.addEventListener('click', function (event) {
    _this2.tab.select();
  });
});

var accordionTabpanelStamp = compose(ariaElement({ ariaRole: 'tabpanel' }), toggle$2(), methods({
  hasFocus: function hasFocus() {
    return this.el.querySelector(':focus') !== null;
  }
}), mapToAria('isOpen', '!hidden'), init(function initializeAccordionTabpanel(_ref) {
  var tab = _ref.tab;

  Object.defineProperty(this, 'tab', { value: tab });
}), accordionTabpanelEventBinding);

var accordionTabStamp = compose(ariaElement({ ariaRole: 'tab' }), listItemStamp, mapToAria('isOpen', 'expanded'), mapToAria('isSelected', 'selected'), init(function initializeAccordionTab(_ref2) {
  var _this3 = this;

  var tabpanelEl = _ref2.tabpanelEl;

  var tabpanel = accordionTabpanelStamp({ el: tabpanelEl, tab: this });
  Object.defineProperty(this, 'tabpanel', { value: tabpanel });
  this.$on('isOpen', function (isOpen) {
    _this3.tabpanel.toggle();
  });

  this.$on('isSelected', function (isSelected) {
    _this3.el.setAttribute('tabindex', isSelected ? 0 : -1);
    if (isSelected && !_this3.tabpanel.hasFocus()) {
      _this3.el.focus();
    }
  });

  this.isSelected = this.el.getAttribute('aria-selected') == 'true' || this.el.getAttribute('tabindex') === '0';
  this.isOpen = this.el.getAttribute('aria-expanded') === 'true';
  this.tabpanel.isOpen = this.isOpen;
}), accordionTabEventBinding);





function accordion() {
  return compose(mandatoryElement, multiSelectMediatorStamp, init(function initializeAccordionTablist() {
    Object.defineProperty(this, 'tablist', {
      value: tablist({
        el: this.el.querySelector('[role=tablist]') || this.el
      })
    });
    this.tablist.el.setAttribute('aria-multiselectable', true);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.tablist.el.querySelectorAll('[role=tab]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var tab = _step.value;

        var controlledId = tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(tab);
          throw new Error('for the accordion tab element above, you must specify which tabpanel is controlled using aria-controls');
        }
        var tabpanelEl = this.el.querySelector('#' + controlledId);
        if (!tabpanelEl) {
          console.log(tab);
          throw new Error('for the tab element above, could not find the related tabpanel with the id ' + controlledId);
        }
        accordionTabStamp({ tabpanelEl: tabpanelEl, el: tab, listMediator: this });
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
  }));
}

function click(el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { bubbles: true, cancelable: true };

  var event = new MouseEvent('click', opts);
  el.dispatchEvent(event);
}

function keydown(el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = Object.assign({}, opts, { bubbles: true, cancelable: true });
  var event = new KeyboardEvent('keydown', options);
  el.focus();
  el.dispatchEvent(event);
}

var factory = accordion();

function createAccordion() {

  var container = document.createElement('div');
  container.setAttribute('role', 'tablist');
  container.innerHTML = '\n  <h4 id="tab1" tabindex="0" role="tab" aria-controls="tabpanel1">Header one</h4>\n  <p id="tabpanel1" aria-labelledby="tab1" role="tabpanel">Content of section 1 with a <a href="#foo">focusable element</a></p>\n  <h4 id="tab2" role="tab" aria-controls="tabpanel2"><span class="adorner" aria-hidden="true"></span>Header two</h4>\n  <p id="tabpanel2" aria-labelledby="tab2" role="tabpanel">Content of section 2 with a <a href="#foo">focusable element</a></p>\n  <h4 id="tab3" role="tab" aria-controls="tabpanel3"><span class="adorner" aria-hidden="true"></span>Header three</h4>\n  <p id="tabpanel3" aria-labelledby="tab3" role="tabpanel">Content of section 3 with a <a href="#foo">focusable element</a></p>\n';
  return container;
}

function testTab(accordion$$1, expected, t) {
  var tabs = accordion$$1.querySelectorAll('[role=tab]');
  for (var i = 0; i < expected.length; i++) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(expected[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        t.equal(tabs[i].getAttribute(attr), expected[i][attr], 'tabs[' + i + '] attribute ' + attr + ' should equal ' + expected[i][attr]);
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
}

function testTabPanels(accordion$$1, expected, t) {
  var tabs = accordion$$1.querySelectorAll('[role=tabpanel]');
  for (var i = 0; i < expected.length; i++) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(expected[i])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var attr = _step2.value;

        t.equal(tabs[i].getAttribute(attr), expected[i][attr], 'tabpanel  [' + i + '] attribute ' + attr + ' should equal ' + expected[i][attr]);
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
  }
}

var accordions = zora().test('accordion: set up initial states ', index.mark(function _callee(t) {
  var el, acc;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });

          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('accordion: open an accordion on click', index.mark(function _callee2(t) {
  var el, acc, tab1;
  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab1 = el.querySelector('#tab1');

          click(tab1);
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})).test('accordion: close an accordion on click', index.mark(function _callee3(t) {
  var el, acc, tab1;
  return index.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab1 = el.querySelector('#tab1');

          click(tab1);
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          click(tab1);
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 9:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
})).test('accordion: open two accordion on click', index.mark(function _callee4(t) {
  var el, acc, tab1, tab3;
  return index.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab1 = el.querySelector('#tab1');

          click(tab1);
          testTab(acc.el, [{
            'aria-selected': 'true',
            'aria-expanded': 'true',
            tabindex: '0'
          }, {
            'aria-selected': 'false',
            tabindex: '-1'
          }, {
            'aria-selected': 'false',
            tabindex: '-1'
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          tab3 = el.querySelector('#tab3');

          click(tab3);
          testTab(acc.el, [{
            'aria-selected': 'false',
            'aria-expanded': 'true',
            tabindex: '-1'
          }, {
            'aria-selected': 'false',
            tabindex: '-1'
          }, {
            'aria-selected': 'true',
            'aria-expanded': 'true',
            tabindex: '0'
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'false'
          }], t);

        case 10:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
})).test('accordion: open on key down enter', index.mark(function _callee5(t) {
  var el, acc, tab2;
  return index.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');

          keydown(tab2, { key: 'Enter' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 6:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
})).test('accordion: open on key down space', index.mark(function _callee6(t) {
  var el, acc, tab2;
  return index.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');

          keydown(tab2, { code: 'Space' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'false'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 6:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, this);
})).test('accordion select previous item on left arrow', index.mark(function _callee7(t) {
  var el, acc, tab2, tab1;
  return index.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');
          tab1 = el.querySelector('#tab1');

          tab2.focus();
          keydown(tab2, { key: 'ArrowLeft' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          tab1.focus();
          keydown(tab1, { key: 'ArrowLeft' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 12:
        case 'end':
          return _context7.stop();
      }
    }
  }, _callee7, this);
})).test('accordion select previous item on up arrow', index.mark(function _callee8(t) {
  var el, acc, tab2, tab1;
  return index.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');
          tab1 = el.querySelector('#tab1');

          tab2.focus();
          keydown(tab2, { key: 'ArrowUp' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          tab1.focus();
          keydown(tab1, { key: 'ArrowUp' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 12:
        case 'end':
          return _context8.stop();
      }
    }
  }, _callee8, this);
})).test('accordion select next item on right arrow', index.mark(function _callee9(t) {
  var el, acc, tab2, tab3;
  return index.wrap(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');
          tab3 = el.querySelector('#tab3');

          tab2.focus();
          keydown(tab2, { key: 'ArrowRight' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          tab3.focus();
          keydown(tab3, { key: 'ArrowRight' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 12:
        case 'end':
          return _context9.stop();
      }
    }
  }, _callee9, this);
})).test('accordion select next item on down arrow', index.mark(function _callee10(t) {
  var el, acc, tab2, tab3;
  return index.wrap(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          el = createAccordion();
          acc = factory({ el: el });
          tab2 = el.querySelector('#tab2');
          tab3 = el.querySelector('#tab3');

          tab2.focus();
          keydown(tab2, { key: 'ArrowDown' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);
          tab3.focus();
          keydown(tab3, { key: 'ArrowDown' });
          testTab(acc.el, [{
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
          }], t);
          testTabPanels(acc.el, [{
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }, {
            'aria-hidden': 'true'
          }], t);

        case 12:
        case 'end':
          return _context10.stop();
      }
    }
  }, _callee10, this);
}));

var mandatoryElement$1 = element();
var tablist$1 = ariaElement({ ariaRole: 'tablist' });

var tabEventBinding = init(function () {
  var _this = this;

  this.el.addEventListener('keydown', function (event) {
    var k = event.key;

    if (k === 'ArrowLeft' || k === 'ArrowUp') {
      _this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowDown' || k === 'ArrowRight') {
      _this.selectNext();
      event.preventDefault();
    }
  });
  this.el.addEventListener('click', function (event) {
    _this.select();
  });
});

var tabStamp = compose(ariaElement({ ariaRole: 'tab' }), listItemStamp, mapToAria('isSelected', 'selected'), init(function initializeTab(_ref) {
  var _this2 = this;

  var tabpanel = _ref.tabpanel;

  Object.defineProperty(this, 'tabpanel', { value: tabpanel });
  this.$on('isSelected', function (isSelected) {
    _this2.el.setAttribute('tabindex', isSelected ? 0 : -1);
    if (isSelected !== _this2.tabpanel.isOpen) {
      _this2.tabpanel.toggle();
    }
    if (isSelected) {
      _this2.el.focus();
    }
  });
  this.isSelected = this.el.getAttribute('aria-selected') === 'true';
  this.tabpanel.isOpen = this.isSelected;
}), tabEventBinding);

var tabPanelStamp = compose(ariaElement({ ariaRole: 'tabpanel' }), toggle$2(), mapToAria('isOpen', '!hidden'));





function tabList() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$tabpanelFactory = _ref2.tabpanelFactory,
      tabpanelFactory = _ref2$tabpanelFactory === undefined ? tabPanelStamp : _ref2$tabpanelFactory,
      _ref2$tabFactory = _ref2.tabFactory,
      tabFactory = _ref2$tabFactory === undefined ? tabStamp : _ref2$tabFactory;

  return compose(mandatoryElement$1, listMediatorStamp, init(function initializeTablist() {
    Object.defineProperty(this, 'tablist', { value: tablist$1({ el: this.el.querySelector('[role=tablist]') || this.el }) });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.tablist.el.querySelectorAll('[role=tab]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _tab = _step.value;

        var controlledId = _tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(_tab);
          throw new Error('for the tab element above, you must specify which tabpanel is controlled using aria-controls');
        }
        var tabpanelEl = this.el.querySelector('#' + controlledId);
        if (!tabpanelEl) {
          console.log(_tab);
          throw new Error('for the tab element above, could not find the related tabpanel with the id ' + controlledId);
        }
        var tabpanel = tabpanelFactory({ el: tabpanelEl });
        tabFactory({ el: _tab, listMediator: this, tabpanel: tabpanel });
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
  }));
}

var factory$1 = tabList();

function createTablist() {
  var container = document.createElement('div');
  container.innerHTML = '\n<ul role="tablist">\n  <li role="presentation"><a href="#panel1" role="tab"\n                             aria-controls="panel1" aria-selected="true">Markup</a></li>\n  <li role="presentation"><a href="#panel2" role="tab"\n                             aria-controls="panel2">Style</a>\n  </li>\n  <li role="presentation"><a href="#panel3" role="tab"\n                             aria-controls="panel3">Script</a>\n  </li>\n</ul>\n<div id="panel1" role="tabpanel"><h4 tabindex="0">panel 1 !!</h4>\n  <p>panel content</p>\n</div>\n<div id="panel2" role="tabpanel"><h4 tabindex="0">panel 2 !!</h4>\n  <p>panel content 2</p>\n</div>\n<div id="panel3" role="tabpanel"><h4 tabindex="0">panel 3 !!</h4>\n  <p>panel content 3</p>\n</div>\n';
  return container;
}

function testTab$1(accordion, expected, t) {
  var tabs = accordion.querySelectorAll('[role=tab]');
  for (var i = 0; i < expected.length; i++) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(expected[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        t.equal(tabs[i].getAttribute(attr), expected[i][attr], 'tabs[' + i + '] attribute ' + attr + ' should equal ' + expected[i][attr]);
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
}

function testTabPanels$1(accordion, expected, t) {
  var tabs = accordion.querySelectorAll('[role=tabpanel]');
  for (var i = 0; i < expected.length; i++) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(expected[i])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var attr = _step2.value;

        t.equal(tabs[i].getAttribute(attr), expected[i][attr], 'tabpanel  [' + i + '] attribute ' + attr + ' should equal ' + expected[i][attr]);
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
  }
}

var tabs = zora().test('tabs: set up initial states', index.mark(function _callee(t) {
  var el, tabList$$1;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('select an other tab closing the others', index.mark(function _callee2(t) {
  var el, tabList$$1, _el$querySelectorAll, _el$querySelectorAll2, tab1, tab2, tab3;

  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);
          _el$querySelectorAll = el.querySelectorAll('[role=tab]'), _el$querySelectorAll2 = slicedToArray(_el$querySelectorAll, 3), tab1 = _el$querySelectorAll2[0], tab2 = _el$querySelectorAll2[1], tab3 = _el$querySelectorAll2[2];

          click(tab2);
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }], t);

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})).test('select previous tab using left arrow', index.mark(function _callee3(t) {
  var el, tabList$$1, _el$querySelectorAll3, _el$querySelectorAll4, tab1, tab2, tab3;

  return index.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);
          _el$querySelectorAll3 = el.querySelectorAll('[role=tab]'), _el$querySelectorAll4 = slicedToArray(_el$querySelectorAll3, 3), tab1 = _el$querySelectorAll4[0], tab2 = _el$querySelectorAll4[1], tab3 = _el$querySelectorAll4[2];

          tab1.focus();
          keydown(tab1, { key: 'ArrowLeft' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }], t);
          keydown(tab3, { key: 'ArrowLeft' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }], t);

        case 12:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
})).test('select previous tab using up arrow', index.mark(function _callee4(t) {
  var el, tabList$$1, _el$querySelectorAll5, _el$querySelectorAll6, tab1, tab2, tab3;

  return index.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);
          _el$querySelectorAll5 = el.querySelectorAll('[role=tab]'), _el$querySelectorAll6 = slicedToArray(_el$querySelectorAll5, 3), tab1 = _el$querySelectorAll6[0], tab2 = _el$querySelectorAll6[1], tab3 = _el$querySelectorAll6[2];

          tab1.focus();
          keydown(tab1, { key: 'ArrowUp' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }], t);
          keydown(tab3, { key: 'ArrowUp' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }], t);

        case 12:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
})).test('select next tab using right arrow', index.mark(function _callee5(t) {
  var el, tabList$$1, _el$querySelectorAll7, _el$querySelectorAll8, tab1, tab2, tab3;

  return index.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);
          _el$querySelectorAll7 = el.querySelectorAll('[role=tab]'), _el$querySelectorAll8 = slicedToArray(_el$querySelectorAll7, 3), tab1 = _el$querySelectorAll8[0], tab2 = _el$querySelectorAll8[1], tab3 = _el$querySelectorAll8[2];

          tab1.focus();
          keydown(tab1, { key: 'ArrowRight' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }], t);
          keydown(tab2, { key: 'ArrowRight' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }], t);
          keydown(tab3, { key: 'ArrowRight' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);

        case 15:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
})).test('select next tab using down arrow', index.mark(function _callee6(t) {
  var el, tabList$$1, _el$querySelectorAll9, _el$querySelectorAll10, tab1, tab2, tab3;

  return index.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          el = createTablist();
          tabList$$1 = factory$1({ el: el });

          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);
          _el$querySelectorAll9 = el.querySelectorAll('[role=tab]'), _el$querySelectorAll10 = slicedToArray(_el$querySelectorAll9, 3), tab1 = _el$querySelectorAll10[0], tab2 = _el$querySelectorAll10[1], tab3 = _el$querySelectorAll10[2];

          tab1.focus();
          keydown(tab1, { key: 'ArrowDown' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }], t);
          keydown(tab2, { key: 'ArrowDown' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'true', 'tabindex': '0' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'false' }], t);
          keydown(tab3, { key: 'ArrowDown' });
          testTab$1(tabList$$1.el, [{ 'aria-selected': 'true', 'tabindex': '0' }, { 'aria-selected': 'false', 'tabindex': '-1' }, { 'aria-selected': 'false', 'tabindex': '-1' }], t);
          testTabPanels$1(tabList$$1.el, [{ 'aria-hidden': 'false' }, { 'aria-hidden': 'true' }, { 'aria-hidden': 'true' }], t);

        case 15:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, this);
}));

var mandatoryElement$2 = element();
var menuElement = ariaElement({ ariaRole: 'menu' });

var abstractMenuItem = compose(ariaElement({ ariaRole: 'menuitem' }), listItemStamp, observable$1('isSelected'), init(function () {
  var _this = this;

  this.$on('isSelected', function (isSelected) {
    _this.el.setAttribute('tabindex', isSelected ? 0 : -1);
    if (isSelected === true) {
      _this.el.focus();
    }
  });
}));

var menuItemEvenBinding = init(function () {
  var _this2 = this;

  this.el.addEventListener('keydown', function (event) {
    var k = event.keyCode,
        target = event.target;

    if (k === 37 || k === 38) {
      _this2.selectPrevious();
    } else if (k === 39 || k === 40) {
      _this2.selectNext();
    }
    if (/\b37\b|\b38\b|\b39\b|\b40\b/.test(k)) {
      event.preventDefault();
    }
  });
});

var menuItemStamp = compose(abstractMenuItem, menuItemEvenBinding);

var subMenuItemEventBinding = init(function () {
  var _this3 = this;

  this.el.addEventListener('keydown', function (event) {
    var k = event.keyCode;

    if (k === 38) {
      _this3.selectPrevious();
    } else if (k === 40) {
      _this3.selectNext();
    }

    if (/\b38\b|\b40\b/.test(k)) {
      event.preventDefault();
    }
  });
});

var subMenuItemStamp = compose(abstractMenuItem, subMenuItemEventBinding);

var menuEventBinding = init(function () {
  var _this4 = this;

  this.toggler.addEventListener('click', function (event) {
    _this4.toggle();
  });
  this.toggler.addEventListener('keydown', function (event) {
    var k = event.key,
        code = event.code,
        target = event.target;

    if (k === 'Enter' || code === 'Space') {
      if (!/button|a/i.test(target.tagName)) {
        //already handled by the click event
        _this4.toggle();
      }
    } else if (k === 'ArrowDown' && !_this4.isOpen) {
      _this4.toggle();
      event.preventDefault();
    } else if (k === 'ArrowUp' && _this4.isOpen) {
      event.preventDefault();
      _this4.toggle();
    }
  });
  //
  // if (this.el !== this.toggler) {
  //   this.el.addEventListener('keydown', event=> {
  //     const {keyCode:k} = event;
  //     if (/\b9\b|\b27\b/.test(k) && this.isOpen) {
  //       this.toggle();
  //       if (k === 27) {
  //         this.toggler.focus();
  //       }
  //     }
  //   })
  // }
});

var subMenuEventBinding = init(function () {
  var _this5 = this;

  var next = function next() {
    _this5.selectNext();
    if (_this5.isOpen) {
      _this5.toggle();
    }
  };

  var previous = function previous() {
    _this5.selectPrevious();
    if (_this5.isOpen) {
      _this5.toggle();
    }
  };

  this.toggler.addEventListener('click', function (event) {
    _this5.toggle();
  });
  this.toggler.addEventListener('keydown', function (event) {
    var k = event.keyCode,
        target = event.target;

    if (/\b13\b|\b32\b/.test(k) && target.tagName !== 'BUTTON' && target === _this5.toggler) {
      _this5.toggle();
    } else if (k === 39) {
      next();
    } else if (k === 37) {
      previous();
    } else if (k === 40 && target === _this5.toggler) {
      if (!_this5.isOpen) {
        _this5.toggle();
      } else {
        _this5.selectNext();
      }
    } else if (k === 38 && target === _this5.toggler) {
      if (_this5.isOpen) {
        _this5.toggle();
      } else {
        _this5.selectPrevious();
      }
    }

    if (/\b37\b|\b38\b|\b39\b|\b40\b/.test(k)) {
      event.preventDefault();
    }
  });

  this.el.addEventListener('keydown', function (event) {
    var k = event.keyCode;

    if (k === 39) {
      next();
    } else if (k === 37) {
      previous();
    } else if (/\b9\b|\b27\b/.test(k) && _this5.isOpen) {
      _this5.toggle();
      if (k === 27) {
        _this5.toggler.focus();
      }
    }
    if (/\b37\b|\b39\b/.test(k)) {
      event.preventDefault();
    }
  });
});

function menuInitStamp() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$menuItem = _ref.menuItem,
      menuItem = _ref$menuItem === undefined ? menuItemStamp : _ref$menuItem;

  return init(function () {
    var _this6 = this;

    var menu = menuElement({ el: this.el.querySelector('[role=menu]') || this.el });
    var toggler = this.el.querySelector('[aria-haspopup]') || this.el;

    Object.defineProperty(this, 'toggler', { value: toggler });
    Object.defineProperty(this, 'menu', { value: menu });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.menu.el.querySelectorAll('[role="menuitem"]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var el = _step.value;

        menuItem({ listMediator: this, el: el });
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

    this.$on('isOpen', function (isOpen) {
      _this6.toggler.setAttribute('aria-expanded', isOpen);
      _this6.menu.el.setAttribute('aria-hidden', !isOpen);
      if (isOpen && _this6.items.length) {
        _this6.selectItem(_this6.items[0]);
      }
    });
    this.$on('isSelected', function (isSelected) {
      _this6.toggler.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected) {
        _this6.toggler.focus();
      }
    });
    this.isOpen = !!this.toggler.getAttribute('aria-expanded');
  });
}

var abstractMenuStamp = compose(mandatoryElement$2, listMediatorStamp, toggle$2(), observable$1('isOpen'));



function subMenu() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$menuItem = _ref3.menuItem,
      menuItem = _ref3$menuItem === undefined ? subMenuItemStamp : _ref3$menuItem;

  return compose(listItemStamp, abstractMenuStamp, observable$1('isSelected'), menuInitStamp({ menuItem: menuItem }), subMenuEventBinding);
}

var subMenuStamp = subMenu({ menuItem: subMenuItemStamp });







var expandableStamp = compose(element(), toggle$2(), mapToAria('isOpen', 'expanded'), init(function () {
  Object.defineProperty(this, 'toggler', { value: this.el });
}), menuEventBinding);

function expandable() {
  return compose(element(), init(function () {
    var _this7 = this;

    var toggler = this.el.querySelector('[aria-haspopup]');
    if (!toggler) {
      console.log(this.el);
      throw new Error('the element above must contain a control with aria-haspopup attribute set to true');
    }
    Object.defineProperty(this, 'button', { value: expandableStamp({ el: toggler }) });

    var controlledId = toggler.getAttribute('aria-controls');
    if (!controlledId) {
      console.log(toggler);
      throw new Error('the toggler above must explicitly control a section via the aria-controls attribute');
    }

    var expandableSection = this.el.querySelector('#' + controlledId);
    if (!expandableSection) {
      throw new Error('Could not find the element referenced by id ' + controlledId);
    }
    Object.defineProperty(this, 'expandableSection', { value: expandableSection });

    this.button.$on('isOpen', function (isExpanded) {
      _this7.expandableSection.setAttribute('aria-hidden', !isExpanded);
    });

    this.button.isOpen = !!this.button.el.getAttribute('aria-expanded');
  }));
}

var factory$2 = expandable();

function createExpandableSection() {
  var container = document.createElement('DIV');
  container.innerHTML = '\n  <button id="toggler" type="button" aria-haspopup="true" aria-controls="expandable">Expand</button>\n  <div id="expandable"></div>\n';
  return container;
}

var exp = zora().test('expandable init states', index.mark(function _callee(t) {
  var el, comp, button, section;
  return index.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          el = createExpandableSection();
          comp = factory$2({ el: el });
          button = el.querySelector('#toggler');
          section = el.querySelector('#expandable');

          t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).test('expand section on click', index.mark(function _callee2(t) {
  var el, comp, button, section;
  return index.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          el = createExpandableSection();
          comp = factory$2({ el: el });
          button = el.querySelector('#toggler');
          section = el.querySelector('#expandable');

          t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
          click(button);
          t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
          t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
})).test('expand on keydown arrow down', index.mark(function _callee3(t) {
  var el, comp, button, section;
  return index.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          el = createExpandableSection();
          comp = factory$2({ el: el });
          button = el.querySelector('#toggler');
          section = el.querySelector('#expandable');

          t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
          keydown(button, { key: 'ArrowDown' });
          t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
          t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');

        case 9:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
})).test('close on click', index.mark(function _callee4(t) {
  var el, comp, button, section;
  return index.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          el = createExpandableSection();
          comp = factory$2({ el: el });
          button = el.querySelector('#toggler');
          section = el.querySelector('#expandable');

          t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
          click(button);
          t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
          t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
          click(button);
          t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');

        case 12:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
})).test('close on arrow up', index.mark(function _callee5(t) {
  var el, comp, button, section;
  return index.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          el = createExpandableSection();
          comp = factory$2({ el: el });
          button = el.querySelector('#toggler');
          section = el.querySelector('#expandable');

          t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
          click(button);
          t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
          t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
          keydown(button, { key: 'ArrowUp' });
          t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
          t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');

        case 12:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
}));

var components = zora().test(accordions).test(tabs).test(exp);

zora().test(behaviours).test(components).run().catch(function (e) {
  return console.log(e);
});

}());
//# sourceMappingURL=index.js.map
