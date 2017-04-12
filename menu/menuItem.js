import elementComp from '../common/element';
import * as checkKeys from '../common/util';

function createMenuItem ({previousKey, nextKey}) {
  return function menuItem ({menu, element, index}) {
    const comp = elementComp({element});
    comp.attr('role', 'menuitem');
    comp.onclick(() => {
      menu.activateItem(index);
    });
    comp.onkeydown((ev) => {
      if (checkKeys[nextKey](ev)) {
        menu.activateNextItem();
        ev.preventDefault();
      } else if (checkKeys[previousKey](ev)) {
        menu.activatePreviousItem();
        ev.preventDefault();
      }
    });

    menu.onActiveItemChange(({activeItem}) => {
      if (activeItem === index) {
        activated();
      } else {
        deactivated();
      }
    });

    const activated = () => {
      comp.attr('tabindex', '0');
      element.focus();
    };

    const deactivated = () => {
      comp.attr('tabindex', '-1');
    };
    return comp;
  }

}

export const verticalMenuItem = createMenuItem({previousKey: 'isArrowUp', nextKey: 'isArrowDown'});
export const horizontalMenuItem = createMenuItem({previousKey: 'isArrowLeft', nextKey: 'isArrowRight'});