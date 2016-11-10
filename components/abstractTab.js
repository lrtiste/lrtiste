import {ariaElement} from '../behaviours/elements';
import {compose, init, methods} from 'stampit';
import {observable} from '../behaviours/observables';
import {listItemStamp} from '../behaviours/listMediators';

const tabPanelEventBinding = init(function () {
  this.el.addEventListener('focusin', event => {
    this.tabStamp.select();
  });
  this.el.addEventListener('click', event=> {
    this.tabStamp.select();
  });
});

const ariaTabPanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  init(function ({tab}) {
    if (!tab) {
      throw new Error('you must pass a tab to your tabpanel');
    }
    Object.defineProperty(this, 'tab', {value: tab});
  }),
  methods({
    hasFocus(){
      return this.el.querySelector(':focus') !== null;
    }
  }),
  tabPanelEventBinding
);

const tabEventBinding = init(function () {
  this.toggler.addEventListener('click', event => {
    this.toggle();
    this.select();
  });

  this.toggler.addEventListener('keydown', event=> {
    const {keyCode:k, target} = event;
    if (k === 13 || k === 32) {
      if (target.tagName !== 'BUTTON') {
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

export function tabPanelComponent () {
  return ariaTabPanelStamp;
}

export function tabComponent ({tabPanelComponent = ariaTabPanelStamp}) {
  return compose(
    ariaElement({ariaRole: 'tab'}),
    listItemStamp,
    observable('isOpen', 'isSelected'),
    init(function ({tabPanelId}) {
      const tabPanelEl = document.getElementById(tabPanelId);
      if (!tabPanelEl) {
        throw new Error(`could not find the tabpanel related to ${tabPanelId}`);
      }
      const toggler = this.el.querySelector(`[aria-controls="${tabPanelId}"`) || this.el;
      const tabPanel = tabPanelComponent({el: tabPanelEl, tab: this});

      Object.defineProperty(this, 'tabpanel', {value: tabPanel});
      Object.defineProperty(this, 'toggler', {value: toggler});

      this.$on('isOpen', isOpen => {
        this.el.setAttribute('aria-expanded', isOpen);
        this.tabpanel.el.setAttribute('aria-hidden', !isOpen);
      });
      this.$on('isSelected', isSelected => {
        this.el.setAttribute('aria-selected', isSelected);
        toggler.setAttribute('tabindex', isSelected ? 0 : -1);

        if (isSelected && !this.tabpanel.hasFocus()) {
          toggler.focus();
        }
      });

      this.isOpen = this.isOpen || !!this.el.getAttribute('aria-expanded');
    }),
    tabEventBinding
  );
}

