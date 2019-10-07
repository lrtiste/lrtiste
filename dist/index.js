(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.CitykletaUI = {}));
}(this, function (exports) { 'use strict';

    let counter = 0;
    /**
     * @private
     */
    const generateRandomId = () => `listbox-option-${++counter}`;
    /**
     * @private
     */
    const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';

    /**
     * @desc Custom event emitted when the selected option of a {@link ListBox} has changed.
     */
    class ChangeEvent extends CustomEvent {

        /**
         * @param {Number} index - The index of the newly selected option
         */
        constructor(index) {
            super('change', {
                detail: {selectedIndex: index}
            });
        }

        /**
         *
         * @returns {number} the index of the newly selected item (-1 for none)
         */
        get selectedIndex() {
            return this.detail.selectedIndex;
        }
    }

    const template = document.createElement('template');

    template.innerHTML = `<style>:host{position:relative}</style>
<slot name="options"></slot>
`;

    /**
     * @desc Implements the ListBox pattern for single select ListBox where the focus follows the selection.
     *
     * Keyboard interaction is handled for <kbd>Up Arrow</kbd> and <kbd>Down Arrow</kbd>. In the same way if one option is clicked, then it becomes selected
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
    class ListBox extends HTMLElement {

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
                        Math.min(this.selectedIndex + 1, this.length - 1);
                        break;
                    }
                    case 'ArrowUp': {
                        this.selectedOption !== null ? Math.max(this.selectedIndex - 1, 0)
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

    /**
     * @desc An option to be nested within a {@link ListBox} element
     */
    class ListBoxOption extends HTMLElement {

        /**
         * @protected
         */
        static get observedAttributes() {
            return ['label'];
        }

        /**
         * @protected
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'label') {
                if (newValue) {
                    this.setAttribute('aria-label', newValue);
                } else {
                    this.removeAttribute('aria-label');
                }
            }
        }

        /**
         * @returns {boolean} whether the option is currently selected or not
         */
        get selected() {
            return this.getAttribute('aria-selected') === 'true';
        }

        /**
         * @returns {string} The label or text content to be used by assistive technologies to describe the option
         */
        get label() {
            return this.hasAttribute('label') ? this.getAttribute('label') : this.textContent;
        }

        /**
         * @desc Reflects on ``aria-label`` attribute
         * @param value
         */
        set label(value) {
            this.setAttribute('label', value);
        }

        /**
         * @protected
         */
        connectedCallback() {
            this.setAttribute('role', 'option');
            this.setAttribute('slot', 'options');
        }
    }

    exports.ListBox = ListBox;
    exports.ListBoxOption = ListBoxOption;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
