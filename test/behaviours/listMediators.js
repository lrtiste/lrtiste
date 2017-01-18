import {listMediatorStamp, multiSelectMediatorStamp} from '../../behaviours/listMediators';
import zora from 'zora';

export default zora()
  .test('list mediator: add item', function * (t) {
    const instance = listMediatorStamp();
    t.equal(instance.items.length, 0);
    const item = {};
    instance.addItem(item);
    t.deepEqual(instance.items, [item]);
  })
  .test('list mediator: open an item and close all others', function * (t) {
    const instance = listMediatorStamp();
    const item = {isOpen: false};
    const item2 = {isOpen: false};
    const item3 = {isOpen: true};
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.toggleItem(item2);
    t.equal(item.isOpen, false);
    t.equal(item2.isOpen, true);
    t.equal(item3.isOpen, false);

    instance.toggleItem(item2);
    t.equal(item.isOpen, false);
    t.equal(item2.isOpen, false);
    t.equal(item3.isOpen, false);
  })
  .test('select an item and unselect the others', function * (t) {
    const instance = listMediatorStamp();
    const item = {isSelected: false};
    const item2 = {isSelected: false};
    const item3 = {isSelected: true};
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.selectItem(item2);
    t.equal(item.isSelected, false);
    t.equal(item2.isSelected, true);
    t.equal(item3.isSelected, false);
  })
  .test('select the next item or loop back to the first', function * (t) {
    const instance = listMediatorStamp();
    const item = {isSelected: false};
    const item2 = {isSelected: true};
    const item3 = {isSelected: false};
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.selectNextItem(item2);
    t.equal(item.isSelected, false);
    t.equal(item2.isSelected, false);
    t.equal(item3.isSelected, true);

    instance.selectNextItem(item3);
    t.equal(item.isSelected, true);
    t.equal(item2.isSelected, false);
    t.equal(item3.isSelected, false);
  })
  .test('select the previous item or loop back to the last', function * (t) {
    const instance = listMediatorStamp();
    const item = {isSelected: false};
    const item2 = {isSelected: true};
    const item3 = {isSelected: false};
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.selectPreviousItem(item2);
    t.equal(item.isSelected, true);
    t.equal(item2.isSelected, false);
    t.equal(item3.isSelected, false);

    instance.selectPreviousItem(item);
    t.equal(item.isSelected, false);
    t.equal(item2.isSelected, false);
    t.equal(item3.isSelected, true);
  })
  .test('multiselect list mediator: toggle any item', function * (t) {
    const instance = multiSelectMediatorStamp();
    const item = {isOpen: false};
    const item2 = {isOpen: false};
    const item3 = {isOpen: true};
    instance.addItem(item);
    instance.addItem(item2);
    instance.addItem(item3);

    instance.toggleItem(item);

    t.equal(item.isOpen, true);
    t.equal(item2.isOpen, false);
    t.equal(item3.isOpen, true);
  });
