import ActivateEvent from '../common/activate-event.js';

/**
 * @desc A menu item within a menu. Usually you should register listener to the custom event ``activate-item``
 * @example
 *
 * <ui-dropdown-menu>
 *  <span slot="menu-button.js">Actions</span>
 *  <ui-dropdown-menuitem>action 1</ui-dropdown-menuitem>
 *  <ui-dropdown-menuitem id="custom-id">action 2</ui-dropdown-menuitem>
 *  <ui-dropdown-menuitem><span>templated</span></ui-dropdown-menuitem>
 * </ui-dropdown-menu>
 *
 * <script type="module">
 *  import {DropdownMenu, DropdownMenuitem} from '/path/to/lib.js';
 *
 *  customElements.define('ui-dropdown-menu', DropdownMenu);
 *  customElements.define('ui-dropdown-menuitem', DropdownMenuitem);
 *
 *  document
 *      .querySelectorAll('ui-dropdown-menuitem')
 *      .forEach(item => item.addEventListener('activate-item',
 *          () => console.log(`${item.textContent} activated`))
 *      );
 * </script>
 *
 */
export class Menuitem extends HTMLElement {

    connectedCallback() {
        this.setAttribute('tabindex', '-1');
        this.setAttribute('role', 'menuitem');
        this.closest('[role=menu]').addItem(this);
        this.addEventListener('click', this.activate.bind(this));
        this.addEventListener('keydown',ev => {
            const {key} = ev;
            if(key===' ' || key === 'Enter'){
                this.activate();
            }
        })
    }

    /**
     * activate the item
     * @Emits {ActivateEvent}
     */
    activate() {
        this.dispatchEvent(new ActivateEvent(this));
    }
}