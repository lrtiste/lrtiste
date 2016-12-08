import {accordion} from './components/accordions';
import {tabList} from './components/tabs';
import {dropdown, menubar, expandable} from './components/menus';
import {element, ariaElement} from './behaviours/elements';
import {listMediatorStamp, multiSelectMediatorStamp, listItemStamp} from './behaviours/listMediators'
import {observable, mapToAria} from './behaviours/observables'
import {toggle} from './behaviours/toggle'

const components = {
  accordion,
  tabList,
  dropdown,
  menubar,
  expandable
  // slider,
  // rangeSlider
};

const behaviours = {
  element,
  ariaElement,
  listMediator: listMediatorStamp,
  multiSelectListMediator: multiSelectMediatorStamp,
  listItem: listItemStamp,
  observable,
  mapToAria,
  toggle
};

export {components, behaviours};


