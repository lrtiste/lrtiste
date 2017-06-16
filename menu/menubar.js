import menuFactory from './menu';
import dropdown from '../dropdown/dropdown';
import {horizontalMenuItem} from './menuItem';

const horizontalMenu = menuFactory(horizontalMenuItem);


const regularSubMenu = ({index, menu}) => menu.item(index);

const dropDownSubMenu = ({index, element, menu}) => {
  const subMenuComp = dropdown({element});
  menu.onActiveItemChange(({activeItem}) => {
    if (activeItem !== index) {
      subMenuComp.expander().attr('tabindex', '-1');
      subMenuComp.collapse();
    } else {
      subMenuComp.attr('tabindex', '-1');
      subMenuComp.expander().attr('tabindex', '0');
      subMenuComp.expander().element().focus();
    }
  });
  return subMenuComp;
};

const createSubMenuComponent = (arg) => {
  const {element} =arg;
  return element.querySelector('[role=menu]') !== null ?
    dropDownSubMenu(arg) :
    regularSubMenu(arg);
};

export default  ({element}) => {
  const menubarComp = horizontalMenu({element});
  menubarComp.attr('role', 'menubar');
  const subMenus = Array.from(element.children).map((element, index) => createSubMenuComponent({
    index,
    element,
    menu: menubarComp
  }));

  menubarComp.refresh();

  return Object.assign({}, menubarComp, {
    item(index){
      return subMenus[index];
    },
    clean(){
      menubarComp.clean();
      subMenus.forEach(sm => sm.clean());
    }
  });
};