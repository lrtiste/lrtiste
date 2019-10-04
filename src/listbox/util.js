let counter = 0;
/**
 * @private
 */
export const generateRandomId = () => `listbox-option-${++counter}`;
/**
 * @private
 */
export const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';
