import {observable} from './lib/observable';
import {default as stampit} from 'stampit';
import {element} from './lib/element';
import {list} from './lib/list';
import {accordion} from './components/accordion';

const accordionStamp = accordion()

for (const tablist of document.querySelectorAll('[role="tablist"]')) {
  accordionStamp({el:tablist});
}

