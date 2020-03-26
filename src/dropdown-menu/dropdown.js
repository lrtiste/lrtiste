import {disclosureContainer} from '../disclosure/mixins.js';
import {eventuallySetAttribute, generateRandomId as idGenerator} from '../common/utils.js';

const generateToggleId = idGenerator('toggle');
const generateSectionId = idGenerator('section');

/**
 * @class Dropdown
 */
export default disclosureContainer(class Dropdown extends HTMLElement {

    get preventClose() {
        return this.hasAttribute('prevent-close');
    }

    set toggleButton(button) {
        this._button = button;
        eventuallySetAttribute(button, 'id', generateToggleId());
        button.addEventListener('click', this.toggle.bind(this));
        button.addEventListener('keydown', ev => {
            const {key} = ev;
            if (key === ' ' || key === 'Enter') {
                this.toggle();
                if (this.expanded) {
                    this._section.selectedIndex = 0;
                }
            } else if (key === 'ArrowDown' || key === 'ArrowUp') {
                this.openMenu(key === 'ArrowUp');
            }
        });
    }

    set disclosureSection(section) {
        this._section = section;
        eventuallySetAttribute(section, 'id', generateSectionId());
        eventuallySetAttribute(section, 'aria-labelledBy', this._button.id);
        eventuallySetAttribute(this._button, 'aria-controls', section.id);
        section.addEventListener('keydown', this._handleMenuKeydown.bind(this));
        this._button.expanded = this.expanded;
        section.hidden = !this.expanded;
    }

    connectedCallback() {

        let timer = null;

        this.addEventListener('focusin', () => {
            if (timer) {
                clearTimeout(timer);
            }
        });

        this.addEventListener('focusout', () => {
            timer = setTimeout(() => this.closeMenu(), 100);
        });

        this.addEventListener('activate-item', ev => {
            if (!this.preventClose) {
                this.closeMenu(true);
                ev.stopPropagation();
            }
        });
    }

    openMenu(end = false) {
        this.expanded = true;
        this._section.selectedIndex = end ? this._section.length - 1 : 0;
    }

    closeMenu(focus) {
        this.expanded = false;
        this._section.selectedIndex = -1;
        if (focus) {
            this._button.focus();
        }
    }

    _handleMenuKeydown(ev) {
        const {key} = ev;
        if (key === 'Escape') {
            this.closeMenu(true);
        }
    };
});
