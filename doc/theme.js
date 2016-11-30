import {tabList} from '../components/tabs';
import {compose, init} from 'stampit';

const factory = compose(
  tabList(),
  init(function () {
    for (const tab of this.el.querySelectorAll('a[role=tab]')) {
      tab.addEventListener('click', event=>event.preventDefault());
    }
  })
);

const nodeList = document.querySelectorAll('[data-lrtiste-tabs]');
for (const tlist of nodeList) {
  factory({el: tlist});
}
