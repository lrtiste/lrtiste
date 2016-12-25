import behaviours from './behaviours';
import components from './components';
import zora from 'zora';

zora()
  .test(behaviours)
  .test(components)
  .run()
  .catch(e=>console.log(e));