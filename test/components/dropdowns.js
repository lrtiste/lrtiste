import zora from 'zora';
import {dropdown} from '../../components/menus';
import {click, keydown} from '../helpers';

const factory = dropdown();

function createDropdown () {
  const container = document.createElement('DIV');
  container.innerHTML = `
      <button aria-controls="menu-sample" type="button" aria-haspopup="true">Actions</button>
      <ul id="menu-sample" role="menu">
        <li role="menuitem">action 1</li>
        <li role="menuitem">action 2</li>
        <li role="menuitem">action 3</li>
      </ul>
    `;
  return container;
}

function testMenuItems (dropdown, expected, t) {
  const tabs = dropdown.querySelectorAll('[role=menuitem]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(tabs[i].getAttribute(attr), expected[i][attr], `menuitem[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


export default zora()
  .test('dropdown: init states', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open on click', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close on click', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open menu on arrow down', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Enter', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'Enter'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Space', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {code: 'Space'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on arrow up', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: select previous item with left arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowLeft'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowLeft'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select previous item with up arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowUp'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowUp'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with right arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowRight'});
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with down arrow', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowDown'});
    testMenuItems(el, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on escape keydown', function * (t) {
    const el = createDropdown();
    const dropDown = factory({el});
    const button = el.querySelector('button');
    const menu = el.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    const [item1, item2, item3] = el.querySelectorAll('[role=menuitem]');
    keydown(item1,{key:'Escape'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  });
