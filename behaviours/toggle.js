import {methods} from 'stampit';

export function toggle (prop = 'isOpen') {
  return methods({
    toggle(){
      this[prop] = !this[prop];
    }
  });
}
