export function click (el, opts = {bubbles: true, cancelable: true}) {
  const event = new MouseEvent('click', opts);
  el.dispatchEvent(event);
}

export function keydown (el, opts = {}) {
  const options = Object.assign({}, opts, {bubbles: true, cancelable: true});
  const event = new KeyboardEvent('keydown', options);
  el.focus();
  el.dispatchEvent(event);
}
