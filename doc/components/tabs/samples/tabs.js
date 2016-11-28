import {tabList} from '../../../../components/tabs'; //lrtiste/components/tabs

export function bootstrap () {
  const tablistFactory = tabList();
  return tablistFactory({el: document.getElementById('progressive-tabs')});
}