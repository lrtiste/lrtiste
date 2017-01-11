import zora from 'zora';
import accordions from './accordions';
import tabs from './tabs';
import exp from './expandables';
import dropdown from './dropdowns';
import menubar from './menubars';

export default zora()
  .test(accordions)
  .test(tabs)
  .test(exp)
  .test(dropdown)
  .test(menubar);