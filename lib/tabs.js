import {default as stampit} from 'stampit';

const TabListStamp = stampit()
  .init(function ({items = []}) {
    Object.defineProperty(this, 'items', {value: items});
  })
  .methods({
    addItem(item){
      this.items.push(item);
      return this;
    },
    toggleItem(item){
      for (const i of this.items) {
        i.isOpen = i === item ? !i.isOpen : false;
      }
      return this;
    }
  });

const TabStamp = stampit()
  .init(function ({tabList, isOpen}) {
    const acc = tabList ? tabList : tabList();
    tabList.addItem(this);
    this.isOpen = isOpen === true;
    Object.defineProperty(this, 'tabList', {value: acc});
  })
  .methods({
    toggle(){
      this.tabList.toggleItem(this);
    }
  });

export function tab () {
  return TabStamp;
}

export function tabList () {
  return TabListStamp;
}
