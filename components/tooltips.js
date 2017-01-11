import {ariaElement} from '../behaviours/elements';
import {init, compose, methods} from 'stampit';


const tooltipEventBindingStamp = init(function tooltipEventBinding () {
  this.target.addEventListener('focus', this.show.bind(this));
  this.target.addEventListener('keydown', event=> {
    const {key:k} =event;
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
    methods({
      hide(){
        if (document.getElementById(this.el.id)) {
          this.el.remove();
        }
      },
      show(){
        if (!document.getElementById(this.el.id)) {
          //always reuse the same element
          this.target.insertAdjacentElement('afterend', this.el);
        }
      },
    }), init(function initializeTooltip () {
      const id = this.el.getAttribute('id');
      if (!id) {
        console.log(this.el);
        throw new Error('the above tooltip element must have an id');
      }
      const target = document.querySelector(`[aria-describedby=${id}]`);
      if (!target) {
        console.warn('there is no target element described by the tooltip ' + id);
      }
      Object.defineProperty(this, 'target', {value: target});

      this.hide();
    }), tooltipEventBindingStamp);
}
