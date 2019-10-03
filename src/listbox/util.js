let counter = 0;
export const generateRandomId = () => `listbox-option-${++counter}`;
export const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';
