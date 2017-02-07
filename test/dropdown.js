import zora from 'zora';
import {dropdown as factory} from '../index';
import {click, keydown} from './helpers';

function createDropdown () {
  const container = document.createElement('DIV');
  container.innerHTML = `
      <button aria-controls="menu-sample" type="button" aria-expanded="false" aria-haspopup="true">Actions</button>
      <ul id="menu-sample" role="menu">
        <li role="menuitem">action 1</li>
        <li role="menuitem">action 2</li>
        <li role="menuitem">action 3</li>
      </ul>
    `;
  return container;
}

function testMenuItems (dropdown, expected, t) {
  const menuitems = dropdown.querySelectorAll('[role=menuitem]');
  for (let i = 0; i < expected.length; i++) {
    for (let attr of Object.keys(expected[i])) {
      t.equal(menuitems[i].getAttribute(attr), expected[i][attr], `menuitem[${i}] attribute ${attr} should equal ${expected[i][attr]}`);
    }
  }
}


export default zora()
  .test('dropdown: init states', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open on click', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close on click', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: open menu on arrow down', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Enter', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'Enter'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: open menu on Space', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {code: 'Space'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on arrow up', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    keydown(button, {key: 'ArrowDown'});
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    keydown(button, {key: 'ArrowUp'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: select previous item with up arrow', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = element.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowUp'});
    testMenuItems(element, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowUp'});
    testMenuItems(element, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: select next item with down arrow', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
    const [item1, item2, item3] = element.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'ArrowDown'});
    testMenuItems(element, [
      {tabindex: '-1'},
      {tabindex: '0'},
      {tabindex: '-1'}
    ], t);
    keydown(item2, {key: 'ArrowDown'});
    testMenuItems(element, [
      {tabindex: '-1'},
      {tabindex: '-1'},
      {tabindex: '0'}
    ], t);
    keydown(item3, {key: 'ArrowDown'});
    testMenuItems(element, [
      {tabindex: '0'},
      {tabindex: '-1'},
      {tabindex: '-1'}
    ], t);
  })
  .test('dropdown: close menu on escape keydown', function * (t) {
    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
    click(button);
    t.equal(button.getAttribute('aria-expanded'), 'true');
    t.equal(menu.getAttribute('aria-hidden'), 'false');
    const [item1, item2, item3] = element.querySelectorAll('[role=menuitem]');
    keydown(item1, {key: 'Escape'});
    t.equal(button.getAttribute('aria-expanded'), 'false');
    t.equal(menu.getAttribute('aria-hidden'), 'true');
  })
  .test('dropdown: clean', function * (t) {
    let counter = 0;

    const increment = () => counter++;

    const element = createDropdown();
    const dropDown = factory({element});
    const button = element.querySelector('button');
    const menu = element.querySelector('#menu-sample');

    dropDown.onclick(increment);
    dropDown.onkeydown(increment);
    dropDown.onExpandedChange(increment);
    dropDown.expander().onclick(increment);
    dropDown.menu().onclick(increment);
    dropDown.expandable().onclick(increment);
    dropDown.expander().onkeydown(increment);
    dropDown.menu().onkeydown(increment);
    dropDown.expandable().onkeydown(increment);
    for (let i = 0; i < 3; i++) {
      dropDown.menu().item(i).onkeydown(increment);
      dropDown.menu().item(i).onclick(increment);
    }

    dropDown.clean();

    dropDown.refresh();
    click(button);
    click(menu);
    click(element);
    keydown(button, {});
    keydown(menu, {});
    keydown(element, {});
    for (let i = 0; i < 3; i++) {
      click(dropDown.menu().item(i).element());
      keydown(dropDown.menu().item(i).element(),{});
    }

    t.equal(counter, 0);

  })
