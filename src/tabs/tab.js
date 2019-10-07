const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

export class Tab extends HTMLElement {

    get selected() {
        return this.getAttribute('aria-selected') === 'true';
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.setAttribute('role', 'tab');
        this.setAttribute('slot', 'tablist');
    }
}