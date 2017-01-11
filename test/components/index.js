import zora from 'zora';
import accordions from './accordions';
import tabs from './tabs';
import exp from './expandables';
import dropdown from './dropdowns';
import menubar from './menubars';
import tooltip from './tooltips';

export default zora()
  .test(accordions)
  .test(tabs)
  .test(exp)
  .test(dropdown)
  .test(menubar)
  .test(tooltip);