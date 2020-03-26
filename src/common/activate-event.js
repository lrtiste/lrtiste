/**
 * @desc Custom event emitted when an item is activated in a menu.
 */
export default class ActivateEvent extends CustomEvent {
    constructor(item) {
        super('activate-item', {detail: {item}, bubbles: true});
    }
}