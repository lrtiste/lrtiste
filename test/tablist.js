import zora from 'zora';
import {tablist as factory} from '../index';
import {click, keydown} from './helpers';

function createTablist () {
  const container = document.createElement('div');
  container.innerHTML = `
<ul role="tablist">
  <li role="presentation"><a href="#panel1" role="tab"
                             aria-controls="panel1" aria-selected="true">Markup</a></li>
  <li role="presentation"><a href="#panel2" role="tab"
                             aria-controls="panel2">Style</a>
  </li>
  <li role="presentation"><a href="#panel3" role="tab"
                             aria-controls="panel3">Script</a>
  </li>
</ul>
<div id="panel1" role="tabpanel"><h4 tabindex="0">panel 1 !!</h4>
  <p>panel content</p>
</div>
<div id="panel2" role="tabpanel"><h4 tabindex="0">panel 2 !!</h4>
  <p>panel content 2</p>
</div>
<div id="panel3" role="tabpanel"><h4 tabindex="0">panel 3 !!</h4>
  <p>panel content 3</p>
</div>
`;
  return container;
}

function testTab (container, expected, t) {
  const tabs = container.querySelectorAll('[role=tab]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(
        tabs[i].getAttribute(attr),
        expected[i][attr],
        `tabs[${i}] attribute ${attr} should equal ${expected[i][attr]}`
      );
    }
  }
}

function testTabPanels (container, expected, t) {
  const tabs = container.querySelectorAll('[role=tabpanel]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(
        tabs[i].getAttribute(attr),
        expected[i][attr],
        `tabpanel  [${i}] attribute ${attr} should equal ${expected[i][attr]}`
      );
    }
  }
}

export default zora()
  .test('tabs: set up initial states', function* (t) {
    const element = createTablist();
    const tabList = factory({element});
    testTab(
      element,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select an other tab closing the others', function* (t) {
    const element = createTablist();
    const tabList = factory({element});
    testTab(
      element,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element.querySelectorAll('[role=tab]');
    click(tab2);
    testTab(
      element,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select previous tab using left arrow', function* (t) {
    const element = createTablist();
    const tabList = factory({element});
    testTab(
      element,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowLeft'});
    testTab(
      element,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'}
      ],
      t
    );
    keydown(tab3, {key: 'ArrowLeft'});
    testTab(
      element,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('select next tab using right arrow', function* (t) {
    const element = createTablist();
    const tabList = factory({element});
    testTab(
      element,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    const [tab1, tab2, tab3] = element.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowRight'});
    testTab(
      element,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'}
      ],
      t
    );
    keydown(tab2, {key: 'ArrowRight'});
    testTab(
      element,
      [
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'true', 'tabindex': '0'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'false'}
      ],
      t
    );
    keydown(tab3, {key: 'ArrowRight'});
    testTab(
      element,
      [
        {'aria-selected': 'true', 'tabindex': '0'},
        {'aria-selected': 'false', 'tabindex': '-1'},
        {'aria-selected': 'false', 'tabindex': '-1'}
      ],
      t
    );
    testTabPanels(
      element,
      [
        {'aria-hidden': 'false'},
        {'aria-hidden': 'true'},
        {'aria-hidden': 'true'}
      ],
      t
    );
  })
  .test('tab: clean', function* (t) {
    let counter = 0;
    const increment = () => counter++;
    const element = createTablist();
    const tabList = factory({element});

    tabList.onActiveItemChange(increment);
    tabList.onclick(increment);
    tabList.onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      tabList.tabPanel(i).onclick(increment);
      tabList.tab(i).onclick(increment);
      tabList.tabPanel(i).onkeydown(increment);
      tabList.tab(i).onkeydown(increment);
    }

    tabList.clean();

    tabList.refresh();
    click(tabList.element());
    keydown(tabList.element(), {});
    for (let i = 0; i < 3; i++) {
      click(tabList.tabPanel(i).element());
      keydown(tabList.tab(i).element(), {});
    }

    t.equal(counter, 0);
  });
