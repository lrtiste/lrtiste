/**
 * @desc Custom event emitted when an expandable section opens or closes.
 */
export default class ToggleEvent extends CustomEvent {

    /**
     * @param {Boolean} open - whether the current section is expanded
     */
    constructor(open) {
        super('toggle', {
            detail: {open}
        });
    }

    /**
     *
     * @returns {Boolean} whether the current section is expanded
     */
    get open() {
        return this.detail.open;
    }
}