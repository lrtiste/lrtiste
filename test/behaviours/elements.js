import zora from 'zora';
import {element} from '../../behaviours/elements';

export default zora().test('throw an error if element argument is not provided', function * (t) {
  try {
    const elStamp = element();
    const comp = elStamp();
    t.fail('should have thrown an error');
  } catch (e) {
    t.equal(e.message, 'You must provide a dom element as "el" property');
  }
})
  .test('should set the readonly prop "el" on the instance', function * (t) {
    try {
      const elStamp = element();
      const domEl = 'dom element';
      const comp = elStamp({el: domEl});
      t.equal(comp.el, domEl);
      comp.el = 'foo';
      t.fail('should have thrown an error');
    } catch (e) {
      t.ok(e, 'error should be defined');
    }
  })
  .test('should be able to rename the property', function * (t) {
    try {
      const elStamp = element({propertyName: 'foo'});
      const domEl = 'dom element';
      const comp = elStamp({foo: domEl});
      t.equal(comp.foo, domEl);
      comp.foo = 'foo';
      t.fail('should have thrown an error')
    } catch (e) {
      t.ok(e, 'the error should be defined')
    }
  });
