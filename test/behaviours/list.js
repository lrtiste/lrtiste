import {list, set} from '../../lib/list';
import {default as tape} from 'tape';

export function test () {
  tape('should manage a list and emit whenever an item is added',t=>{
    const listStamp = list();
    const listComp = listStamp();

    listComp.$on('add',newItem =>{
      t.equal(newItem,'foo');
      t.deepEqual(listComp.items,['foo']);
      t.end();
    });

    listComp.addItem('foo');
  });

  tape('should manage a list and emit whenever an item is removed',t=>{
    const listStamp = list();
    const listComp = listStamp();

    listComp.$on('remove',removedItem =>{
      t.equal(removedItem,'foo');
      t.deepEqual(listComp.items,['bar']);
      t.end();
    });

    listComp.addItem('foo');
    listComp.addItem('bar');

    t.deepEqual(listComp.items,['foo','bar']);
    listComp.removeItem('foo');
  });

  tape('should be able to add multiple times the same item',t=>{
    const listStamp = list();
    const listComp=listStamp();
    listComp.addItem('foo');
    listComp.addItem('foo');
    t.deepEqual(listComp.items,['foo','foo']);
    t.end();
  });

  tape('should manage a set and emit whenever an item is added',t=>{
    const setStamp = set();
    const setComp = setStamp();

    setComp.$on('add',newItem =>{
      t.equal(newItem,'foo');
      t.deepEqual(setComp.items,['foo']);
      t.end();
    });

    setComp.addItem('foo');
  });

  tape('should manage a set and emit whenever an item is removed',t=>{
    const listStamp = set();
    const setComp = listStamp();

    setComp.$on('remove',removedItem =>{
      t.equal(removedItem,'foo');
      t.deepEqual(setComp.items,['bar']);
      t.end();
    });

    setComp.addItem('foo');
    setComp.addItem('bar');

    t.deepEqual(setComp.items,['foo','bar']);
    setComp.removeItem('foo');
  });

  tape('should not be able to add multiple times the same item',t=>{
    const setStamp = set();
    const setComp=setStamp();
    setComp.addItem('foo');
    setComp.addItem('foo');
    t.deepEqual(setComp.items,['foo']);
    t.end();
  });
}