import {init} from 'stampit';

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
