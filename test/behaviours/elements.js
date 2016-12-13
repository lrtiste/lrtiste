import {element} from '../../behaviours/elements';

export function test (tape) {

  tape('throw an error if element argument is not provided', t=> {
    try {
      const elStamp = element();
      const comp = elStamp();
      t.end(new Error('should have thrown'))
    } catch (e) {
      t.equal(e.message, 'You must provide a dom element as "el" property');
      t.end();
    }
  });

  tape('should set the readonly prop "el" on the instance', t=> {
    try {
      const elStamp = element();
      const domEl = 'dom element';
      const comp = elStamp({el: domEl});
      t.equal(comp.el, domEl);
      comp.el = 'foo'
    } catch (e) {
      t.end();
    }
  });

  tape('should be able to rename the property', t=> {
    try {
      const elStamp = element({propertyName: 'foo'});
      const domEl = 'dom element';
      const comp = elStamp({foo: domEl});
      t.equal(comp.foo, domEl);
      comp.foo = 'foo'
    } catch (e) {
      t.end();
    }
  });
}

