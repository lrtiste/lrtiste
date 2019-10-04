/**
 * @desc Custom event emitted when the selected option of a {@link ListBox} has changed.
 */
export default class ChangeEvent extends CustomEvent {
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