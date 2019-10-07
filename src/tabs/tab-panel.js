const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

export class TabPanel extends HTMLElement {

    get active() {
        return this.hasAttribute('hidden') === false;
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.setAttribute('role', 'tabpanel');
        this.setAttribute('slot', 'tabpanels');
    }
}