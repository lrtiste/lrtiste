import  elements from './elements';
import observable from './observable';
import toggle from './toggle';
import list from './listMediators';
import zora from 'zora';

export default zora()
  .test(elements)
  .test(observable)
  .test(toggle)
  .test(list)