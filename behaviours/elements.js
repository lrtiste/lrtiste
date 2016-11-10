import {init, compose} from 'stampit';

export function element ({propertyName = 'el'}={propertyName: 'el'}) {
  return init(function (opts = {}) {
    const el = opts[propertyName];
    if (!el) {
      throw new Error(`You must provide a dom element as "${propertyName}" property`);
    }
    Object.defineProperty(this, propertyName, {value: el});
  });
}

export function ariaElement ({ariaRole, propertyName = 'el'}) {
  const elStamp = element({propertyName});
  return compose(elStamp, init(function () {
    const role = this.el.getAttribute('role');
    if (role !== ariaRole) {
      throw new Error(`the element used to create the component is expected to have the aria role ${ariaRole}`);
    }
  }));
}