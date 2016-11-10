import {tabList, tabStamp} from './components/tabs';
import {dropdown, menuBar} from './components/menus';
import {slider} from './components/sliders'
import {compose, init} from 'stampit';


// const animatedTab = compose(
//   tabStamp(),
//   init(function () {
//     this.$on('isOpen', isOpen => {
//       this.tabpanel.el.classList.toggle('expanded', isOpen);
//     });
//     this.$onChange('isOpen', this.isOpen);
//   })
// );


//
// const animatatedTab = compose(accordionTab(), init(function () {
//   this.$on('isOpen', isOpen => {
//     if (isOpen) {
//       this.tabpanel.el.classList.remove('collapse');
//       this.tabpanel.el.classList.add('collapsing');
//       this.tabpanel.el.classList.add('in');
//       setTimeout(()=> {
//         this.tabpanel.el.classList.remove('collapsing');
//         this.tabpanel.el.classList.add('collapse');
//       }, 1000);
//     } else {
//       this.tabpanel.el.classList.remove('collapse');
//       this.tabpanel.el.classList.add('collapsing');
//       this.tabpanel.el.classList.add('in');
//       setTimeout(()=> {
//         this.tabpanel.el.classList.remove('collapsing');
//         this.tabpanel.el.classList.add('collapse');
//       }, 1000)
//     }
//
//   });
// }));


const factory = tabList();

const dropdownFactory = dropdown();

const menubarFactory = menuBar();

const sliderFactory = slider();

const tablist = factory({el: document.querySelector('.tabs')});

const ddown = dropdownFactory({el: document.getElementById('dropdown')});

const menubar = menubarFactory({el: document.querySelector('[role=menubar]')});

const slder = sliderFactory({
  el: document.querySelector('[role=slider]'),
  valueTextFn: val => `${val} woot`
});

