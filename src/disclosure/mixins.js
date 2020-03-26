import {eventuallySetAttribute, mixin} from '../common/utils.js';

export const toggleButton = mixin({
    expanded: {
        get() {
            return this.hasAttribute('aria-expanded');
        },
        set(val) {
            this.setAttribute('aria-expanded', String(val));
        }
    },
    connectedCallback: function () {
        eventuallySetAttribute(this, 'tabindex', '0');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('role', 'button');
        const container = this.closest('[data-wc-disclosure]');
        container.toggleButton = this;
    }
});

export const disclosureSection = mixin({
    connectedCallback() {
        const container = this.closest('[data-wc-disclosure]');
        container.disclosureSection = this;
    }
});

export const disclosureContainer = mixin({
    expanded: {
        get() {
            return this.hasAttribute('expanded');
        },
        set(val) {
            if (val) {
                this.setAttribute('expanded', '');
            } else {
                this.removeAttribute('expanded');
            }
        }
    },
    toggle: {
        value: function () {
            this.expanded = !this.expanded;
        }
    },
    connectedCallback() {
        this.setAttribute('data-wc-disclosure', ''); // we add a custom classname so children element can refer to this instance with a css selector
    },
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'expanded') {
            this._button.expanded = this.expanded;
            this._section.hidden = !this.expanded;
        }
    },
    observedAttributes: ['expanded']
});
