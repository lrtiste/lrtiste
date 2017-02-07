import * as events from 'smart-table-events';
const {proxyListener, emitter:createEmitter} =events;

const DOM_CLICK = 'DOM_CLICK';
const DOM_KEYDOWN = 'DOM_KEYDOWN';
const DOM_FOCUS = 'DOM_FOCUS';

const domListener = proxyListener({
  [DOM_CLICK]: 'onclick',
  [DOM_KEYDOWN]: 'onkeydown',
  [DOM_FOCUS]: 'onfocus'
});

export default function ({element, emitter = createEmitter()}) {

  if (!element) {
    throw new Error('a dom element must be provided');
  }

  const domListenerHandler = (eventName) => (ev) => emitter.dispatch(eventName, ev);

  const listener = domListener({emitter});
  const clickListener = domListenerHandler(DOM_CLICK);
  const keydownListener = domListenerHandler(DOM_KEYDOWN);
  const focusListener = domListenerHandler(DOM_FOCUS);

  const api = {
    element(){
      return element
    },
    attr(attributeName, value){
      if (value === undefined) {
        return element.getAttribute(attributeName);
      } else {
        element.setAttribute(attributeName, value);
      }
    },
    addClass(...classNames){
      element.classList.add(...classNames);
    },
    removeClass(...classNames){
      element.classList.remove(...classNames);
    },
    clean(){
      element.removeEventListener('click', clickListener);
      element.removeEventListener('keydown', keydownListener);
      element.removeEventListener('focus', focusListener);
      listener.off(DOM_CLICK);
      listener.off(DOM_KEYDOWN);
      listener.off(DOM_FOCUS);
    }
  };

  element.addEventListener('click', clickListener);
  element.addEventListener('keydown', keydownListener);
  element.addEventListener('focus', focusListener);


  return Object.assign(listener, api);
}