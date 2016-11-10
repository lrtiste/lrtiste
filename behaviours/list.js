import {default as stampit} from 'stampit'
import {observable} from './observable'

const abstractListStamp = stampit.compose(
  observable('add', 'remove'),
  stampit.init(function ({items = []}) {
    Object.defineProperty(this, 'items', {value: items});
  })
    .methods({
      removeItem(item){
        const indexOf = this.items.indexOf(item);
        if (indexOf !== -1) {
          const [remove] = this.items.splice(indexOf, 1);
          this.$onChange('remove', remove);
        }
        return this;
      }
    })
);


export function list () {
  return stampit.compose(
    abstractListStamp,
    stampit
      .methods({
        addItem(item){
          this.items.push(item);
          this.$onChange('add', item);
          return this;
        },
      })
  );
}

export function set () {
  return stampit.compose(
    abstractListStamp,
    stampit
      .methods({
        addItem(item){
          const index = this.items.indexOf(item);
          if (index === -1) {
            this.items.push(item);
            this.$onChange('add', item);
          }
          return this;
        }
      })
  );
}
