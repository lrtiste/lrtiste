import {generateRandomId as idGenerator} from '../common/utils.js';
import ChangeEvent from '../common/change-event.js';

const generateTabId = idGenerator('tab');
const generateTabPanelId = idGenerator('tabpanel');

const template = document.createElement('template');
template.innerHTML = `<style>:host{display: flex;flex-direction: column}::slotted([role=tabpanel]){flex-grow: 1}[role=tablist]{display: flex;justify-content: var(--tab-justify,flex-start);}</style><div role="tablist"><slot name="tablist"></slot></div><slot name="tabpanels"></slot>`;

/**
 * @desc Implements the Tabs pattern
 *
 * Keyboard interaction is handled for <kbd>Left Arrow</kbd>, <kbd>Right Arrow</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Space</kbd> and <kbd>Enter</kbd>
 *
 * Click on a tab is also handled
 *
 * Note, by default the tab is activated on user's demand ie it does not follow the focus. If you wish to automatically select the tab on focus,
 * add the ``follow-focus`` attribute
 *
 * @see https://www.w3.org/TR/wai-aria-practices/#tabpanel
 * @example
 * <ui-tabset>
 *     <ui-tab><span>some sophisticated template</span></ui-tab>
 *     <ui-tabpanel>
 *         <p>
 *             Some content very <strong>interesting</strong>
 *             The tab panel can come directly after its related tab
 *         </p>
 *     </ui-tabpanel>
 *     <ui-tab selected>selected by default</ui-tab>
 *     <ui-tab id="custom_id">third tab</ui-tab>
 *     <ui-tabpanel>Or later, just the index matters</ui-tabpanel>
 *     <ui-tabpanel>Content for the third panel</ui-tabpanel>
 * </ui-tabset>
 *
 * <script type="module">
 *     import {TabSet, Tab, TabPanel} from 'path/to/lib'
 *     customElements.define('ui-tabset', TabSet);
 *     customElements.define('ui-tab', Tab);
 *     customElements.define('ui-tabpanel', TabPanel);
 * </script>
 */
export class TabSet extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._tabs = [];
        this._tabpanels = [];
    }

    /** @protected */
    static get observedAttributes() {
        return ['selected-tab-index'];
    }

    /**
     * @returns {boolean} Configure whether the tab activation should follow the focus
     */
    get followFocus() {
        return this.hasAttribute('follow-focus');
    }

    /**
     * @returns {number} The number of tabs in the set
     */
    get length() {
        return this._tabs.length;
    }

    /**
     * @returns {number} the index of the currently selected tab
     */
    get selectedIndex() {
        return this._tabs.findIndex(t => t.selected);
    }

    /**
     * @desc Reflects on ``selected-tab-index`` attribute
     * @param index
     * @emits {ChangeEvent}
     */
    set selectedIndex(index) {
        if (index >= 0 < this._tabs.length) {
            this.setAttribute('selected-tab-index', index);
        }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-tab-index' && oldValue !== newValue) {
            const tabs = this._tabs;
            tabs.forEach((tab, index) => {
                const selected = index === Number(newValue);
                tab.setAttribute('aria-selected', String(selected));
                tab.setAttribute('tabindex', selected ? '0' : '-1');
                const tabpanel = this._tabpanels[index];
                tabpanel.hidden = !selected;
            });

            this.dispatchEvent(new ChangeEvent(this.selectedIndex));
        }
    }

    /** @protected */
    connectedCallback() {
        this.shadowRoot
            .querySelector('slot[name=tablist]')
            .addEventListener('slotchange', this._handleTabChangeEvent.bind(this));

        this.shadowRoot
            .querySelector('slot[name=tabpanels]')
            .addEventListener('slotchange', this._handleTabPanelChangeEvent.bind(this));
    }

    /** @private */
    _handleTabChangeEvent(ev) {
        this._tabs = [];

        const tabs = this.shadowRoot
            .querySelector('slot[name=tablist]')
            .assignedNodes();

        for (const tab of tabs) {
            if (!tab.hasAttribute('id')) {
                tab.setAttribute('id', generateTabId());
            }
            this._tabs.push(tab);
            tab.addEventListener('keydown', this._handleKeydownEvent.bind(this));
            tab.addEventListener('click', this._handleClick.bind(this));
        }
    }

    /** @private */
    _handleTabPanelChangeEvent(ev) {
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
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
            let index = currentIndex;
            switch (key) {
                case 'ArrowLeft': {
                    index = (currentIndex - 1) >= 0 ? currentIndex - 1 : this.length - 1;
                    break;
                }
                case 'ArrowRight': {
                    index = (currentIndex + 1) % this.length;
                    break;
                }
                case 'Home': {
                    index = 0;
                    break;
                }
                case 'End': {
                    index = this.length - 1;
                    break;
                }
            }
            this._tabs[index].focus();
            if (this.followFocus) {
                this.selectedIndex = index;
            }
        } else if (key === ' ' || key === 'Enter') {
            this.selectedIndex = currentIndex;
        }
    }

    /** @private */
    _handleClick(ev) {
        const {currentTarget: tab} = ev;
        this.selectedIndex = this._tabs.indexOf(tab);
    }
}