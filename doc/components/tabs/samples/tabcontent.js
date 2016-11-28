import {tabList} from '../../../../components/tabs'; //lrtiste/components/tabs
import {compose, init} from 'stampit';

// we use stampit to compose our factories, it is not mandatory (the default Object.extend could work)
export function bootstrap () {
  const tablistFactory = compose(tabList(), init(function () {
    //not mandatory but when javascript is available we prevent the tabs as link default behaviour
    for (const tab of this.el.querySelectorAll('a[role=tab]')) {
      tab.addEventListener('click', event=>event.preventDefault());
    }
  }));

  return tablistFactory({el: document.getElementById('tabcontent-sample')});
}