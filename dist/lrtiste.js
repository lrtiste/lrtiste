(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lrtiste = global.lrtiste || {})));
}(this, (function (exports) { 'use strict';

function emitter () {

  const listenersLists = {};

  return {
    on(event, ...listeners){
      listenersLists[event] = (listenersLists[event] || []).concat(listeners);
      return this;
    },
    dispatch(event, ...args){
      const listeners = listenersLists[event] || [];
      for (let listener of listeners) {
        listener(...args);
      }
      return this;
    },
    off(event, ...listeners){
      if (!event) {
        Object.keys(listenersLists).forEach(ev => this.off(ev));
      } else {
        const list = listenersLists[event] || [];
        listenersLists[event] = listeners.length ? list.filter(listener => !listeners.includes(listener)) : [];
      }
      return this;
    }
  }
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
        return this;
      };
    }

    return Object.assign(proxy, {
      off(ev){
        if (!ev) {
          Object.keys(eventListeners).forEach(eventName => this.off(eventName));
        }

        if (eventListeners[ev]) {
          emitter.off(ev, ...eventListeners[ev]);
        }

        return this;
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

var elementFactory = function ({element, emitter: emitter$$1 = createEmitter$1()}) {

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
      return element
    },
    attr(attributeName, value){
      if (value === undefined) {
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

const {proxyListener: proxyListener$$1, emitter:createEmitter} = events;

const EXPANDED_CHANGED = 'EXPANDED_CHANGED';
const proxy = proxyListener$$1({[EXPANDED_CHANGED]: 'onExpandedChange'});

function expandableFactory ({emitter: emitter$$1 = createEmitter(), expanded}) {
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
}

function expandable$1 ({expandKeys = ['ArrowDown'], collapseKey = ['ArrowUp']} = {}) {
  return function ({element}) {
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
      const {key, code} =ev;
      if (key === 'Enter' || code === 'Space') {
        expandableComp.toggle();
        ev.preventDefault();
      } else if (collapseKey.indexOf(key) !== -1) {
        expandableComp.collapse();
        ev.preventDefault();
      } else if (expandKeys.indexOf(key) !== -1) {
        expandableComp.expand();
        ev.preventDefault();
      }
    });

    expanderComp.onclick(expandableComp.toggle);

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
  }
}

const {proxyListener: proxyListener$3, emitter:createEmitter$2} = events;

const ACTIVE_ITEM_CHANGED = 'ACTIVE_ITEM_CHANGED';
const proxy$1 = proxyListener$3({[ACTIVE_ITEM_CHANGED]: 'onActiveItemChange'});

function listComponent ({emitter: emitter$$1 = createEmitter$2(), activeItem = 0, itemCount}) {
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
}

function tabFactory ({element, index, tablist}) {
  const comp = elementFactory({element});
  comp.onclick(() => tablist.activateItem(index));
  comp.onkeydown(({key}) => {
    if (key === 'ArrowLeft') {
      tablist.activatePreviousItem();
    } else if (key === 'ArrowRight') {
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
}

function tabPanelFactory ({element, index, tablist}) {
  const comp = elementFactory({element});

  tablist.onActiveItemChange(({activeItem}) => {
    comp.attr('aria-hidden', activeItem !== index);
  });

  return comp;
}

var tablistFactory = function ({element}) {

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
  const itemListComp = listComponent({emitter: emitter$$1, itemCount: pairs.length});

  const tabs = pairs.map((pair, index) => {
    return {
      tab: tabFactory({element: pair.tab, tablist: itemListComp, index}),
      tabPanel: tabPanelFactory({element: pair.tabpanel, tablist: itemListComp, index})
    };
  });

  itemListComp.refresh();

  return Object.assign({},tabListComp,itemListComp, {
    tabPanel(index){
      return tabs[index].tabPanel;
    },
    tab(index){
      return tabs[index].tab;
    },
    clean(){
      itemListComp.off();
      tabListComp.clean();
      tabs.forEach(({tab,tabPanel})=>{
        tab.clean();
        tabPanel.clean();
      });
    }
  });
};

function createMenuItem ({previousKey, nextKey}) {
  return function menuItem ({menu, element, index}) {
    const comp = elementFactory({element});
    comp.attr('role', 'menuitem');
    comp.onclick(() => menu.activateItem(index));
    comp.onkeydown((ev) => {
      const {key} =ev;
      if (key === nextKey) {
        menu.activateNextItem();
        ev.preventDefault();
      } else if (key === previousKey) {
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
  }

}

const verticalMenuItem = createMenuItem({previousKey: 'ArrowUp', nextKey: 'ArrowDown'});
const horizontalMenuItem = createMenuItem({previousKey: 'ArrowLeft', nextKey: 'ArrowRight'});

var menuFactory = function (menuItemFactory = verticalMenuItem) {
  return function menu ({element}) {
    const emitter$$1 = emitter();
    const menuItems = [...element.children].filter(child => child.getAttribute('role') === 'menuitem');
    const listComp = listComponent({emitter: emitter$$1, itemCount: menuItems.length});
    const menuComp = elementFactory({element, emitter: emitter$$1});

    menuComp.attr('role','menu');

    const menuItemComps = menuItems.map((element, index) => menuItemFactory({menu: listComp, element, index}));

    return Object.assign({},listComp,menuComp, {
      item(index){
        return menuItemComps[index];
      },
      clean(){
        listComp.off();
        menuComp.clean();
        menuItemComps.forEach(comp=>{
          comp.clean();
        });
      }
    });
  };
};

const verticalMenu = menuFactory();
const expandable$2 = expandable$1();

function dropdown$1 ({element}) {
  const expandableComp = expandable$2({element});
  expandableComp.expander().attr('aria-haspopup', 'true');
  const menuComp = verticalMenu({element: expandableComp.expandable().element()});

  expandableComp.onExpandedChange(({expanded}) => {
    if (expanded) {
      menuComp.activateItem(0);
    }
  });

  menuComp.onkeydown(ev => {
    const {key}=ev;
    if (key === 'Escape') {
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
}

const horizontalMenu = menuFactory(horizontalMenuItem);


function regularSubMenu ({index, menu}) {
  return menu.item(index);
}

function dropDownSubMenu ({index, element, menu}) {
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
}

function createSubMenuComponent (arg) {
  const {element} =arg;
  return element.querySelector('[role=menu]') !== null ?
    dropDownSubMenu(arg) :
    regularSubMenu(arg);
}

function menubar$1 ({element}) {
  const menubarComp = horizontalMenu({element});
  menubarComp.attr('role', 'menubar');
  const subMenus = [...element.children].map((element, index) => createSubMenuComponent({
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
}

const expandable$3 = expandable$1({expandKeys: [], collapseKey: []});

function accordion$1 ({element}) {
  const emitter$$1 = emitter();
  const accordionHeaders = element.querySelectorAll('[data-lrtiste-accordion-header]');
  const itemListComp = listComponent({itemCount: accordionHeaders.length});
  const containerComp = elementFactory({element, emitter: emitter$$1});

  const expandables = [...accordionHeaders].map(element => expandable$3({element}));

  expandables.forEach((exp, index) => {
    // let expanded
    const expander = exp.expander();
    expander.onkeydown(ev => {
      const {key} =ev;
      if (key === 'ArrowDown') {
        itemListComp.activateNextItem();
        ev.preventDefault();
      } else if (key === 'ArrowUp') {
        itemListComp.activatePreviousItem();
        ev.preventDefault();
      }
    });

    expander.onfocus(ev => {
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
}

const expandable = expandable$1();
const dropdown = dropdown$1;
const tablist = tablistFactory;
const menubar = menubar$1;
const accordion = accordion$1;

exports.expandable = expandable;
exports.dropdown = dropdown;
exports.tablist = tablist;
exports.menubar = menubar;
exports.accordion = accordion;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lrtiste.js.map
