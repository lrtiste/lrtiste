import {generateRandomId as idGenerator, isSelectedPredicate} from '../common/utils.js';
import ChangeEvent from '../common/change-event.js';

const generateRandomId = idGenerator('listbox-option');

const template = document.createElement('template');
template.innerHTML = `<style>:host{position:relative}</style>
<slot name="options"></slot>
`;

/**
 * @desc Implements the ListBox pattern for single select ListBox where the focus follows the selection.
 *
 * Keyboard interaction is handled for <kbd>Up Arrow</kbd>, <kbd>Down Arrow</kbd>, <kbd>Home</kbd> and <kbd>End</kbd>. In the same way if an option is clicked, then it becomes selected
 *
 * @see https://www.w3.org/TR/wai-aria-practices/#Listbox
 * @example
 * <ui-listbox>
 *     <ui-listbox-option><span>Some custom template</span></ui-listbox-option>
 *     <ui-listbox-option selected>Other option selected by default</ui-listbox-option>
 * </ui-listbox>
 *
 * <script type="module">
 *     import {ListBox, ListBoxOption} from 'path/to/lib'
 *
 *     customElements.define('ui-listbox', ListBox);
 *     customElements.define('ui-listbox-option', ListBoxOption);
 * </script>
 */
export class ListBox extends HTMLElement {

    /** @protected */
    static get observedAttributes() {
        return ['aria-activedescendant'];
    }

    /**
     * @returns {ListBoxOption|null} The currently selected ListBoxOption element
     */
    get selectedOption() {
        return this._optionElements.filter(isSelectedPredicate)[0] || null;
    }

    /**
     * @returns {number} - The current number of available options
     */
    get length() {
        return this._optionElements.length;
    }

    /**
     * @returns {number} The index of the currently selected option, -1 if none is selected
     */
    get selectedIndex() {
        return this._optionElements.findIndex(isSelectedPredicate);
    }

    /**
     * @desc Reflects on ``aria-activedescendant`` attribute
     * @param {Number} index - The index of the new option element to select
     * @emits {ChangeEvent}
     * @example
     * const listbox = document.getElementId('some listbox id');
     * listbox.addEventListener('change', ev => {
     *     console.log(ev.selectedIndex);
     * })
     *
     * listbox.selectedIndex = 0; // select first option;
     * listbox.selectedIndex = 1; // select second option;
     *
     * //etc
     *
     * listbox.selectedIndex = -1; // unselect all
     *
     */
    set selectedIndex(index) {
        const options = this._optionElements;
        if (index < 0 || index >= options.length) {
            this.setAttribute('aria-activedescendant', '');
        } else {
            this.setAttribute('aria-activedescendant', options[index].getAttribute('id'));
        }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'aria-activedescendant' && oldValue !== newValue) {
            for (const el of this._optionElements) {
                el.setAttribute('aria-selected', String(newValue === el.getAttribute('id')));
            }

            if (this.selectedOption) {
                const {offsetTop, offsetHeight} = this.selectedOption;

                //before
                if (offsetTop < this.scrollTop) {
                    /** @protected*/
                    this.scrollTop = offsetTop;
                } else if ((offsetTop + offsetHeight) > (this.scrollTop + this.clientHeight)) {
                    // after
                    this.scrollBy(0, (offsetTop + offsetHeight) - (this.scrollTop + this.clientHeight));
                }
            }

            this.dispatchEvent(new ChangeEvent(this.selectedIndex));
        }
    }

    constructor() {
        super();
        /**
         * @type {ListBoxOption[]}
         * @private
         */
        this._optionElements = [];
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._handleOptionChangeEvent = this._handleOptionChangeEvent.bind(this);
        this._handleKeydownEvent = this._handleKeydownEvent.bind(this);
        this._handleOptionClick = this._handleOptionClick.bind(this);
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'listbox');

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }

        this.shadowRoot
            .querySelector('slot[name=options]')
            .addEventListener('slotchange', this._handleOptionChangeEvent);

        this.addEventListener('keydown', this._handleKeydownEvent);
    }

    /** @private */
    _handleOptionClick(ev) {
        const {currentTarget: option} = ev;
        const index = this._optionElements.indexOf(option);
        if (index !== -1) {
            this.selectedIndex = index;
        }
    }

    /** @private */
    _handleOptionChangeEvent(ev) {
        this._optionElements = this.shadowRoot
            .querySelector('slot')
            .assignedNodes()
            .filter(el => el.getAttribute('role') === 'option');

        for (const opt of this._optionElements) {
            if (!opt.hasAttribute('id')) {
                opt.setAttribute('id', generateRandomId());
            }
            opt.addEventListener('click', this._handleOptionClick);
        }

        this.selectedIndex = this._optionElements.findIndex(i => i.hasAttribute('selected'));
    }

    /** @private */
    _handleKeydownEvent(ev) {
        const {key} = ev;
        if (['ArrowDown', 'ArrowUp', 'End', 'Home'].includes(key)) {
            switch (key) {
                case 'ArrowDown': {
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
                    break;
                }
                case 'ArrowUp': {
                    this.selectedIndex = this.selectedOption !== null ? Math.max(this.selectedIndex - 1, 0)
                        : this.length - 1;
                    break;
                }
                case 'Home': {
                    this.selectedIndex = this.length ? 0 : -1;
                    break;
                }
                case 'End': {
                    this.selectedIndex = this.length - 1;
                    break;
                }
            }
            ev.preventDefault();
        }
    }
}