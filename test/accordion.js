import zora from 'zora';
import {accordion as factory} from '../index';
import {click, keydown} from './helpers';

function createAccordion () {
  const container = document.createElement('div');
  container.innerHTML = `<div data-lrtiste-accordion-header><h4 id="tab1">
    <button aria-controls="tabpanel1" aria-expanded="true" class="focus-adorner">Header one</button>
  </h4>
  <div id="tabpanel1" role="region" aria-labelledby="tab1">Content of section 1 with a <a href="#foo">focusable
    element</a>
  </div>
  </div>
  <div data-lrtiste-accordion-header>
  <h4 id="tab2">
    <button aria-controls="tabpanel2" aria-expanded="false" class="focus-adorner">Header Two</button>
  </h4>
  <div id="tabpanel2" aria-labelledby="tab2" role="region">Content of section 2 with a <a href="#foo">focusable
    element</a></div>
   </div>
   <div data-lrtiste-accordion-header>
  <h4 id="tab3">
    <button aria-controls="tabpanel3" aria-expanded="false" class="focus-adorner">Third Header</button>
  </h4>
  <div id="tabpanel3" aria-labelledby="tab3" role="region">Content of section 3 with a <a href="#foo">focusable
    element</a></div>
    </div>
    `;
  return container;
}

function testAccordionActioners (accordion, expected, t) {
  const actioners = accordion.querySelectorAll('[data-lrtiste-accordion-header] button');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(actioners[i].getAttribute(attr), expected[i][attr], `accordion header[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}

function testAccordionSections (accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=region]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `accordion section  [${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


export default zora()
  .test('accordion: set up initial states ', function * (t) {
    const element = createAccordion();
    const acc = factory({element});
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false',
      }, {
        'aria-expanded': 'false',
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open an accordion on click', function * (t) {
    const element = createAccordion();
    const acc = factory({element});
    const tab2 = element.querySelector('[aria-controls=tabpanel2]');
    click(tab2);
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: close an accordion on click', function * (t) {
    const element = createAccordion();
    const acc = factory({element});
    const tab2 = element.querySelector('[aria-controls=tabpanel2]');
    click(tab2);
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
    click(tab2);
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down enter', function * (t) {
    const element = createAccordion();
    const acc = factory({element});
    const tab2 = element.querySelector('[aria-controls=tabpanel2]');
    keydown(tab2, {key: 'Enter'});
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down space', function * (t) {
    const element = createAccordion();
    const acc = factory({element});
    const tab2 = element.querySelector('[aria-controls=tabpanel2');
    keydown(tab2, {code: 'Space'});
    testAccordionActioners(element, [
      {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'true'
      }, {
        'aria-expanded': 'false'
      }
    ], t);
    testAccordionSections(element, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: clean', function * (t) {
    let counter = 0;
    const increment = () => counter++;
    const element = createAccordion();
    const acc = factory({element});
    acc.onActiveItemChange(increment);
    acc.onclick(increment);
    acc.onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      acc.section(i).expander().onclick(increment);
      acc.section(i).expander().onkeydown(increment);
      acc.section(i).expandable().onclick(increment);
      acc.section(i).expandable().onkeydown(increment);
    }

    acc.clean();

    acc.refresh();
    click(acc.element());
    keydown(acc.element(),{});
    for (let i = 0; i < 3; i++) {
      click(acc.section(i).expander().element());
      keydown(acc.section(i).expander().element(), {});
      click(acc.section(i).expandable().element());
      keydown(acc.section(i).expandable().element(), {});
    }

    t.equal(counter,0);
  });
