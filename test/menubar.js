import zora from 'zora';
import {menubar as factory} from '../index';
import {click, keydown} from './helpers';

function createMenubar () {
  const menuBar = document.createElement('UL');
  menuBar.setAttribute('role', 'menubar');
  menuBar.innerHTML = `
        <li role="menuitem">
          <button id="b1" type="button" aria-expanded="false" aria-haspopup="true" tabindex="0" aria-controls="submenu1">Menu 1</button>
          <ul id="submenu1" aria-labelledby="b1" role="menu">
            <li role="menuitem">sub action 1.1</li>
            <li role="menuitem">sub action 1.2</li>
            <li role="menuitem">sub action 1.3</li>
            <li role="menuitem">sub action 1.4</li>
          </ul>
        </li>
        <li role="menuitem">
          <button id="b2" type="button" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-controls="submenu2">Menu 2</button>
          <ul id="submenu2" aria-labelledby="b2" role="menu">
            <li role="menuitem">sub action 2.1</li>
            <li role="menuitem">sub action 2.2</li>
            <li role="menuitem">sub action 2.3</li>
          </ul>
        </li>
        <li role="menuitem"><span>Some single action</span></li>
        <li role="menuitem">
          <button id="b4" type="button" aria-expanded="false" aria-haspopup="true" tabindex="-1" aria-controls="submenu4">Menu 3</button>
          <ul id="submenu4" aria-labelledby="b4" role="menu">
            <li role="menuitem">sub action 4.1</li>
            <li role="menuitem">sub action 4.2</li>
          </ul>
        </li>
`;
  return menuBar;
}


export default zora()
  .test('menubars: init states', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu on click', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    const items = m2.querySelectorAll('li[role=menuitem]');
    click(b2);
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with keydown', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Enter', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    keydown(b2, {key: 'Enter'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: open sub menu with Space', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    keydown(b2, {code: 'Space'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('aria-expanded'), 'true');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'false');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: navigate to next menu with right arrow', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    keydown(b1, {key: 'ArrowRight'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '0');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    mb.activateItem(3);
    keydown(b3, {key: 'ArrowRight'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('menubars: select previous menu item with left arrow', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    keydown(b1, {key: 'ArrowLeft'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '-1');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '0');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
    mb.activateItem(1);
    keydown(b2, {key: 'ArrowLeft'});
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');
  })
  .test('submenu: select previous menu item using up arrow', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    t.equal(b1.getAttribute('aria-expanded'), 'false');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'true');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    //open menu
    keydown(b1, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1, si2, si3, si4] = m1.querySelectorAll('[role=menuitem]');
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    keydown(si1, {key: 'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '0');
    keydown(si4, {key: 'ArrowUp'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '0');
    t.equal(si4.getAttribute('tabindex'), '-1');
  })
  .test('submenu: select next menu item using down arrow', function * (t) {
    const element = createMenubar();
    const mb = factory({element});
    const [b1, b2, b3] = element.querySelectorAll('button[aria-haspopup=true]');
    const [m1, m2, m3] = element.querySelectorAll('ul[role=menu]');
    //open menu
    keydown(b1, {key: 'ArrowDown'});
    t.equal(b1.getAttribute('aria-expanded'), 'true');
    t.equal(b1.getAttribute('tabindex'), '0');
    t.equal(b2.getAttribute('aria-expanded'), 'false');
    t.equal(b2.getAttribute('tabindex'), '-1');
    t.equal(b3.getAttribute('aria-expanded'), 'false');
    t.equal(b3.getAttribute('tabindex'), '-1');
    t.equal(m1.getAttribute('aria-hidden'), 'false');
    t.equal(m2.getAttribute('aria-hidden'), 'true');
    t.equal(m3.getAttribute('aria-hidden'), 'true');

    const [si1, si2, si3, si4] = m1.querySelectorAll('[role=menuitem]');
    const firstSubMenuComp = mb.item(0).menu();
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    keydown(si1, {key: 'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'), '-1');
    t.equal(si2.getAttribute('tabindex'), '0');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
    //artificially set last sub item
    firstSubMenuComp.activateItem(3);
    keydown(si4, {key: 'ArrowDown'});
    t.equal(si1.getAttribute('tabindex'), '0');
    t.equal(si2.getAttribute('tabindex'), '-1');
    t.equal(si3.getAttribute('tabindex'), '-1');
    t.equal(si4.getAttribute('tabindex'), '-1');
  });
