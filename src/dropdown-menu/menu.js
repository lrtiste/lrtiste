import {disclosureSection} from '../disclosure/mixins.js';

export default disclosureSection(class Menu extends HTMLElement {

    constructor() {
        super();
        this._items = [];
    }

    static get observedAttributes() {
        return ['selected-index'];
    }

    get length() {
        return this._items.length;
    }

    get selectedItem() {
        return this.selectedIndex > -1 ? this._items[this.selectedIndex] : null;
    }

    get selectedIndex() {
        return this.hasAttribute('selected-index') ? Number(this.getAttribute('selected-index')) : -1;
    }

    set selectedIndex(index) {
        if (index < 0 || index >= this.length) {
            this.setAttribute('selected-index', '-1');
        } else {
            this.setAttribute('selected-index', index);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-index' && this.selectedItem) {
            this.selectedItem.focus();
        }
    }

    addItem(item) {
        this._items.push(item);
    }

    connectedCallback() {
        this.setAttribute('role', 'menu');
        this.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    _handleKeydown(ev) {
        const {key} = ev;
        switch (key) {
            case 'ArrowDown': {
                this.selectedIndex = (this.selectedIndex + 1) % this.length;
                break;
            }
            case 'ArrowUp': {
                this.selectedIndex = (this.selectedIndex - 1) >= 0 ? this.selectedIndex - 1 : this.length - 1;
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
    }
});