import menu from '../menu/menu';
import expandableFactory from '../expandable/expandable';

const verticalMenu = menu();
const expandable = expandableFactory();

export default function dropdown ({element}) {
  const expandableComp = expandable({element});
  expandableComp.expander().attr('aria-haspopup', 'true');
  const menuComp = verticalMenu({element: expandableComp.expandable().element()});

  expandableComp.onExpandedChange(({expanded}) => {
    if (expanded) {
      menuComp.activateItem(0);
    }
  });

  menuComp.onkeydown(ev => {
    const {key}=ev;
    if (key === 'Escape') {
      expandableComp.collapse();
      expandableComp.expander().element().focus();
    }
  });

  expandableComp.refresh();

  return Object.assign({}, expandableComp, {
    menu(){
      return menuComp;
    },
    clean(){
      expandableComp.clean();
      menuComp.clean();
    }
  });
}