import{init, compose, methods} from 'stampit';
import {observable} from './observables';


const sliderInit = init(function ({stepSize = 1, valueTextFn = val => val}) {
  Object.defineProperty(this, 'stepSize', {value: stepSize});
  Object.defineProperty(this, 'valueText', {
    get(){
      return valueTextFn(this.currentValue);
    }
  });
});

const behaviour = init(function () {

  let value = this.currentValue || this.minValue;

  this.increment = function (steps = 1) {
    value = Math.min(value + steps * this.stepSize, this.maxValue);
    this.$onChange('currentValue', value); // manual emit (to keep the value private)
  };

  this.decrement = function (steps = 1) {
    value = Math.max(value - steps * this.stepSize, this.minValue);
    this.$onChange('currentValue', value); // manual emit (to keep the value private)
  };

  Object.defineProperty(this, 'currentValue', {
    get(){
      return value;
    }
  });

  this.$onChange('currentValue', this.currentValue);
});

const sliderStamp = compose(sliderInit, observable(), behaviour);

export {sliderStamp}