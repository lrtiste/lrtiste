import {expandable} from '../../../../components/menus'
import {compose, init} from 'stampit';

export function bootstrap () {
  const expandableFactory = compose(
    expandable()
    , init(function () {
      //as we have javascript we explicitly set the button role on the checkbox
      const checkbox = this.el.querySelector('input[type=checkbox]');
      checkbox.setAttribute('role', 'button');

      // and we prevent default checkbox event binding
      // to give control back to the expandable component script
      checkbox.addEventListener('keydown', ev=>ev.preventDefault());
      checkbox.addEventListener('click', ev=> ev.preventDefault());
    }));

  return expandableFactory({el: document.getElementById('checkbox-expandable')});
}


