/** @private */
const generateRandomId = (prefix) => {
    let counter = 0;
    return () => `${prefix}-${++counter}`;
};

/** @private */
const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';

/** @private */
function eventuallySetAttribute(target, attribute, value) {
    if (!target.hasAttribute(attribute)) {
        target.setAttribute(attribute, value);
    }
}

/** @private */
const mixin = (...mixins) => klass => {
    const proto = klass.prototype;
    for (const mix of mixins) {
        const keys = Object.keys(mix);
        for (const key of keys) {
            switch (key) {
                case 'connectedCallback': {
                    const original = proto.connectedCallback;
                    proto.connectedCallback = function () {
                        if (original) {
                            original.call(this);
                        }
                        mix.connectedCallback.call(this);
                    };
                    break;
                }
                case 'attributeChangedCallback': {
                    const original = proto.attributeChangedCallback;
                    proto.attributeChangedCallback = function (name, oldValue, newValue) {
                        if (original) {
                            original.call(this, name, oldValue, newValue);
                        }
                        mix.attributeChangedCallback.call(this, name, oldValue, newValue);
                    };
                    break;
                }
                case 'observedAttributes': {
                    const propList = (klass.observedAttributes || []).concat(mix.observedAttributes);
                    Object.defineProperty(klass, 'observedAttributes', {
                        configurable: true,
                        get() {
                            return propList;
                        }
                    });
                    break;
                }
                default:
                    Object.defineProperty(proto, key, Object.assign({
                        enumerable: true
                    }, mix[key]));
            }
        }
    }
    return klass;
};

/**
 * @desc Custom event emitted when the selected option of a {@link ListBox} or a {@link TabSet} has changed.
 */
class ChangeEvent extends CustomEvent {

    /**
     * @param {Number} index - The index of the newly selected option
     */
    constructor(index) {
        super('change', {
            detail: {selectedIndex: index}
        });
    }

    /**
     *
     * @returns {number} the index of the newly selected item (-1 for none)
     */
    get selectedIndex() {
        return this.detail.selectedIndex;
    }
}

const generateRandomId$1 = generateRandomId('listbox-option');

const template = document.createElement('template');
template.innerHTML = `<style>:host{position:relative}</style>
<slot name="options"></slot>
`;

/**
 * @desc Implements the ListBox pattern for single select ListBox where the focus follows the selection.
 *
 * Keyboard interaction is handled for <kbd>Up Arrow</kbd>, <kbd>Down Arrow</kbd>, <kbd>Home</kbd> and <kbd>End</kbd>. In the same way if an option is clicked, then it becomes selected
 *
 * @see https://www.w3.org/TR/wai-aria-practices/#Listbox
 * @example
 * <ui-listbox>
 *     <ui-listbox-option><span>Some custom template</span></ui-listbox-option>
 *     <ui-listbox-option selected>Other option selected by default</ui-listbox-option>
 * </ui-listbox>
 *
 * <script type="module">
 *     import {ListBox, ListBoxOption} from 'path/to/lib'
 *
 *     customElements.define('ui-listbox', ListBox);
 *     customElements.define('ui-listbox-option', ListBoxOption);
 * </script>
 */
class ListBox extends HTMLElement {

    /** @protected */
    static get observedAttributes() {
        return ['aria-activedescendant'];
    }

    /**
     * @returns {ListBoxOption|null} The currently selected ListBoxOption element
     */
    get selectedOption() {
        return this._optionElements.filter(isSelectedPredicate)[0] || null;
    }

    /**
     * @returns {number} - The current number of available options
     */
    get length() {
        return this._optionElements.length;
    }

    /**
     * @returns {number} The index of the currently selected option, -1 if none is selected
     */
    get selectedIndex() {
        return this._optionElements.findIndex(isSelectedPredicate);
    }

    /**
     * @desc Reflects on ``aria-activedescendant`` attribute
     * @param {Number} index - The index of the new option element to select
     * @emits {ChangeEvent}
     * @example
     * const listbox = document.getElementId('some listbox id');
     * listbox.addEventListener('change', ev => {
     *     console.log(ev.selectedIndex);
     * })
     *
     * listbox.selectedIndex = 0; // select first option;
     * listbox.selectedIndex = 1; // select second option;
     *
     * //etc
     *
     * listbox.selectedIndex = -1; // unselect all
     *
     */
    set selectedIndex(index) {
        const options = this._optionElements;
        if (index < 0 || index >= options.length) {
            this.setAttribute('aria-activedescendant', '');
        } else {
            this.setAttribute('aria-activedescendant', options[index].getAttribute('id'));
        }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'aria-activedescendant' && oldValue !== newValue) {
            for (const el of this._optionElements) {
                el.setAttribute('aria-selected', String(newValue === el.getAttribute('id')));
            }

            if (this.selectedOption) {
                const {offsetTop, offsetHeight} = this.selectedOption;

                //before
                if (offsetTop < this.scrollTop) {
                    /** @protected*/
                    this.scrollTop = offsetTop;
                } else if ((offsetTop + offsetHeight) > (this.scrollTop + this.clientHeight)) {
                    // after
                    this.scrollBy(0, (offsetTop + offsetHeight) - (this.scrollTop + this.clientHeight));
                }
            }

            this.dispatchEvent(new ChangeEvent(this.selectedIndex));
        }
    }

    constructor() {
        super();
        this._optionElements = [];
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._handleOptionChangeEvent = this._handleOptionChangeEvent.bind(this);
        this._handleKeydownEvent = this._handleKeydownEvent.bind(this);
        this._handleOptionClickEvent = this._handleOptionClickEvent.bind(this);
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'listbox');

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }

        this.shadowRoot
            .querySelector('slot[name=options]')
            .addEventListener('slotchange', this._handleOptionChangeEvent);

        this.addEventListener('keydown', this._handleKeydownEvent);
    }

    /** @private */
    _handleOptionClickEvent(ev) {
        const {currentTarget: option} = ev;
        const index = this._optionElements.indexOf(option);
        if (index !== -1) {
            this.selectedIndex = index;
        }
    }

    /** @private */
    _handleOptionChangeEvent(ev) {
        this._optionElements = this.shadowRoot
            .querySelector('slot')
            .assignedNodes()
            .filter(el => el.getAttribute('role') === 'option');

        for (const opt of this._optionElements) {
            if (!opt.hasAttribute('id')) {
                opt.setAttribute('id', generateRandomId$1());
            }
            opt.addEventListener('click', this._handleOptionClickEvent);
        }

        this.selectedIndex = this._optionElements.findIndex(i => i.hasAttribute('selected'));
    }

    /** @private */
    _handleKeydownEvent(ev) {
        const {key} = ev;
        if (['ArrowDown', 'ArrowUp', 'End', 'Home'].includes(key)) {
            switch (key) {
                case 'ArrowDown': {
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
                    break;
                }
                case 'ArrowUp': {
                    this.selectedIndex = this.selectedOption !== null ? Math.max(this.selectedIndex - 1, 0)
                        : this.length - 1;
                    break;
                }
                case 'Home': {
                    this.selectedIndex = this.length ? 0 : -1;
                    break;
                }
                case 'End': {
                    this.selectedIndex = this.length - 1;
                    break;
                }
            }
            ev.preventDefault();
        }
    }
}

/**
 * @desc An option to be nested within a {@link ListBox} element
 */
class ListBoxOption extends HTMLElement {

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

const generateTabId = generateRandomId('tab');
const generateTabPanelId = generateRandomId('tabpanel');

const template$1 = document.createElement('template');
template$1.innerHTML = `<style>:host{display: flex;flex-direction: column}::slotted([role=tabpanel]){flex-grow: 1}[role=tablist]{display: flex;justify-content: var(--tab-justify,flex-start);}</style><div role="tablist"><slot name="tablist"></slot></div><slot name="tabpanels"></slot>`;

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
class TabSet extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template$1.content.cloneNode(true));
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

/**
 * @desc A tab to be nested inside a {@link TabSet} element. The order is important:
 * the nth tab will match the nth {@link TabPanel}
 */
class Tab extends HTMLElement {

    /**
     * @returns {boolean} Whether the tab is currently active or not
     */
    get selected() {
        return this.getAttribute('aria-selected') === 'true';
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'tab');
        this.setAttribute('slot', 'tablist');
    }
}

/**
 * @desc A tab panel to be nested inside a {@link TabSet} element. The order is important:
 * the nth tab will match the nth {@link Tab}
 */
class TabPanel extends HTMLElement {

    /**
     * @returns {boolean} Whether the panel is currently active
     */
    get active() {
        return !this.hidden;
    }

    /** @protected */
    connectedCallback() {
        this.setAttribute('role', 'tabpanel');
        this.setAttribute('slot', 'tabpanels');
    }
}

const toggleButton = mixin({
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

const disclosureSection = mixin({
    connectedCallback() {
        const container = this.closest('[data-wc-disclosure]');
        container.disclosureSection = this;
    }
});

const disclosureContainer = mixin({
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

const generateToggleId = generateRandomId('toggle');
const generateSectionId = generateRandomId('section');

/**
 * @class Dropdown
 */
var dropdown = disclosureContainer(class Dropdown extends HTMLElement {

    get preventClose() {
        return this.hasAttribute('prevent-close');
    }

    set toggleButton(button) {
        this._button = button;
        eventuallySetAttribute(button, 'id', generateToggleId());
        button.addEventListener('click', this.toggle.bind(this));
        button.addEventListener('keydown', ev => {
            const {key} = ev;
            if (key === ' ' || key === 'Enter') {
                this.toggle();
                if (this.expanded) {
                    this._section.selectedIndex = 0;
                }
            } else if (key === 'ArrowDown' || key === 'ArrowUp') {
                this.openMenu(key === 'ArrowUp');
            }
        });
    }

    set disclosureSection(section) {
        this._section = section;
        eventuallySetAttribute(section, 'id', generateSectionId());
        eventuallySetAttribute(section, 'aria-labelledBy', this._button.id);
        eventuallySetAttribute(this._button, 'aria-controls', section.id);
        section.addEventListener('keydown', this._handleMenuKeydown.bind(this));
        this._button.expanded = this.expanded;
        section.hidden = !this.expanded;
    }

    connectedCallback() {

        let timer = null;

        this.addEventListener('focusin', () => {
            if (timer) {
                clearTimeout(timer);
            }
        });

        this.addEventListener('focusout', () => {
            timer = setTimeout(() => this.closeMenu(), 100);
        });

        this.addEventListener('activate-item', ev => {
            if (!this.preventClose) {
                this.closeMenu(true);
                ev.stopPropagation();
            }
        });
    }

    openMenu(end = false) {
        this.expanded = true;
        this._section.selectedIndex = end ? this._section.length - 1 : 0;
    }

    closeMenu(focus) {
        this.expanded = false;
        this._section.selectedIndex = -1;
        if (focus) {
            this._button.focus();
        }
    }

    _handleMenuKeydown(ev) {
        const {key} = ev;
        if (key === 'Escape') {
            this.closeMenu(true);
        }
    };
});

var menu = disclosureSection(class Menu extends HTMLElement {

    constructor() {
        super();
        this._items = [];
    }

    static get observedAttributes() {
        return ['selected-index'];
    }

    get length() {
        return this._items.length;
    }

    get selectedItem() {
        return this.selectedIndex > -1 ? this._items[this.selectedIndex] : null;
    }

    get selectedIndex() {
        return this.hasAttribute('selected-index') ? Number(this.getAttribute('selected-index')) : -1;
    }

    set selectedIndex(index) {
        if (index < 0 || index >= this.length) {
            this.setAttribute('selected-index', '-1');
        } else {
            this.setAttribute('selected-index', index);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-index' && this.selectedItem) {
            this.selectedItem.focus();
        }
    }

    addItem(item) {
        this._items.push(item);
    }

    connectedCallback() {
        this.setAttribute('role', 'menu');
        this.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    _handleKeydown(ev) {
        const {key} = ev;
        switch (key) {
            case 'ArrowDown': {
                this.selectedIndex = (this.selectedIndex + 1) % this.length;
                break;
            }
            case 'ArrowUp': {
                this.selectedIndex = (this.selectedIndex - 1) >= 0 ? this.selectedIndex - 1 : this.length - 1;
                break;
            }
            case 'Home': {
                this.selectedIndex = this.length ? 0 : -1;
                break;
            }
            case 'End': {
                this.selectedIndex = this.length - 1;
                break;
            }
        }
    }
});

/**
 * @desc Custom event emitted when an item is activated in a menu.
 */
class ActivateEvent extends CustomEvent {
    constructor(item) {
        super('activate-item', {detail: {item}, bubbles: true});
    }
}

/**
 * @desc A menu item within a menu. Usually you should register listener to the custom event ``activate-item``
 * @example
 *
 * <ui-dropdown-menu>
 *  <span slot="menu-button.js">Actions</span>
 *  <ui-dropdown-menuitem>action 1</ui-dropdown-menuitem>
 *  <ui-dropdown-menuitem id="custom-id">action 2</ui-dropdown-menuitem>
 *  <ui-dropdown-menuitem><span>templated</span></ui-dropdown-menuitem>
 * </ui-dropdown-menu>
 *
 * <script type="module">
 *  import {DropdownMenu, DropdownMenuitem} from '/path/to/lib.js';
 *
 *  customElements.define('ui-dropdown-menu', DropdownMenu);
 *  customElements.define('ui-dropdown-menuitem', DropdownMenuitem);
 *
 *  document
 *      .querySelectorAll('ui-dropdown-menuitem')
 *      .forEach(item => item.addEventListener('activate-item',
 *          () => console.log(`${item.textContent} activated`))
 *      );
 * </script>
 *
 */
class Menuitem extends HTMLElement {

    connectedCallback() {
        this.setAttribute('tabindex', '-1');
        this.setAttribute('role', 'menuitem');
        this.closest('[role=menu]').addItem(this);
        this.addEventListener('click', this.activate.bind(this));
        this.addEventListener('keydown',ev => {
            const {key} = ev;
            if(key===' ' || key === 'Enter'){
                this.activate();
            }
        });
    }

    /**
     * activate the item
     * @Emits {ActivateEvent}
     */
    activate() {
        this.dispatchEvent(new ActivateEvent(this));
    }
}

var disclosureSection$1 = disclosureSection(class DisclosureSection extends HTMLElement {
});

const generateToggleId$1 = generateRandomId('toggle');
const generateSectionId$1 = generateRandomId('section');

var disclosure = disclosureContainer(class Disclosure extends HTMLElement {
    set toggleButton(button) {
        this._button = button;
        eventuallySetAttribute(button, 'id', generateToggleId$1());
        button.addEventListener('click', this.toggle.bind(this));
        button.addEventListener('keydown', ev => {
            if (ev.key === ' ' || ev.key === 'Enter') {
                this.toggle();
            }
        });
    }

    set disclosureSection(section) {
        this._section = section;
        eventuallySetAttribute(section, 'id', generateSectionId$1());
        eventuallySetAttribute(section, 'aria-labelledBy', this._button.id);
        eventuallySetAttribute(this._button, 'aria-controls', section.id);
        this._button.expanded = this.expanded;
        section.hidden = !this.expanded;
    }
});

var toggleButton$1 = toggleButton(class ToggleButton extends HTMLElement {
});

export { disclosure as Disclosure, disclosureSection$1 as DisclosureSection, dropdown as Dropdown, ListBox, ListBoxOption, menu as Menu, Menuitem, Tab, TabPanel, TabSet, toggleButton$1 as ToggleButton };
