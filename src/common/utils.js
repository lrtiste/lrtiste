/**
 * @private
 */
export const generateRandomId = (prefix) => {
    let counter = 0;
    return () => `${prefix}-${++counter}`;
};
/**
 * @private
 */
export const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';
