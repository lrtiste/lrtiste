import itemList from '../common/singleActiveItemList';
import {verticalMenuItem} from './menuItem'
import elementFactory from '../common/element';
import {emitter as createEmitter} from 'smart-table-events';

export default function (menuItemFactory = verticalMenuItem) {
  return function menu ({element}) {
    const emitter = createEmitter();
    const menuItems = [...element.children].filter(child => child.getAttribute('role') === 'menuitem');
    const listComp = itemList({emitter, itemCount: menuItems.length});
    const menuComp = elementFactory({element, emitter});

    menuComp.attr('role','menu');

    const menuItemComps = menuItems.map((element, index) => menuItemFactory({menu: listComp, element, index}));

    return Object.assign({},listComp,menuComp, {
      item(index){
        return menuItemComps[index];
      },
      clean(){
        listComp.off();
        menuComp.clean();
        menuItemComps.forEach(comp=>{
          comp.clean();
        });
      }
    });
  };
}

