const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

/**
 * @desc A tab panel to be nested inside a {@link TabSet} element. The order is important:
 * the nth tab will match the nth {@link Tab}
 */
export class TabPanel extends HTMLElement {

    /**
     * @returns {boolean} Whether the panel is currently active
     */
    get active() {
        return this.hasAttribute('hidden') === false;
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'tabpanel');
        this.setAttribute('slot', 'tabpanels');
    }
}