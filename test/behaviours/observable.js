import {observable, mapToAria} from '../../behaviours/observables';
import {compose} from 'stampit';
import zora from 'zora';


function mockElement () {
  return {
    setAttribute(attr, val){
      this[attr] = val;
    }
  }
}

export default zora()
  .test('observe a property and get notified with the new value', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
  })
  .test('do not get notified if the value remains the same', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.myProp = 'foo';
    comp.myProp = 'foo';
  })
  .test('manually emit a change event', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'bar');
    });
    comp.$onChange('myProp', 'bar');
  })
  .test('use arrity n api', t=> {
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
  })
  .test('compose multiple times with observable', t=> {
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
  })
  .test('have multiple listeners', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
    });
    comp.$on('myProp', myProp => {
      t.ok(true);
    });
    comp.myProp = 'foo';
  })
  .test('map a property to aria attribute', t=> {
    const stamp = mapToAria('foo', 'bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
  })
  .test('map a property to aria attribute negating the value', t=> {
    const stamp = mapToAria('foo', '!bar');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], false);
  })
  .test('use arrity n api', t=> {
    const stamp = mapToAria('foo', 'bar', '!blah', 'woot');
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-blah'], false);
    t.equal(inst.el['aria-woot'], true);
  })
  .test('should compose multiple times mapToAria', t=> {
    const stamp = compose(mapToAria('foo', 'bar'), mapToAria('blah', 'woot'));
    const inst = stamp({el: mockElement()});
    inst.foo = true;
    inst.blah = false;
    t.equal(inst.el['aria-bar'], true);
    t.equal(inst.el['aria-woot'], false);
  });