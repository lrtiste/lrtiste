import {ariaElement, element} from '../behaviours/elements';
import {compose, init, methods} from 'stampit';
import {mapToAria} from '../behaviours/observables';
import {toggle} from '../behaviours/toggle';
import {multiSelectListMediator, listItem} from '../behaviours/listMediators';

const mandatoryElement = element();
const tablist = ariaElement({ariaRole: 'tablist'});

const accordionTabEventBinding = init(function () {
  this.el.addEventListener('click', event => {
    this.toggle();
    this.select();
  });

  this.el.addEventListener('keydown', event => {
    const {key: k, code, target} = event;
    if (k === 'Enter' || code === 'Space') {
      if (target.tagName !== 'BUTTON' || target.tagName === 'A') {
        this.toggle();
        this.select();
        event.preventDefault();
      }
    } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowRight' || k === 'ArrowDown') {
      this.selectNext();
      event.preventDefault();
    }
  });
});
const accordionTabpanelEventBinding = init(function () {
  this.el.addEventListener('focusin', event => {
    this.tab.select();
  });
  this.el.addEventListener('click', event => {
    this.tab.select();
  });
});

const accordionTabpanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  toggle(),
  methods({
    hasFocus() {
      return this.el.querySelector(':focus') !== null;
    }
  }),
  mapToAria('isOpen', '!hidden'),
  init(function initializeAccordionTabpanel ({tab}) {
    Object.defineProperty(this, 'tab', {value: tab});
  }),
  accordionTabpanelEventBinding
);

const accordionTabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItem,
  mapToAria('isOpen', 'expanded'),
  mapToAria('isSelected', 'selected'),
  init(function initializeAccordionTab ({tabpanelEl}) {
    const tabpanel = accordionTabpanelStamp({el: tabpanelEl, tab: this});
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});
    this.$on('isOpen', isOpen => {
      this.tabpanel.toggle();
    });

    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected && !this.tabpanel.hasFocus()) {
        this.el.focus();
      }
    });

    this.isSelected = this.el.getAttribute('aria-selected') == 'true' ||
      this.el.getAttribute('tabindex') === '0';
    this.isOpen = this.el.getAttribute('aria-expanded') === 'true';
    this.tabpanel.isOpen = this.isOpen;
  }),
  accordionTabEventBinding
);

export function accordionTab () {
  return accordionTabStamp;
}

export function accordionPanel () {
  return accordionTabpanelStamp;
}

export function accordion () {
  return compose(
    mandatoryElement,
    multiSelectListMediator,
    init(function initializeAccordionTablist () {
      Object.defineProperty(this, 'tablist', {
        value: tablist({
          el: this.el.querySelector('[role=tablist]') || this.el
        })
      });
      this.tablist.el.setAttribute('aria-multiselectable', true);
      for (let tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(tab);
          throw new Error(
            'for the accordion tab element above, you must specify which tabpanel is controlled using aria-controls'
          );
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if (!tabpanelEl) {
          console.log(tab);
          throw new Error(
            `for the tab element above, could not find the related tabpanel with the id ${controlledId}`
          );
        }
        accordionTabStamp({tabpanelEl, el: tab, listMediator: this});
      }
    })
  );
}
