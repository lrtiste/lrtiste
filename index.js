import { accordion, accordionTab, accordionPanel } from './components/accordions';
import { tabList, tab, tabPanel } from './components/tabs';
import { dropdown, menubar, expandable } from './components/menus';
import { tooltip } from './components/tooltips';
import { element, ariaElement } from './behaviours/elements';
import { listMediatorStamp, multiSelectMediatorStamp, listItemStamp } from './behaviours/listMediators';
import { observable, mapToAria } from './behaviours/observables';
import { toggle } from './behaviours/toggle';
import { default as stampit } from 'stampit';

const components = {
  accordionPanel,
  accordionTab,
  accordion,
  tabList,
  tab,
  tabPanel,
  dropdown,
  menubar,
  tooltip,
  // slider,
  // rangeSlider
  expandable
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

export { components, behaviours, stampit };
