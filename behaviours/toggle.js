import {methods} from 'stampit';

export function toggle (prop) {
  return methods({
    toggle(){
      this[prop] = !this[prop];
    }
  });
}