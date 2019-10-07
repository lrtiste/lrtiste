import {generateRandomId as idGenerator} from '../common/utils.js';
import ChangeEvent from '../common/change-event.js';

const generateTabId = idGenerator('tab');
const generateTabPanelId = idGenerator('tabpanel');

const template = document.createElement('template');
template.innerHTML = `<style>:host{display: flex;flex-direction: column}::slotted([role=tabpanel]){flex-grow: 1}[role=tablist]{display: flex;justify-content: var(--tab-justify,flex-start);}</style><div role="tablist"><slot name="tablist"></slot></div><slot name="tabpanels"></slot>`;

export class TabSet extends HTMLElement {

    /** @protected */
    static get observedAttributes() {
        return ['selected-tab-index'];
    }

    get length() {
        return this._tabs.length;
    }

    get selectedIndex() {
        return this._tabs.findIndex(t => t.selected);
    }

    set selectedIndex(index) {
        if (index >= 0 < this._tabs.length) {
            this.setAttribute('selected-tab-index', index);
        }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-tab-index') {
            const tabs = this._tabs;
            tabs.forEach((tab, index) => {
                const selected = index === Number(newValue);
                tab.setAttribute('aria-selected', String(selected));
                tab.setAttribute('tabindex', selected ? '0' : '-1');
                const tabpanel = this._tabpanels[index];
                if (selected) {
                    tabpanel.removeAttribute('hidden');
                } else {
                    tabpanel.setAttribute('hidden', '');
                }
            });

            this.dispatchEvent(new ChangeEvent(this.selectedIndex));
        }
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /** @private */
        this._tabs = [];
        /** @private */
        this._tabpanels = [];
        this._handleTabChangeEvent = this._handleTabChangeEvent.bind(this);
        this._handleTabPanelChangeEvent = this._handleTabPanelChangeEvent.bind(this);
        this._handleKeydownEvent = this._handleKeydownEvent.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    connectedCallback() {
        this.shadowRoot
            .querySelector('slot[name=tablist]')
            .addEventListener('slotchange', this._handleTabChangeEvent);

        this.shadowRoot
            .querySelector('slot[name=tabpanels]')
            .addEventListener('slotchange', this._handleTabPanelChangeEvent);
    }

    /** @private */
    _handleTabChangeEvent(ev) {

        console.log('tab change');

        this._tabs = [];

        const tabs = this.shadowRoot
            .querySelector('slot[name=tablist]')
            .assignedNodes();

        for (const tab of tabs) {
            if (!tab.hasAttribute('id')) {
                tab.setAttribute('id', generateTabId());
            }
            this._tabs.push(tab);
            tab.addEventListener('keydown', this._handleKeydownEvent);
            tab.addEventListener('click', this._handleClick);
        }
    }

    /** @private */
    _handleTabPanelChangeEvent(ev) {
        console.log('tabpanel change');

        this._tabpanels = [];

        const tabpanels = this.shadowRoot
            .querySelector('slot[name=tabpanels]')
            .assignedNodes();

        tabpanels.forEach((tp, index) => {
            const tab = this._tabs[index];

            if (!tp.hasAttribute('id')) {
                tp.setAttribute('id', generateTabPanelId());
            }

            tab.setAttribute('aria-controls', tp.id);
            tp.setAttribute('aria-labelledby', tab.id);

            this._tabpanels.push(tp);
        });

        const selectedTabIndex = this._tabs.findIndex(t => t.hasAttribute('selected'));

        this.selectedIndex = selectedTabIndex !== -1 ? selectedTabIndex : 0;
    }

    /** @private */
    _handleKeydownEvent(ev) {
        const {key, currentTarget: tab} = ev;
        const currentIndex = this._tabs.indexOf(tab);
        switch (key) {
            case 'ArrowLeft': {
                const index = (currentIndex - 1) >= 0 ? currentIndex - 1 : this.length - 1;
                this._tabs[index].focus();
                break;
            }
            case 'ArrowRight': {
                const index = (currentIndex + 1) % this.length;
                this._tabs[index].focus();
                break;
            }
            case 'Home': {
                const index = 0;
                this._tabs[index].focus();
                break;
            }
            case 'End': {
                const index = this.length - 1;
                this._tabs[index].focus();
                break;
            }
            case ' ':
            case 'Enter': {
                this.selectedIndex = currentIndex;
                break;
            }

        }
    }

    /** @private */
    _handleClick(ev) {
        const {currentTarget: tab} = ev;
        this.selectedIndex = this._tabs.indexOf(tab);
    }
}