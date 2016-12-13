import {toggle} from '../../behaviours/toggle';

export function test (tape) {
  tape('toggle "isOpen" by default', t=> {
    const stamp = toggle();
    const inst = stamp();
    inst.isOpen = true;
    inst.toggle();
    t.equal(inst.isOpen, false);
    t.end();
  });

  tape('toggle a given property', t=> {
    const stamp = toggle('foo');
    const inst = stamp();
    inst.foo = false;
    inst.toggle();
    t.equal(inst.foo, true);
    t.end();
  });
}