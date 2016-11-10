import {ariaElement} from '../behaviours/elements';
import {compose, init} from 'stampit';
import {tabComponent, tabPanelComponent} from './abstractTab';
import {multiSelectMediatorStamp} from '../behaviours/listMediators';

function accordionPanel () {
  return tabPanelComponent();
}

const defaultAccordionTabPanel = accordionPanel();
function accordionTab ({accordionTabPanel = defaultAccordionTabPanel}={}) {
  return tabComponent({tabPanelComponent: accordionTabPanel});
}

const defaultAccordionTab = accordionTab();
function accordion ({accordionTab = defaultAccordionTab} = {}) {
  return compose(
    ariaElement({ariaRole: 'tablist'}),
    multiSelectMediatorStamp,
    init(function () {

      this.el.setAttribute('aria-multiselectable', true);

      const tabPanels = [...this.el.querySelectorAll('[role=tabpanel]')].map(tp=> {
        return {
          tabId: tp.getAttribute('aria-labelledby'),
          id: tp.id
        };
      });

      for (let tabpanel of tabPanels) {
        const tabEl = document.getElementById(tabpanel.tabId);
        accordionTab({el: tabEl, listMediator: this, tabPanelId: tabpanel.id});
      }
    })
  );
}

export {accordion, accordionTab, accordionPanel}