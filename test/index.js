import accordion from './accordion';
import tablist from './tablist';
import dropdown from './dropdown';
import expandable from './expandable';
import menubar from './menubar';
import zora from 'zora';

zora()
  .test(tablist)
  .test(dropdown)
  .test(expandable)
  .test(menubar)
  .test(accordion)
  .run();
