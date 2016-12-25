import zora from 'zora';
import accordions from './accordions';
import tabs from './tabs';
import exp from './expandables';

export default zora()
  .test(accordions)
  .test(tabs)
  .test(exp);