import {test} from 'zora';
import {body, TAB_TAG_NAME} from '../util.js';

/**
 * @test {Tab}
 */
test('Tab Component', ({test}) => {

    test('Tab is connected', t => {
        const el = document.createElement(TAB_TAG_NAME);
        body.appendChild(el);
        t.eq(el.getAttribute('role'), 'tab', 'should have the role tab');
        t.eq(el.getAttribute('slot'), 'tablist', 'should be put in the tablist slot');
    });

    /**
     * @test {Tab#selected}
     */
    test('selected getter should follow aria-selected attribute', t => {
        const el = document.createElement(TAB_TAG_NAME);
        t.eq(el.selected, false);
        el.setAttribute('aria-selected', 'true');
        t.eq(el.selected, true);
        el.setAttribute('aria-selected', 'false');
        t.eq(el.selected, false);
    });
});