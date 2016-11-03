import {tabList, tab} from '../lib/tabs';
import {ariaElement} from '../lib/element';
import {default as stampit} from 'stampit';
import {observable} from '../lib/observable';

const tabStamp = ariaElement('tab');

const observableTabPanelStamp = stampit.compose(ariaElement('tabpanel'), observable('isOpen'), tab());
const tabPanelEventBindingStamp = stampit.init(function () {
  const labelId = this.el.getAttribute('aria-labelledby');
  const tabEl = document.getElementById(labelId);
  if (!tabEl) {
    throw new Error('missing the element with the role[tab] controlling the tab panel');
  }
  let controlling = null;
  if(this.el.id){
    controlling = tabEl.getAttribute('aria-controls') === this.el.id ? tabEl : tabEl.querySelector(`[aria-controls="${this.el.id}"]`) ;
  }
  const toggler = controlling || tabEl;

  const tab = tabStamp({el: tabEl});
  Object.defineProperty(this, 'tab', {value: tab});

  this.$on('isOpen', isOpen => {
    this.el.setAttribute('aria-hidden', !isOpen);
    this.tab.el.setAttribute('aria-selected', isOpen);
    this.tab.el.setAttribute('aria-expanded', isOpen);
  });

  toggler.addEventListener('click', event => {
    this.toggle();
  });
});

const tabPanelStamp = stampit.compose(observableTabPanelStamp, tabPanelEventBindingStamp);


export function accordionItem () {
  return tabPanelStamp;
}

export function accordion (itemStamp = tabPanelStamp) {
  return stampit.compose(tabList(), ariaElement('tablist'), stampit.init(function () {
    const tabPanels = [...this.el.querySelectorAll('[role="tabpanel"]')].map(tabPanelEl => itemStamp({
      el: tabPanelEl,
      tabList: this
    }));
  }));
}