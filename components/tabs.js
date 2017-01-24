import {ariaElement, element} from '../behaviours/elements';
import {listMediator, listItem} from '../behaviours/listMediators';
import {compose, init} from 'stampit';
import {toggle} from '../behaviours/toggle';
import {mapToAria} from '../behaviours/observables';

const mandatoryElement = element();
const tablist = ariaElement({ariaRole: 'tablist'});

const tabEventBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'ArrowLeft' || k === 'ArrowUp') {
      this.selectPrevious();
      event.preventDefault();
    } else if (k === 'ArrowDown' || k === 'ArrowRight') {
      this.selectNext();
      event.preventDefault();
    }
  });
  this.el.addEventListener('click', event => {
    this.select();
  });
});

const tabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItem,
  mapToAria('isSelected', 'selected'),
  init(function initializeTab ({tabpanel}) {
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});
    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected !== this.tabpanel.isOpen) {
        this.tabpanel.toggle();
      }
      if (isSelected) {
        this.el.focus();
      }
    });
    this.isSelected = this.el.getAttribute('aria-selected') === 'true';
    this.tabpanel.isOpen = this.isSelected;
  }),
  tabEventBinding
);

const tabPanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'}),
  toggle(),
  mapToAria('isOpen', '!hidden')
);

export function tabPanel () {
  return tabPanelStamp;
}

export function tab () {
  return tabStamp;
}

export function tabList ({tabpanelFactory = tabPanelStamp, tabFactory = tabStamp} = {}) {
  return compose(
    mandatoryElement,
    listMediator,
    init(function initializeTablist () {
      Object.defineProperty(this, 'tablist', {
        value: tablist({
          el: this.el.querySelector('[role=tablist]') || this.el
        })
      });
      for (let tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if (!controlledId) {
          console.log(tab);
          throw new Error(
            'for the tab element above, you must specify which tabpanel is controlled using aria-controls'
          );
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if (!tabpanelEl) {
          console.log(tab);
          throw new Error(
            `for the tab element above, could not find the related tabpanel with the id ${controlledId}`
          );
        }
        const tabpanel = tabpanelFactory({el: tabpanelEl});
        tabFactory({el: tab, listMediator: this, tabpanel});
      }
    })
  );
}
