import zora from 'zora';
import {expandable} from '../../components/menus';
import {click, keydown} from '../helpers';

const factory = expandable();

function createExpandableSection () {
  const container = document.createElement('DIV');
  container.innerHTML = `
  <button id="toggler" type="button" aria-haspopup="true" aria-controls="expandable">Expand</button>
  <div id="expandable"></div>
`;
  return container;
}

export default zora()
  .test('expandable init states', function * (t) {
    const el = createExpandableSection();
    const comp = factory({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
  })
  .test('expand section on click', function * (t) {
    const el = createExpandableSection();
    const comp = factory({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('expand on keydown arrow down', function * (t) {
    const el = createExpandableSection();
    const comp = factory({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('close on click', function * (t) {
    const el = createExpandableSection();
    const comp = factory({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  })
  .test('close on arrow up', function * (t) {
    const el = createExpandableSection();
    const comp = factory({el});
    const button = el.querySelector('#toggler');
    const section = el.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  });
