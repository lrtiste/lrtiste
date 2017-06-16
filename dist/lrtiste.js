(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lrtiste = global.lrtiste || {})));
}(this, (function (exports) { 'use strict';

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

const {proxyListener: proxyListener$3, emitter:createEmitter$2} = events;

const ACTIVE_ITEM_CHANGED = 'ACTIVE_ITEM_CHANGED';
const proxy$1 = proxyListener$3({[ACTIVE_ITEM_CHANGED]: 'onActiveItemChange'});

var itemList = ({emitter: emitter$$1 = createEmitter$2(), activeItem = 0, itemCount}) => {
  const state = {activeItem, itemCount};
  const event = proxy$1({emitter: emitter$$1});
  const dispatch = () => emitter$$1.dispatch(ACTIVE_ITEM_CHANGED, Object.assign({}, state));
  const api = {
    activateItem(index){
      state.activeItem = index < 0 ? itemCount - 1 : index % itemCount;
      dispatch();
    },
    activateNextItem(){
      api.activateItem(state.activeItem + 1);
    },
    activatePreviousItem(){
      api.activateItem(state.activeItem - 1);
    },
    refresh(){
      dispatch();
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

  tablist.onActiveItemChange(({activeItem}) => {
    comp.attr('aria-selected', activeItem === index);
    comp.attr('tabindex', activeItem === index ? '0' : '-1');
    if (activeItem === index) {
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

  itemListComp.refresh();

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
const accordion = accordionFactory;
const element = elementFactory;

exports.expandable = expandable;
exports.dropdown = dropdown;
exports.tablist = tablist;
exports.menubar = menubar;
exports.accordion = accordion;
exports.element = element;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lrtiste.js.map
