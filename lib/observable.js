import {default as stampit} from 'stampit';

export function observable (...properties) {
  const listeners = {};
  return stampit
    .init(function () {
      const listeners = {};

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
        })
      }
    });
}
