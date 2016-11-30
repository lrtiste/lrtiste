(function () {
'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stampit_full$1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(obj) {
  var type = typeof obj;
  return !!obj && (type === 'object' || type === 'function');
}

function isFunction(obj) {
  return typeof obj === 'function';
}

var concat = Array.prototype.concat;
var extractFunctions = function () {
  var fns = concat.apply([], arguments).filter(isFunction);
  return fns.length === 0 ? undefined : fns;
};

function isPlainObject(value) {
  return !!value && typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype;
}

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
  if (Array.isArray(src)) { return (Array.isArray(dst) ? dst : []).concat(src); }

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
      var newDst = isPlainObject(dstValue) || Array.isArray(srcValue) ? dstValue : {};

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
var standardiseDescriptor = function (ref) {
  if ( ref === void 0 ) ref = {};
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

  var p = isObject(props) || isObject(refs) || isObject(properties) ?
    assign$1({}, props, refs, properties) : undefined;

  var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
  dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

  var sp = isObject(statics) || isObject(staticProperties) ?
    assign$1({}, statics, staticProperties) : undefined;

  var dsp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
  dsp = isObject(staticDeepProperties) ? merge(dsp, staticDeepProperties) : dsp;

  var c = isObject(conf) || isObject(configuration) ?
    assign$1({}, conf, configuration) : undefined;

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
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    // Next line was optimized for most JS VMs. Please, be careful here!
    var obj = Object.create(descriptor.methods || null);

    merge(obj, descriptor.deepProperties);
    assign$2(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    if (!descriptor.initializers || descriptor.initializers.length === 0) { return obj; }

    if (options === undefined) { options = {}; }
    return descriptor.initializers.filter(isFunction).reduce(function (resultingObj, initializer) {
      var returnedValue = initializer.call(resultingObj, options,
        {instance: resultingObj, stamp: Stamp, args: [options].concat(args)});
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
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return composeImplementation.apply(this, args);
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
  var srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable;
  if (!isObject(srcDescriptor)) { return dstDescriptor; }

  var combineProperty = function (propName, action) {
    if (!isObject(srcDescriptor[propName])) { return; }
    if (!isObject(dstDescriptor[propName])) { dstDescriptor[propName] = {}; }
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

var assign = Object.assign;

function createUtilityFunction(propName, action) {
  return function composeUtil() {
    var i = arguments.length, argsArray = Array(i);
    while ( i-- ) argsArray[i] = arguments[i];

    var descriptor = {};
    descriptor[propName] = action.apply(void 0, [ {} ].concat( argsArray ));
    return ((this && this.compose) || stampit).call(this, descriptor);
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

  args = args.filter(isObject)
    .map(function (arg) { return isStamp(arg) ? arg : standardiseDescriptor(arg); });

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

function observable (...properties$$1) {
  return init(function () {
    const listeners = {};

    if (!this.$onChange || !this.$on) {
      this.$onChange = (prop, newVal) => {
        const ls = listeners[prop] || [];
        for (const cb of ls) {
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

    for (const prop of properties$$1) {
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
  const ariaAttributes = attributes.map(attr=>['aria', attr].join('-'));
  return compose(
    mandatoryEl,
    observable(prop),
    init(function () {
      this.$on(prop, newVal => {
          for (const att of ariaAttributes){
            this.el.setAttribute(att,newVal);
          }
      });
    })
  );
}

const abstractListMediatorStamp = init(function ({items = []}) {
  Object.defineProperty(this, 'items', {value: items});
})
  .methods({
    addItem(item){
      this.items.push(item);
    },
    selectItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        for (const i of this.items) {
          i.isSelected = i === item;
        }
      }
    },
    selectNextItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        const newIndex = index === this.items.length - 1 ? 0 : index + 1;
        this.selectItem(this.items[newIndex]);
      }
    },
    selectPreviousItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        const newIndex = index === 0 ? this.items.length - 1 : index - 1;
        this.selectItem(this.items[newIndex]);
      }
    }
  });

const listItemStamp = init(function ({listMediator, isOpen}) {
  if (!listMediator) {
    throw new Error('you must provide a listMediator to the listItem');
  }
  this.isOpen = this.isOpen ? this.isOpen : isOpen === true;
  Object.defineProperty(this, 'listMediator', {value: listMediator});
  listMediator.addItem(this);
})
  .methods({
    toggle(){
      this.listMediator.toggleItem(this);
    },
    select(){
      this.listMediator.selectItem(this);
    },
    selectPrevious(){
      this.listMediator.selectPreviousItem(this);
    },
    selectNext(){
      this.listMediator.selectNextItem(this);
    },
  });

const multiSelectMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem(item){
    const index = this.items.indexOf(item);
    if (index !== -1) {
      item.isOpen = !item.isOpen;
    }
  }
}));

const listMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem(item){
    for (const i of this.items) {
      i.isOpen = i === item ? !i.isOpen : false;
    }
    return this;
  }
}));

const mandatoryElement = element();
const tablist = ariaElement({ariaRole: 'tablist'});

const accordionTabEventBinding = init(function () {
  this.el.addEventListener('click', event=> {
    this.toggle();
    this.select();
  });

  this.el.addEventListener('keydown', event => {
    const {keyCode:k, target} = event;
    if (k === 13 || k === 32) {
      if (target.tagName !== 'BUTTON' || target.tagName === 'A') {
        this.toggle();
        this.select();
      }
    } else if (k === 37 || k === 38) {
      this.selectPrevious();
    } else if (k === 39 || k === 40) {
      this.selectNext();
    }
  });
});
const accordionTabpanelEventBinding = init(function () {
  this.el.addEventListener('focusin', event => {
    this.tab.select();
  });
  this.el.addEventListener('click', event=> {
    this.tab.select();
  });
});

const accordionTabpanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  methods({
    hasFocus(){
      return this.el.querySelector(':focus') !== null;
    }
  }),
  init(function initializeAccordionTabpanel({tab}) {
    Object.defineProperty(this, 'tab', {value: tab});
  }),
  accordionTabpanelEventBinding
);

const accordionTabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItemStamp,
  mapToAria('isOpen','expanded'),
  mapToAria('isSelected','selected'),
  init(function initializeAccordionTab({tabpanelEl}) {
    const tabpanel = accordionTabpanelStamp({el: tabpanelEl, tab: this});
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});
    this.$on('isOpen', isOpen => {
      this.tabpanel.el.setAttribute('aria-hidden', !isOpen);
    });

    this.$on('isSelected', isSelected=> {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected && !this.tabpanel.hasFocus()) {
        this.el.focus();
      }
    });

    this.isOpen = this.isOpen || !!this.el.getAttribute('aria-expanded');
  }),
  accordionTabEventBinding
);





function accordion () {
  return compose(mandatoryElement,
    multiSelectMediatorStamp,
    init(function initializeAccordionTablist() {
      Object.defineProperty(this, 'tablist', {
        value: tablist({
          el: this.el.querySelector('[role=tablist]') || this.el
        })
      });
      this.tablist.el.setAttribute('aria-multiselectable', true);
      for (const tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if(!controlledId){
          console.log(tab);
          throw new Error('for the accordion tab element above, you must specify which tabpanel is controlled using aria-controls');
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if(!tabpanelEl){
          console.log(tab);
          throw new Error(`for the tab element above, could not find the related tabpanel with the id ${controlledId}`)
        }
        accordionTabStamp({tabpanelEl, el: tab, listMediator: this});
      }
    }));
}

const accordionFactory = accordion();
accordionFactory({el:document.getElementById('accordions-sample')});

}());
