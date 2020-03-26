/**
 * @desc A tab panel to be nested inside a {@link TabSet} element. The order is important:
 * the nth tab will match the nth {@link Tab}
 */
export class TabPanel extends HTMLElement {

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