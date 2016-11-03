import {test as elements} from './elements';
import {test as observable} from './observable';
import {test as list} from './list';
import {test as tabs} from './tabs';

export function test () {
  elements();
  observable();
  list();
  tabs();
}