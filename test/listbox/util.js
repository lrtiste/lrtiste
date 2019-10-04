import {ListBox, ListBoxOption} from '../../src/listbox/index.js';

export const body = document.querySelector('body');
export const LIST_BOX_TAG_NAME = 'test-listbox';
export const LIST_BOX_OPTION_TAG_NAME = 'test-listbox-option';
customElements.define(LIST_BOX_OPTION_TAG_NAME, ListBoxOption);
customElements.define(LIST_BOX_TAG_NAME, ListBox);
