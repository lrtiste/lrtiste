import expandableFactory from './expandable/expandable';
import tablistFactory from './tablist/tablist';
import dropdownFactory from './dropdown/dropdown';
import menubarFactory from './menu/menubar';
import accordionFactory from './accordion/accordion';
import elementFactory from './common/element';

export const expandable = expandableFactory();
export const dropdown = dropdownFactory;
export const tablist = tablistFactory;
export const menubar = menubarFactory;
export const accordion = accordionFactory;
export const element = elementFactory;