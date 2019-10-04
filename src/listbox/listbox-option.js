/**
 * @desc An option to be nested within a {@link ListBox} element
 */
export class ListBoxOption extends HTMLElement {

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