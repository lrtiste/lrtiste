import {generateRandomId, isSelectedPredicate} from './util.js';

const template = document.createElement('template');

template.innerHTML = `<style></style>
<slot name="options"></slot>
`;

// todo put the selected option in the scroll view
export class ListBox extends HTMLElement {

    _optionElements = [];

    static get observedAttributes() {
        return ['aria-activedescendant'];
    }

    get selectedOption() {
        return this._optionElements.filter(isSelectedPredicate)[0] || null;
    }

    get length() {
        return this._optionElements.length;
    }

    get selectedIndex() {
        return this._optionElements.findIndex(isSelectedPredicate);
    }

    set selectedIndex(index) {
        const options = this._optionElements;
        if (index < 0 || index >= options.length) {
            this.setAttribute('aria-activedescendant', '');
        } else {
            this.setAttribute('aria-activedescendant', options[index].getAttribute('id'));
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'aria-activedescendant' && oldValue !== newValue) {
            for (const el of this._optionElements) {
                el.setAttribute('aria-selected', String(newValue === el.getAttribute('id')));
            }
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    selectedIndex: this.selectedIndex
                }
            }));
        }
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._handleOptionChangeEvent = this._handleOptionChangeEvent.bind(this);
        this._handleKeydownEvent = this._handleKeydownEvent.bind(this);
        this._handleOptionClick = this._handleOptionClick.bind(this);
    }

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

    _handleOptionClick(ev) {
        const {currentTarget: option} = ev;
        const index = this._optionElements.indexOf(option);
        if (index !== -1) {
            this.selectedIndex = index;
        }
    }

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

    _handleKeydownEvent(ev) {
        const {key} = ev;
        if (['ArrowDown', 'ArrowUp'].includes(key)) {
            this.selectedIndex = key === 'ArrowDown' ?
                Math.min(this.selectedIndex + 1, this.length - 1) :
                Math.max(this.selectedIndex - 1, 0);
        }
    }
}