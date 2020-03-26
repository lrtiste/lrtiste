import {ListBox, ListBoxOption} from '../src/listbox/index.js';
import {Tab, TabPanel, TabSet} from '../src/tabs/index.js';
import {Dropdown, Menuitem} from '../src/dropdown-menu/index.js';

export const wait = (time = 50) => new Promise(resolve => {
    setTimeout(() => resolve(), time);
});

export const nextTick = () => wait(0);

export const body = document.querySelector('body');
export const LIST_BOX_TAG_NAME = 'test-listbox';
export const LIST_BOX_OPTION_TAG_NAME = 'test-listbox-option';
export const TAB_TAG_NAME = 'test-tab';
export const TAB_PANEL_TAG_NAME = 'test-tabpanel';
export const TAB_SET_TAG_NAME = 'test-tabset';
export const DROPDOWN_MENU_TAG_NAME = 'test-dropdown-menu';
export const DROPDOWN_MENUITEM_TAG_NAME = 'test-dropdown-menuitem';
customElements.define(LIST_BOX_OPTION_TAG_NAME, ListBoxOption);
customElements.define(LIST_BOX_TAG_NAME, ListBox);
customElements.define(TAB_TAG_NAME, Tab);
customElements.define(TAB_PANEL_TAG_NAME, TabPanel);
customElements.define(TAB_SET_TAG_NAME, TabSet);
customElements.define(DROPDOWN_MENUITEM_TAG_NAME, Menuitem);
customElements.define(DROPDOWN_MENU_TAG_NAME, Dropdown);