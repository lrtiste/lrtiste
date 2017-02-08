import zora from 'zora';
import {expandable as factory} from '../index';
import {click, keydown} from './helpers';

function createExpandableSection () {
  const container = document.createElement('DIV');
  container.innerHTML = `
  <button id="toggler" type="button" aria-expanded="false" aria-controls="expandable">Expand</button>
  <div id="expandable"></div>
`;
  return container;
}

export default zora()
  .test('expandable init states', function * (t) {
    const element = createExpandableSection();
    const comp = factory({element});
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
  })
  .test('expand section on click', function * (t) {
    const element = createExpandableSection();
    const comp = factory({element});
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('expand on keydown arrow down', function * (t) {
    const element = createExpandableSection();
    const comp = factory({element});
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
  })
  .test('close on click', function * (t) {
    const element = createExpandableSection();
    const comp = factory({element});
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');
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
    const element = createExpandableSection();
    const comp = factory({element});
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should default to aria-expanded=false');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should default to aria-hidden=true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true', 'should have expanded');
    t.equal(section.getAttribute('aria-hidden'), 'false', 'should display the section');
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false', 'should have closed it');
    t.equal(section.getAttribute('aria-hidden'), 'true', 'should have hide the section');
  })
  .test('expandable: clean', function * (t) {
    let counter = 0;
    const element = createExpandableSection();
    const comp = factory({element});
    const increment = () => counter++;
    comp.onExpandedChange(increment);
    comp.onclick(increment);
    comp.onkeydown(increment);
    comp.expander().onkeydown(increment);
    comp.expander().onclick(increment);
    comp.expandable().onkeydown(increment);
    comp.expandable().onclick(increment);
    const button = element.querySelector('#toggler');
    const section = element.querySelector('#expandable');

    comp.clean();

    comp.refresh();
    click(button);
    click(section);
    keydown(button, {});
    keydown(section, {});
    t.equal(counter, 0);
  });
