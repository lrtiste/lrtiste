import {toggle} from '../../behaviours/toggle';
import zora from 'zora';

export default zora()
  .test('toggle "isOpen" by default', function * (t) {
    const stamp = toggle();
    const inst = stamp();
    inst.isOpen = true;
    inst.toggle();
    t.equal(inst.isOpen, false);
  })
  .test('toggle a given property', function * (t) {
    const stamp = toggle('foo');
    const inst = stamp();
    inst.foo = false;
    inst.toggle();
    t.equal(inst.foo, true);
  });
