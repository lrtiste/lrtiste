import itemList  from '../common/singleActiveItemList';
import elementComp from '../common/element';
import {emitter as createEmitter} from 'smart-table-events';
import {isArrowLeft, isArrowRight} from '../common/util';

function tabFactory ({element, index, tablist}) {
  const comp = elementComp({element});
  comp.onclick(() => tablist.activateItem(index));
  comp.onkeydown(ev => {
    if (isArrowLeft(ev)) {
      tablist.activatePreviousItem();
    } else if (isArrowRight(ev)) {
      tablist.activateNextItem();
    }
  });

  tablist.onActiveItemChange(({activeItem}) => {
    comp.attr('aria-selected', activeItem === index);
    comp.attr('tabindex', activeItem === index ? '0' : '-1');
    if (activeItem === index) {
      element.focus();
    }
  });
  return comp;
}

function tabPanelFactory ({element, index, tablist}) {
  const comp = elementComp({element});

  tablist.onActiveItemChange(({activeItem}) => {
    comp.attr('aria-hidden', activeItem !== index);
  });

  return comp;
}

export default function ({element}) {

  const emitter = createEmitter();

  const tablistEl = element.querySelector('[role=tablist]');

  if (!tablistEl) {
    console.log(element);
    throw new Error('could not find an element with the role tablist in the element above');
  }

  const pairs = [...tablistEl.querySelectorAll('[role=tab]')].map(tab => {
    const tabPanelId = tab.getAttribute('aria-controls') || '';
    const tabpanel = element.querySelector(`#${tabPanelId}`);
    if (!tabpanel) {
      console.log(tab);
      throw new Error('could not find the tabpanel associate to the tab above. Are you missing the aria-controls attribute ?');
    }
    return {tab, tabpanel};
  });

  const tabListComp = elementComp({emitter, element});
  const itemListComp = itemList({emitter, itemCount: pairs.length});

  const tabs = pairs.map((pair, index) => {
    return {
      tab: tabFactory({element: pair.tab, tablist: itemListComp, index}),
      tabPanel: tabPanelFactory({element: pair.tabpanel, tablist: itemListComp, index})
    };
  });

  itemListComp.refresh();

  return Object.assign({}, tabListComp, itemListComp, {
    tabPanel(index){
      return tabs[index].tabPanel;
    },
    tab(index){
      return tabs[index].tab;
    },
    clean(){
      itemListComp.off();
      tabListComp.clean();
      tabs.forEach(({tab, tabPanel}) => {
        tab.clean();
        tabPanel.clean();
      })
    }
  });
}