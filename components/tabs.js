import {ariaElement, element} from '../behaviours/elements';
import {listMediatorStamp, listItemStamp} from '../behaviours/listMediators';
import {compose, init} from 'stampit';
import {mapToAria} from '../behaviours/observables';

const mandatoryElement = element();
const tablist = ariaElement({ariaRole: 'tablist'});

const tabEventBinding = init(function () {
  this.el.addEventListener('keydown', event=> {
    const {keyCode:k} = event;
    if (k === 37 || k === 38) {
      this.selectPrevious();
    } else if (k === 39 || k === 40) {
      this.selectNext();
    }
  });

  this.el.addEventListener('click', event => {
    this.select();
  });
});

const tabStamp = compose(
  ariaElement({ariaRole: 'tab'}),
  listItemStamp,
  mapToAria('isSelected','selected'),
  init(function initializeTab({tabpanel}) {
    Object.defineProperty(this, 'tabpanel', {value: tabpanel});

    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      this.tabpanel.el.setAttribute('aria-hidden', !isSelected);
      if (isSelected) {
        this.el.focus();
      }
    });

    this.isSelected = this.isSelected || !!this.el.getAttribute('aria-selected');
  }),
  tabEventBinding
);


const tabPanelStamp = compose(
  ariaElement({ariaRole: 'tabpanel'})
);

export function tabPanel () {
  return tabPanelStamp;
}

export function tab () {
  return tabStamp;
}

export function tabList () {
  return compose(
    mandatoryElement,
    listMediatorStamp,
    init(function initializeTablist() {
      Object.defineProperty(this, 'tablist', {value: tablist({el: this.el.querySelector('[role=tablist]') || this.el})});
      for (let tab of this.tablist.el.querySelectorAll('[role=tab]')) {
        const controlledId = tab.getAttribute('aria-controls');
        if(!controlledId){
          console.log(tab);
          throw new Error('for the tab element above, you must specify which tabpanel is controlled using aria-controls');
        }
        const tabpanelEl = this.el.querySelector(`#${controlledId}`);
        if(!tabpanelEl){
          console.log(tab);
          throw new Error(`for the tab element above, could not find the related tabpanel with the id ${controlledId}`)
        }
        const tabpanel = tabPanelStamp({el: tabpanelEl});
        tabStamp({el: tab, listMediator: this, tabpanel});
      }
    })
  );
}
