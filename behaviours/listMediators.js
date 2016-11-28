import {init, compose, methods} from 'stampit';

const abstractListMediatorStamp = init(function ({items = []}) {
  Object.defineProperty(this, 'items', {value: items});
})
  .methods({
    addItem(item){
      this.items.push(item);
    },
    selectItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        for (const i of this.items) {
          i.isSelected = i === item;
        }
      }
    },
    selectNextItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        const newIndex = index === this.items.length - 1 ? 0 : index + 1;
        this.selectItem(this.items[newIndex]);
      }
    },
    selectPreviousItem(item){
      const index = this.items.indexOf(item);
      if (index !== -1) {
        const newIndex = index === 0 ? this.items.length - 1 : index - 1;
        this.selectItem(this.items[newIndex]);
      }
    }
  });

const listItemStamp = init(function ({listMediator, isOpen}) {
  if (!listMediator) {
    throw new Error('you must provide a listMediator to the listItem');
  }
  this.isOpen = this.isOpen ? this.isOpen : isOpen === true;
  Object.defineProperty(this, 'listMediator', {value: listMediator});
  listMediator.addItem(this);
})
  .methods({
    toggle(){
      this.listMediator.toggleItem(this);
    },
    select(){
      this.listMediator.selectItem(this);
    },
    selectPrevious(){
      this.listMediator.selectPreviousItem(this);
    },
    selectNext(){
      this.listMediator.selectNextItem(this);
    },
  });

const multiSelectMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem(item){
    const index = this.items.indexOf(item);
    if (index !== -1) {
      item.isOpen = !item.isOpen;
    }
  }
}));

const listMediatorStamp = compose(abstractListMediatorStamp, methods({
  toggleItem(item){
    for (const i of this.items) {
      i.isOpen = i === item ? !i.isOpen : false;
    }
    return this;
  }
}));

export {listMediatorStamp, multiSelectMediatorStamp, listItemStamp}
