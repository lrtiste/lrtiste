import {observable} from '../../behaviours/observable';
import {default as tape} from 'tape';

export function test () {
  tape('observe a property and get notified with the new value', t=> {
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp', myProp => {
      t.equal(myProp, 'foo');
      t.end();
    });

    comp.myProp = 'foo';
  });

  tape('manually emit a change event',t=>{
    const obsStamp = observable('myProp');
    const comp = obsStamp();
    comp.$on('myProp',myProp =>{
      t.equal(myProp,'bar');
      t.end();
    });
    comp.$onChange('myProp','bar');
  });
}