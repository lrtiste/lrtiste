/**
 * @desc An option to be nested within a {@link ListBox} element
 */
export class ListBoxOption extends HTMLElement {

    /**
     * @returns {boolean} whether the option is currently selected or not
     */
    get selected() {
        return this.getAttribute('aria-selected') === 'true';
    }

    /**
     * @returns {string} The value related to the option
     */
    get value() {
        return this.hasAttribute('value') ? this.getAttribute('value') : this.label;
    }

    /**
     * @desc Reflects on ``value`` attribute
     * @param value {String}
     */
    set value(value) {
        this.setAttribute('value', value);
    }

    /**
     * @protected
     */
    connectedCallback() {
        this.setAttribute('role', 'option');
        this.setAttribute('slot', 'options');
    }
}