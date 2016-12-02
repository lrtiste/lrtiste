import {menubar} from '../../../../components/menus'

const factory = menubar();
factory({el: document.querySelector('[role=menubar]')});
