import {statics} from 'stampit';

export function debug () {
  return statics({
    assert(rule, selector,level='warning'){
      this.rules = this.rules || [];
      this.rules.push({rule,selector,level});
      return this;
    }
  })
    .init(function (opts, {stamp}) {
      const errors =[];
      for (const r of stamp.rules){
        const {rule,selector,level} = r;
        const faultyElements = this.el.querySelectorAll(selector);
        if(faultyElements.length){
          errors.push(...faultyElements.map(fe=>{return {el:fe,rule,selector,level}}));
        }
      }
      if(errors.length){
        console.warn('please check markup for');
        console.log(this.el);
        console.table(errors);
      }
    })
}