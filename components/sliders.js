import {ariaElement} from '../behaviours/elements';
import {sliderStamp} from '../behaviours/sliders';
import {observable} from '../behaviours/observables';
import {compose, init} from 'stampit';

const sliderEventBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {keyCode:k} = event;
    if (k === 37 || k === 40) {
      this.decrement();
    }
    else if (k === 38 || k === 39) {
      this.increment();
    }
  });
});

const sliderLinking = init(function () {
  this.minValue = +(this.el.getAttribute('aria-valuemin'));
  this.maxValue = +(this.el.getAttribute('aria-valuemax'));
  this.currentValue = +(this.el.getAttribute('aria-valuenow'));

  this.$on('currentValue', val => {
    this.el.setAttribute('aria-valuenow', val);
    this.el.setAttribute('aria-valuetext', this.valueText);
  });

  this.$on('minValue', value => {
    this.el.setAttribute('aria-valuemin', value);
  });
  this.$on('maxValue', value => {
    this.el.setAttribute('aria-valuemax', value);
  });
});


export function slider () {
  return compose(
    ariaElement({ariaRole: 'slider'}),
    observable('minValue', 'maxValue'),
    sliderLinking,
    sliderStamp,
    sliderEventBinding
  );
}

export function rangeSlider () {

}
