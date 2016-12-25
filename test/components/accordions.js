import zora from 'zora';
import {accordion} from '../../components/accordions';
import {click, keydown} from '../helpers';

const factory = accordion();

function createAccordion () {

  const container = document.createElement('div');
  container.setAttribute('role', 'tablist');
  container.innerHTML = `
  <h4 id="tab1" tabindex="0" role="tab" aria-controls="tabpanel1">Header one</h4>
  <p id="tabpanel1" aria-labelledby="tab1" role="tabpanel">Content of section 1 with a <a href="#foo">focusable element</a></p>
  <h4 id="tab2" role="tab" aria-controls="tabpanel2"><span class="adorner" aria-hidden="true"></span>Header two</h4>
  <p id="tabpanel2" aria-labelledby="tab2" role="tabpanel">Content of section 2 with a <a href="#foo">focusable element</a></p>
  <h4 id="tab3" role="tab" aria-controls="tabpanel3"><span class="adorner" aria-hidden="true"></span>Header three</h4>
  <p id="tabpanel3" aria-labelledby="tab3" role="tabpanel">Content of section 3 with a <a href="#foo">focusable element</a></p>
`;
  return container;
}

function testTab (accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=tab]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `tabs[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}

function testTabPanels (accordion, expected, t) {
  const tabs = accordion.querySelectorAll('[role=tabpanel]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `tabpanel  [${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}

export default zora()
  .test('accordion: set up initial states ', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open an accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: close an accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open two accordion on click', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab1 = el.querySelector('#tab1');
    click(tab1);
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    const tab3 = el.querySelector('#tab3');
    click(tab3);
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'true',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0',
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }], t);
  })
  .test('accordion: open on key down enter', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    keydown(tab2, {key: 'Enter'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion: open on key down space', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    keydown(tab2, {code: 'Space'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'true',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'false'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select previous item on left arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab1 = el.querySelector('#tab1');
    tab2.focus();
    keydown(tab2, {key: 'ArrowLeft'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab1.focus();
    keydown(tab1, {key: 'ArrowLeft'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select previous item on up arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab1 = el.querySelector('#tab1');
    tab2.focus();
    keydown(tab2, {key: 'ArrowUp'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab1.focus();
    keydown(tab1, {key: 'ArrowUp'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select next item on right arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab3 = el.querySelector('#tab3');
    tab2.focus();
    keydown(tab2, {key: 'ArrowRight'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab3.focus();
    keydown(tab3, {key: 'ArrowRight'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })
  .test('accordion select next item on down arrow', function * (t) {
    const el = createAccordion();
    const acc = factory({el});
    const tab2 = el.querySelector('#tab2');
    const tab3 = el.querySelector('#tab3');
    tab2.focus();
    keydown(tab2, {key: 'ArrowDown'});
    testTab(acc.el, [
      {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
    tab3.focus();
    keydown(tab3, {key: 'ArrowDown'});
    testTab(acc.el, [
      {
        'aria-selected': 'true',
        'aria-expanded': 'false',
        tabindex: '0'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }, {
        'aria-selected': 'false',
        'aria-expanded': 'false',
        tabindex: '-1'
      }
    ], t);
    testTabPanels(acc.el, [{
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }, {
      'aria-hidden': 'true'
    }], t);
  })





