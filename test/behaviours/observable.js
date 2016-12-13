import {observable, mapToAria} from '../../behaviours/observables';
import {compose} from 'stampit';

export function test (tape) {

  function mockElement () {
    return {
      setAttribute(attr, val){
        this[attr] = val;
      }
    }
  }

  tape('observe a property and get notified with the new value', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
      t.end();
    });
    comp.myProp = 'foo';
  });

  tape('do not get notified if the value remains the same', t=> {
    t.plan(1);
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
    comp.myProp = 'foo';
  });

  tape('manually emit a change event', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
      t.end();
    });
    comp.$onChange('myProp', 'bar');
  });

  tape('use arrity n api', t=> {
    t.plan(2);
    const obsStamp = observable('myProp', 'myPropBis');
    const obs = obsStamp();
    obs.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', myPropBis=> {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  });

  tape('compose multiple times with observable', t=> {
    t.plan(2);
    const obsStamp = compose(observable('myProp'), observable('myPropBis'))
    const obs = obsStamp();
    obs.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    obs.$on('myPropBis', myPropBis=> {
      t.equal(myPropBis, 'foo');
    });
    obs.myProp = 'bar';
    obs.myPropBis = 'foo';
  });

  tape('have multiple listeners', t=> {
    t.plan(2);
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.$on('myProp', myProp => {
      t.ok(true);
    });
    comp.myProp = 'foo';
  });

  tape('map a property to aria attribute', t=> {
    const stamp = mapToAria('foo', 'bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.end();
  });

  tape('map a property to aria attribute negating the value', t=> {
    const stamp = mapToAria('foo', '!bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], false);
    t.end();
  });

  tape('use arrity n api', t=> {
    const stamp = mapToAria('foo', 'bar', '!blah', 'woot');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-blah'], false);
    t.equal(inst.el['aria-woot'], true);
    t.end();
  });

  tape('should compose multiple times mapToAria', t=> {
    const stamp = compose(mapToAria('foo', 'bar'), mapToAria('blah', 'woot'));
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    inst.blah = false;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-woot'], false);
    t.end();
  });
}