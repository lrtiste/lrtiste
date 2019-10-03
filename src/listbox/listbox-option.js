export class ListBoxOption extends HTMLElement {

    static get observedAttributes() {
        return ['label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'label') {
            if (newValue) {
                this.setAttribute('aria-label', newValue);
            } else {
                this.removeAttribute('aria-label');
            }
        }
    }

    get selected() {
        return this.getAttribute('aria-selected') === 'true';
    }

    get label() {
        return this.hasAttribute('label') ? this.getAttribute('label') : this.textContent;
    }

    set label(value) {
        this.setAttribute('label', value);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute('role', 'option');
        this.setAttribute('slot', 'options');
    }
}