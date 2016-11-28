import {compose, init} from 'stampit';
import {accordion} from '../../components/accordions';

// const accordionFactory = compose(accordion(), init(function () {
//   for (const item of this.el.querySelectorAll('[role=tab]')) {
//     item.addEventListener('keydown', event=> {
//       const {keyCode:k} =event;
//       if (k === 13 || k === 32) {
//         event.preventDefault();
//       }
//     })
//   }
// }));

const acc = accordion()({el: document.querySelector('[role=tablist]')});
