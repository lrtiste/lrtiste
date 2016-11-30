import {expandable} from '../../../../components/menus';

export function bootstrap () {
  const factory = expandable();
  return factory({el: document.getElementById('button-expandable')})
}