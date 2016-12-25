import zora from 'zora';
import {tabList} from '../../components/tabs';
import {click, keydown} from '../helpers';

const factory = tabList();

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
  .test('tabs: set up initial states', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
  })
  .test('select an other tab closing the others', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
    const [tab1,tab2,tab3] = el.querySelectorAll('[role=tab]');
    click(tab2);
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'}
    ], t);
  })
  .test('select previous tab using left arrow', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
    const [tab1,tab2,tab3] = el.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowLeft'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'}
    ], t);
    keydown(tab3, {key: 'ArrowLeft'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'}
    ], t);
  })
  .test('select previous tab using up arrow', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
    const [tab1,tab2,tab3] = el.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowUp'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'}
    ], t);
    keydown(tab3, {key: 'ArrowUp'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'}
    ], t);
  })
  .test('select next tab using right arrow', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
    const [tab1,tab2,tab3] = el.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowRight'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'}
    ], t);
    keydown(tab2, {key: 'ArrowRight'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'}
    ], t);
    keydown(tab3, {key: 'ArrowRight'});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
  })
  .test('select next tab using down arrow', function * (t) {
    const el = createTablist();
    const tabList = factory({el});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
    const [tab1,tab2,tab3] = el.querySelectorAll('[role=tab]');
    tab1.focus();
    keydown(tab1, {key: 'ArrowDown'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'}
    ], t);
    keydown(tab2, {key: 'ArrowDown'});
    testTab(tabList.el, [
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'true', 'tabindex': '0'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'false'}
    ], t);
    keydown(tab3, {key: 'ArrowDown'});
    testTab(tabList.el, [
      {'aria-selected': 'true', 'tabindex': '0'},
      {'aria-selected': 'false', 'tabindex': '-1'},
      {'aria-selected': 'false', 'tabindex': '-1'}
    ], t);
    testTabPanels(tabList.el, [
      {'aria-hidden': 'false'},
      {'aria-hidden': 'true'},
      {'aria-hidden': 'true'}
    ], t);
  });
