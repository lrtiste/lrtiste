import {default as stampit} from 'stampit';

export function element (propertyName = 'el') {
  return stampit()
    .init(function (opts = {}) {
      const el = opts[propertyName];
      if (!el) {
        throw new Error(`You must provide a dom element as "${propertyName}" property`);
      }
      Object.defineProperty(this, propertyName, {value: el});
    });
}

export function ariaElement (ariaRole) {
  const elStamp = element();
  return stampit.compose(elStamp, stampit.init(function () {
    const role =this.el.getAttribute('role');
    if (role !== ariaRole) {
      throw new Error(`the element to used to create the component is expected to have the aria role ${ariaRole}`);
    }
  }));
}