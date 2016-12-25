import {init, compose} from 'stampit';
import {element} from './elements';

export function observable (...properties) {
  return init(function () {
    const listeners = {};

    if (!this.$onChange || !this.$on) {
      this.$onChange = (prop, newVal) => {
        const ls = listeners[prop] || [];
        for (let cb of ls) {
          cb(newVal);
        }
        return this;
      };

      this.$on = (property, cb)=> {
        const listenersList = listeners[property] || [];
        listenersList.push(cb);
        listeners[property] = listenersList;
        return this;
      };
    }

    for (let prop of properties) {
      let value = this[prop];
      Object.defineProperty(this, prop, {
        get(){
          return value;
        },
        set(val){
          value = val;
          this.$onChange(prop, val);
        }
      });
    }
  });
}

const mandatoryEl = element();

export function mapToAria (prop, ...attributes) {
  const ariaAttributes = attributes.map(attr=> {
    const isNot = /^\!/.test(attr);
    const att = isNot ? attr.substr(1) : attr;
    const fn = isNot ? v => !v : v=>v;
    return {attr: ['aria', att].join('-'), fn};
  });
  return compose(
    mandatoryEl,
    observable(prop),
    init(function () {
      this.$on(prop, newVal => {
        for (let att of ariaAttributes) {
          this.el.setAttribute(att.attr, att.fn(newVal));
        }
      });
    })
  );
}
