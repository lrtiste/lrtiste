import elementFactory from '../common/element';
import itemList from '../common/singleActiveItemList';
import {emitter as createEmitter} from 'smart-table-events';
import expandableFactory from '../expandable/expandable';

const expandable = expandableFactory({expandKeys: [], collapseKey: []});

export default function accordion ({element}) {
  const emitter = createEmitter();
  const accordionHeaders = element.querySelectorAll('[data-lrtiste-accordion-header]');
  const itemListComp = itemList({itemCount: accordionHeaders.length});
  const containerComp = elementFactory({element, emitter});

  const expandables = [...accordionHeaders].map(element => expandable({element}));

  expandables.forEach((exp, index) => {
    // let expanded
    const expander = exp.expander();
    expander.onkeydown(ev => {
      const {key} =ev;
      if (key === 'ArrowDown') {
        itemListComp.activateNextItem();
        ev.preventDefault();
      } else if (key === 'ArrowUp') {
        itemListComp.activatePreviousItem();
        ev.preventDefault();
      }
    });

    expander.onfocus(ev => {
      itemListComp.activateItem(index);
    });

    itemListComp.onActiveItemChange(({activeItem}) => {
      if (activeItem === index) {
        exp.expander().element().focus();
      }
    });
  });

  return Object.assign({}, itemListComp, containerComp, {
    section(index){
      return expandables[index]
    },
    clean(){
      itemListComp.off();
      containerComp.clean();
      expandables.forEach(item => item.clean());
    }
  });
}