import {test as elements} from './elements';
import {test as observable} from './observable';
import {test as toggle} from './toggle';
import {test as list} from './listMediators';

export function test (tape) {
  elements(tape);
  observable(tape);
  toggle(tape);
  list(tape);
}