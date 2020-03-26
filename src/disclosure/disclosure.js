import {eventuallySetAttribute, generateRandomId as idGenerator} from '../common/utils.js';
import {disclosureContainer} from './mixins.js';

const generateToggleId = idGenerator('toggle');
const generateSectionId = idGenerator('section');

export default disclosureContainer(class Disclosure extends HTMLElement {
    set toggleButton(button) {
        this._button = button;
        eventuallySetAttribute(button, 'id', generateToggleId());
        button.addEventListener('click', this.toggle.bind(this));
        button.addEventListener('keydown', ev => {
            if (ev.key === ' ' || ev.key === 'Enter') {
                this.toggle();
            }
        });
    }

    set disclosureSection(section) {
        this._section = section;
        eventuallySetAttribute(section, 'id', generateSectionId());
        eventuallySetAttribute(section, 'aria-labelledBy', this._button.id);
        eventuallySetAttribute(this._button, 'aria-controls', section.id);
        this._button.expanded = this.expanded;
        section.hidden = !this.expanded;
    }
});
