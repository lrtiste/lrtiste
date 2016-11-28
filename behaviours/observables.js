import {init, compose} from 'stampit';
import {element} from './elements';

export function observable (...properties) {
  return init(function () {
    const listeners = {};

    if (!this.$onChange || !this.$on) {
      this.$onChange = (prop, newVal) => {
        const ls = listeners[prop] || [];
        for (const cb of ls) {
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

    for (const prop of properties) {
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
  const ariaAttributes = attributes.map(attr=>['aria', attr].join('-'));
  return compose(
    mandatoryEl,
    observable(prop),
    init(function () {
      this.$on(prop, newVal => {
          for (const att of ariaAttributes){
            this.el.setAttribute(att,newVal);
          }
      });
    })
  );
}
