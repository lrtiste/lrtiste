import {ariaElement} from '../../../../behaviours/elements';
import {mapToAria} from '../../../../behaviours/observables';
import {toggle} from '../../../../behaviours/toggle';
import {compose, init} from 'stampit';

/*handle the events*/
const checkboxEventBindingStamp = init(function () {
  //mouse interaction
  this.el.addEventListener('click', ()=>this.toggle());
  //keyboard interaction
  this.el.addEventListener('keydown', (ev)=> {
    const {keyCode:k} = ev;
    if (k === 32) { //SPACE key
      this.toggle();
    }
  });
});

// our composable checkbox factory
const checkboxStamp = compose(
  ariaElement({ariaRole: 'checkbox'}), //throw an exception if the element used has not the role "checkbox"
  toggle('checked'),//add a dual state property "checked" which can be changed using the method "toggle()"
  mapToAria('checked', 'checked'), //make the property "checked" observable and set the attribute "aria-checked" to the value of "checked" property whenever it changes
  checkboxEventBindingStamp //add the event binding
);

//bootstrap: create an checkbox component for every element on the page with the role checkbox
for (const cb of document.querySelectorAll('[role=checkbox]')) {
  checkboxStamp({el: cb});
}
