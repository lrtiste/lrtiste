import {test} from 'zora';
import {body, DROPDOWN_MENUITEM_TAG_NAME} from '../util.js';

/** @test {DropdownMenuitem} */
test(`DropdownMenuitem component`, t => {
    t.test(`DropdownMenuItem is connected`, t => {
        const el = document.createElement(DROPDOWN_MENUITEM_TAG_NAME);
        body.appendChild(el);
        t.eq(el.getAttribute('role'), 'menuitem');
        t.eq(el.getAttribute('slot'), 'menu-content');
        t.eq(el.getAttribute('tabindex'), '-1', 'should be programmatically focusable');
    });

    /** @test {DropdownMenuitem#activate} */
    t.test(`should emit 'activate-item' event when 'activate' method is called`, t => {
        let calls = 0;
        const el = document.createElement(DROPDOWN_MENUITEM_TAG_NAME);
        body.appendChild(el);

        el.addEventListener('activate-item', ev => {
            calls++;
        });
        el.activate();
        t.eq(calls, 1);
    });
});