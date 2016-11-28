import {tabList} from '../components/tabs';

const factory = tabList();

const nodeList = document.querySelectorAll('[data-lrtiste-tabs]');
for (const tlist of nodeList){
  factory({el:tlist});
}
