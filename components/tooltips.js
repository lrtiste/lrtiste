import {ariaElement} from '../behaviours/elements';
import {observable} from '../behaviours/observables';
import {init, compose, methods} from 'stampit';

const tooltipEventBindingStamp = init(function tooltipEventBinding () {
  this.target.addEventListener('focus', this.show.bind(this));
  this.target.addEventListener('keydown', event => {
    const {key: k} = event;
    if (k === 'Escape') {
      this.hide();
    }
  });
  this.target.addEventListener('blur', this.hide.bind(this));
  this.target.addEventListener('mouseenter', this.show.bind(this));
  this.target.addEventListener('mouseleave', this.hide.bind(this));
});

export function tooltip () {
  return compose(
    ariaElement({ariaRole: 'tooltip'}),
    observable('isOpen'),
    methods({
      hide() {
        if (this.el.parentNode !== null) {
          this.el.remove();
        }
        this.isOpen = false;
      },
      show() {
        if (this.el.parentNode === null) {
          //always reuse the same element
          this.target.insertAdjacentElement('afterend', this.el);
        }
        this.isOpen = true;
      }
    }),
    init(function initializeTooltip () {
      const id = this.el.getAttribute('id');
      if (!id) {
        console.log(this.el);
        throw new Error('the above tooltip element must have an id');
      }
      const targetElement = document.querySelector(`[aria-describedby=${id}]`);
      if (!targetElement) {
        console.warn(
          'there is no target element described by the tooltip ' + id
        );
      }
      Object.defineProperty(this, 'target', {value: targetElement});
      this.hide();
    }),
    tooltipEventBindingStamp
  );
}
