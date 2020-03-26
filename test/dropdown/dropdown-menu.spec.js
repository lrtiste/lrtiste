import {test} from 'zora';
import {body, DROPDOWN_MENU_TAG_NAME, DROPDOWN_MENUITEM_TAG_NAME, wait} from '../util.js';

const TOGGLE_TIME = 110;

const createMenu = () => {
    const el = document.createElement(DROPDOWN_MENU_TAG_NAME);
    el.innerHTML = `
<span slot="menu-button">Menu Label</span>
<${DROPDOWN_MENUITEM_TAG_NAME}><span>action 1</span></${DROPDOWN_MENUITEM_TAG_NAME}>
<${DROPDOWN_MENUITEM_TAG_NAME} id="custom-id">action 2</${DROPDOWN_MENUITEM_TAG_NAME}>
<${DROPDOWN_MENUITEM_TAG_NAME}>action 3</${DROPDOWN_MENUITEM_TAG_NAME}>
`;

    const button = el.shadowRoot.getElementById('menu-button.js');
    const menu = el.shadowRoot.getElementById('menu-content');

    return {button, menu, el};
};

/**
 * @test {DropdownMenu}
 */
test(`DropdownMenuComponent`, t => {
    t.test(`Empty Dropdown is connected`, t => {
        const el = document.createElement(DROPDOWN_MENU_TAG_NAME);
        body.appendChild(el);

        t.eq(el.length, 0);
        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedItem, null);
        t.notOk(el.open);

        const menuButton = el.shadowRoot.getElementById('menu-button.js');
        const menu = el.shadowRoot.getElementById('menu-content');
        t.eq(menuButton.getAttribute('aria-haspopup'), 'true');
        t.eq(menuButton.getAttribute('aria-expanded'), 'false');
        t.eq(menuButton.getAttribute('aria-controls'), 'menu-content');
        t.eq(menuButton.textContent, 'Menu', '"Menu" by default');
        t.eq(menu.getAttribute('role'), 'menu');
        t.eq(menu.getAttribute('aria-labelledby'), 'menu-button.js');
        t.ok(menu.hasAttribute('hidden'));
    });

    t.test(`toggle menu with attribute`, t => {
        const {el, button, menu} = createMenu();
        let eventArg;
        body.appendChild(el);

        el.addEventListener('toggle', ev => {
            eventArg = ev.open;
        });

        el.setAttribute('open', '');
        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));
        t.eq(eventArg, true, 'should have triggered event');

        el.removeAttribute('open');
        t.eq(el.open, false);
        t.eq(button.getAttribute('aria-expanded'), 'false');
        t.ok(menu.hasAttribute('hidden'));
        t.eq(eventArg, false, 'should have triggered event');
    });

    /** @test{DropdownMenu#open} */
    t.test(`toggle menu with property setter`, t => {
        const {el, button, menu} = createMenu();
        body.appendChild(el);

        el.open = true;
        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));

        el.open = false;
        t.eq(el.open, false);
        t.eq(button.getAttribute('aria-expanded'), 'false');
        t.ok(menu.hasAttribute('hidden'));
    });

    /** @test {DropdownMenuitem#toggleMenu} */
    t.test(`toggle menu with 'toggleMenu' method`, t => {
        const {el, button, menu} = createMenu();
        body.appendChild(el);

        t.eq(el.open, false);

        el.toggleMenu();

        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));

        el.toggleMenu();

        t.eq(el.open, false);
        t.eq(button.getAttribute('aria-expanded'), 'false');
        t.ok(menu.hasAttribute('hidden'));
    });

    /** @test{DropdownMenu#openMenu} */
    t.test(`open menu with 'openMenu' method`, t => {

        t.test(`with the first menuitem selected by default`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            el.openMenu();
            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 0, 'should have selected the first item by default');
        });

        t.test(`with the last menuitem selected`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();
            el.openMenu(true);
            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 2, 'should have selected the first item by default');
        });
    });

    t.test(`open menu when clicking on menu button`, async t => {
        const {el, button, menu} = createMenu();
        body.appendChild(el);

        // wait menuitem to trigger slot changed
        await wait();

        button.click();
        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));
        t.eq(el.selectedIndex, 0, 'should have selected the first item by default');
    });

    t.test(`open menu with keyboard`, t => {

        t.test(`pressing ArrowDown`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            button.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            }));

            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 0, 'should have selected the first item by default');
        });

        t.test(`pressing ArrowUp`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            button.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            }));

            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 2, 'should have selected the last item by default');
        });
    });

    /** @test{DropdownMenu#closeMenu} */
    t.test(`close menu with 'closeMenu' method`, t => {
        t.test(`when no focus flag`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            el.openMenu();
            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 0, 'should have selected the first item by default');

            el.closeMenu();
            t.eq(el.open, false);
            t.eq(button.getAttribute('aria-expanded'), 'false');
            t.ok(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, -1, 'should have unselected any item');
        });

        t.test(`when focus flag should focus toggle button`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            el.openMenu();
            t.eq(el.open, true);
            t.eq(button.getAttribute('aria-expanded'), 'true');
            t.notOk(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, 0, 'should have selected the first item by default');

            el.closeMenu(true);
            t.eq(el.open, false);
            t.eq(button.getAttribute('aria-expanded'), 'false');
            t.ok(menu.hasAttribute('hidden'));
            t.eq(el.selectedIndex, -1, 'should have unselected any item');
        });
    });

    t.test(`close menu when clicking on menu button`, async t => {
        const {el, button, menu} = createMenu();
        body.appendChild(el);

        // wait menuitem to trigger slot changed
        await wait();

        el.open = true;

        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));

        button.click();

        t.eq(el.open, false);
        t.eq(button.getAttribute('aria-expanded'), 'false');
        t.ok(menu.hasAttribute('hidden'));
    });

    t.test(`close menu with keyboard`, async t => {
        const {el, button, menu} = createMenu();
        body.appendChild(el);

        // wait menuitem to trigger slot changed
        await wait();

        el.open = true;

        t.eq(el.open, true);
        t.eq(button.getAttribute('aria-expanded'), 'true');
        t.notOk(menu.hasAttribute('hidden'));

        menu.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape'
        }));

        t.eq(el.open, false);
        t.eq(button.getAttribute('aria-expanded'), 'false');
        t.ok(menu.hasAttribute('hidden'));
    });

    t.test(`navigate between items with keyboard`, t => {

        t.test(`going down`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            el.openMenu();

            t.eq(el.selectedIndex, 0);

            const key = 'ArrowDown';
            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 1);

            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 2);

            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 0, 'should have gone back to first menu item');
        });

        t.test(`going up`, async t => {
            const {el, button, menu} = createMenu();
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            el.openMenu(true);

            t.eq(el.selectedIndex, 2);

            const key = 'ArrowUp';

            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 1);

            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 0);

            el.selectedItem.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                bubbles: true
            }));

            t.eq(el.selectedIndex, 2, 'should have gone back to first menu item');
        });

    });

    t.test(`activate item on click`, async t => {
        const {el, button, menu} = createMenu();
        const counters = [0, 0, 0];
        body.appendChild(el);

        // wait menuitem to trigger slot changed
        await wait();

        const items = [...el.querySelectorAll(DROPDOWN_MENUITEM_TAG_NAME)];

        items.forEach((i, index) => i.addEventListener('activate-item', () => counters[index]++));

        items[1].click();

        t.eq(counters, [0, 1, 0]);
    });

    t.test(`activate item on keyboard`, t => {

        t.test(`pressing Space`, async t => {
            const {el, button, menu} = createMenu();
            const counters = [0, 0, 0];
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            const items = [...el.querySelectorAll(DROPDOWN_MENUITEM_TAG_NAME)];

            items.forEach((i, index) => i.addEventListener('activate-item', () => counters[index]++));

            el.selectedIndex = 0;

            items[0].dispatchEvent(new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true
            }));

            t.eq(counters, [1, 0, 0]);
        });

        t.test(`pressing Enter`, async t => {
            const {el, button, menu} = createMenu();
            const counters = [0, 0, 0];
            body.appendChild(el);

            // wait menuitem to trigger slot changed
            await wait();

            const items = [...el.querySelectorAll(DROPDOWN_MENUITEM_TAG_NAME)];

            items.forEach((i, index) => i.addEventListener('activate-item', () => counters[index]++));

            el.selectedIndex = 2;

            items[2].dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true
            }));

            t.eq(counters, [0, 0, 1]);
        });
    });
});
