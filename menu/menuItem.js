import elementComp from '../common/element';

function createMenuItem ({previousKey, nextKey}) {
  return function menuItem ({menu, element, index}) {
    const comp = elementComp({element});
    comp.attr('role', 'menuitem');
    comp.onclick(() => {
      menu.activateItem(index);
    });
    comp.onkeydown((ev) => {
      const {key} =ev;
      if (key === nextKey) {
        menu.activateNextItem();
        ev.preventDefault();
      } else if (key === previousKey) {
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

export const verticalMenuItem = createMenuItem({previousKey: 'ArrowUp', nextKey: 'ArrowDown'});
export const horizontalMenuItem = createMenuItem({previousKey: 'ArrowLeft', nextKey: 'ArrowRight'});