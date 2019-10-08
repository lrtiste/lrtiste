const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

/**
 * @desc A tab to be nested inside a {@link TabSet} element. The order is important:
 * the nth tab will match the nth {@link TabPanel}
 */
export class Tab extends HTMLElement {

    /**
     * @returns {boolean} Whether the tab is currently active or not
     */
    get selected() {
        return this.getAttribute('aria-selected') === 'true';
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'tab');
        this.setAttribute('slot', 'tablist');
    }
}